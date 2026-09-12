import { pageCurlShader } from './page-curl.js';
import { burnNoiseShader } from './noise.js';
const colorVector = (color) => [1, 3, 5].map((offset) => parseInt(color.slice(offset, offset + 2), 16) / 255);
export const transitionVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() { gl_Position = vec4(a_position, 0., 1.); v_uv = a_uv; }
`;
export const transitionSamplingShader = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform vec4 u_fromRect;
uniform vec4 u_toRect;
uniform vec4 u_fromDomain;
uniform vec4 u_toDomain;
uniform vec2 u_transparent;
uniform vec2 u_flip;
uniform float progress;
uniform float ratio;
uniform float u_opacity;
uniform float u_grayscale;
vec4 readInput(sampler2D tex, vec2 p, vec4 rect, vec4 domain, float empty, float flip) {
  if (empty > .5) return vec4(0.);
  vec2 q = (p - domain.xy) / domain.zw;
  if (any(lessThan(q, vec2(0.))) || any(greaterThan(q, vec2(1.)))) return vec4(0.);
  if (flip > .5) q.y = 1. - q.y;
  return texture2D(tex, rect.xy + q * rect.zw);
}
vec4 getFromColor(vec2 p) { return readInput(u_from, p, u_fromRect, u_fromDomain, u_transparent.x, u_flip.x); }
vec4 getToColor(vec2 p) { return readInput(u_to, p, u_toRect, u_toDomain, u_transparent.y, u_flip.y); }
`;
export const transitionShaderDefinitions = Object.freeze({
  aperture: { uniforms: (params) => ({ u_axis: params.axis === 'vertical' ? 1 : 0, u_close: params.mode === 'close' ? 1 : 0 }), source: `
uniform float u_axis;
uniform float u_close;
vec4 transition(vec2 p) {
  float t = mix(progress, 1. - progress, u_close);
  float coord = mix(p.y, p.x, u_axis);
  float edge = 2. * t - abs(coord - .5) / max(t, .000001);
  float coverage = smoothstep(0., .5, edge);
  coverage = mix(coverage, 1. - coverage, u_close);
  return mix(getFromColor(p), getToColor(p), coverage);
}` },
  burn: { uniforms: (params) => ({ u_burnColor: colorVector(params.color) }),
    field: { id: 'burn-noise', width: 512, height: 512, bytesPerPixel: 1, internalFormat: 'R8', wrap: 'CLAMP_TO_EDGE', inputs: [],
      fragment: `#version 300 es\nprecision highp float;\nout vec4 color;\n${burnNoiseShader}\nvoid main() { vec2 uv = vec2(gl_FragCoord.x, 512. - gl_FragCoord.y) / 512.; color = vec4(fbm(uv * 4.), 0., 0., 1.); }` }, source: `
uniform sampler2D u_field;
uniform vec3 u_burnColor;
vec4 transition(vec2 p) {
  vec2 fieldScale = vec2(min(ratio, 1.), min(1. / ratio, 1.));
  vec2 fieldUV = (p - .5) * fieldScale + .5;
  float n = texture2D(u_field, vec2(fieldUV.x, 1. - fieldUV.y)).r;
  float coverage = smoothstep(progress, progress + .05, n);
  vec4 from = getFromColor(p);
  vec4 to = getToColor(p);
  vec4 color = mix(to, from, coverage);
  float edge = (1. - coverage) * coverage * 5.;
  color.rgb = min(vec3(color.a), color.rgb + u_burnColor * edge * color.a);
  return color;
}` },
  'page-curl': { uniforms: (params) => ({ u_backColor: colorVector(params.backColor) }), source: pageCurlShader }
});
export function transitionFragmentShader(id) {
  const definition = transitionShaderDefinitions[id];
  if (!definition) throw new Error(`Unknown transition effect: ${id}`);
  return `${transitionSamplingShader}\n${definition.source}\nvoid main() {
    vec4 color;
    if (progress <= 0.) color = getFromColor(v_uv);
    else if (progress >= 1.) color = getToColor(v_uv);
    else color = transition(v_uv);
    color.rgb = mix(color.rgb, vec3(dot(color.rgb, vec3(.2126, .7152, .0722))), u_grayscale);
    gl_FragColor = color * u_opacity;
  }`;
}
