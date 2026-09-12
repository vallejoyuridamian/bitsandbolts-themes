/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                    Paper Shaders                    *
 *       https://github.com/paper-design/shaders       *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import { vertexShaderSource } from "../vertex-shader.js";
import { fieldSamplingPolicy, temporalFieldSamplingShader } from "../../field-sampling.js";
import { declarePI, colorBandingFix } from "../shader-utils.js";
const smokeRingMeta = {
  maxColorCount: 10,
  maxNoiseIterations: 8
};
const field = Object.freeze({ size: 1024, period: 32, octaves: 8, frequency: 2, decay: 0.65, amplitude: 0.4 });
const fieldAmplitude = field.amplitude * (1 - field.decay ** field.octaves) / (1 - field.decay);
const coverageLongEdge = fieldSamplingPolicy.maxLongEdge;
// Canonical contain-fit Smoke transform: centered, no offset, with uniform scale.
// Reserve filtered-coverage texels outside the conservative support radius.
function smokeRingBounds({ uniforms, width, height }) {
  const radius = (uniforms.u_radius + uniforms.u_thickness) / .79 * uniforms.u_scale * Math.min(width, height);
  const padding = Math.max(2, Math.max(width, height) / coverageLongEdge * 2);
  const x = Math.max(0, Math.floor(width / 2 - radius - padding));
  const y = Math.max(0, Math.floor(height / 2 - radius - padding));
  return { x, y,
    width: Math.max(0, Math.min(width, Math.ceil(width / 2 + radius + padding)) - x),
    height: Math.max(0, Math.min(height, Math.ceil(height / 2 + radius + padding)) - y) };
}
const valueNoiseShader = `
float randomR(vec2 p) {
  vec2 uv = mod(floor(p), ${field.period}.) / 100. + .5;
  return texture(u_noiseTexture, fract(uv)).r;
}
float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomR(i);
  float b = randomR(i + vec2(1.0, 0.0));
  float c = randomR(i + vec2(0.0, 1.0));
  float d = randomR(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}`;
const smokeRingNoiseField = Object.freeze({
  id: 'smoke-ring-fractal-noise', width: field.size, height: field.size,
  internalFormat: 'RG8', bytesPerPixel: 2, wrap: 'REPEAT',
  sampler: 'u_noiseField', inputs: ['u_noiseTexture'],
  fragment: `#version 300 es
precision highp float;
uniform sampler2D u_noiseTexture;
out vec4 fragColor;
${valueNoiseShader}
void main() {
  vec2 p = gl_FragCoord.xy * (${field.period}. / ${field.size}.);
  float total = 0.;
  float amplitude = ${field.amplitude};
  for (int i = 0; i < ${field.octaves}; i++) {
    total += valueNoise(p) * amplitude;
    p *= ${field.frequency}.;
    amplitude *= ${field.decay};
  }
  // Two normalized channels retain scalar precision through linear filtering.
  float encoded = floor(clamp(total / ${fieldAmplitude}, 0., 1.) * 65535. + .5);
  fragColor = vec4(floor(encoded / 256.) / 255., mod(encoded, 256.) / 255., 0., 1.);
}
`
});
const smokeRingCoverageShader = `#version 300 es
precision mediump float;

uniform float u_time;

uniform sampler2D u_noiseField;

uniform float u_thickness;
uniform float u_radius;
uniform float u_innerShape;
uniform float u_noiseScale;

in vec2 v_objectUV;

out vec4 fragColor;

${declarePI}
float fieldNoise(vec2 p) {
  return dot(texture(u_noiseField, p / ${field.period}.).rg, vec2(256. / 257., 1. / 257.)) * ${fieldAmplitude};
}
float getNoise(vec2 uv, vec2 pUv, float t) {
  vec2 left = pUv + .03 * t;
  float period = max(abs(u_noiseScale * TWO_PI), 1e-6);
  float blend = smoothstep(-.25, .25, uv.x);
  if ((pUv.x >= 0. && pUv.x < period) || blend >= 1.) return fieldNoise(left);
  vec2 right = vec2(fract(pUv.x / period) * period, pUv.y) + .03 * t;
  if (blend <= 0.) return fieldNoise(right);
  return mix(fieldNoise(right), fieldNoise(left), blend);
}

float getRingShape(vec2 uv) {
  float radius = u_radius;
  float thickness = u_thickness;

  float distance = length(uv);
  float ringValue = 1. - smoothstep(radius, radius + thickness, distance);
  ringValue *= smoothstep(radius - pow(u_innerShape, 3.) * thickness, radius, distance);

  return ringValue;
}

void main() {
  vec2 shape_uv = v_objectUV;
  float l = length(shape_uv);
  float ringShape = 0.;

  // Noise samples are in [0, 1]. Positive octave weights sum to less than
  // .4 / (1. - .65), so radial distortion stays in [.8, 2.172).
  // Widen that interval for mediump rounding before rejecting empty pixels.
  float innerRadius = u_radius - pow(u_innerShape, 3.) * u_thickness;
  if (l * .79 <= u_radius + u_thickness && l * 2.2 >= innerRadius) {
    float t = u_time;

    float cycleDuration = 3.;
    float period2 = 2.0 * cycleDuration;
    float localTime1 = fract((0.1 * t + cycleDuration) / period2) * period2;
    float localTime2 = fract((0.1 * t) / period2) * period2;
    float timeBlend = .5 + .5 * sin(.1 * t * PI / cycleDuration - .5 * PI);

    float atg = atan(shape_uv.y, shape_uv.x) + .001;
    float radialOffset = .5 * l - inversesqrt(max(1e-4, l));
    vec2 polar_uv1 = vec2(atg, localTime1 - radialOffset) * u_noiseScale;
    vec2 polar_uv2 = vec2(atg, localTime2 - radialOffset) * u_noiseScale;

    float noise1 = getNoise(shape_uv, polar_uv1, t);
    float noise2 = getNoise(shape_uv, polar_uv2, t);

    float noise = mix(noise1, noise2, timeBlend);

    shape_uv *= (.8 + 1.2 * noise);

    ringShape = getRingShape(shape_uv);
  }

  fragColor = vec4(ringShape, 0., 0., 1.);
}
`;
const smokeRingCoverageField = Object.freeze({
  id: 'smoke-ring-coverage', vertex: vertexShaderSource, fragment: smokeRingCoverageShader,
  maxLongEdge: coverageLongEdge, internalFormat: 'R8', bytesPerPixel: 1,
  sampler: 'u_coverageField', inputs: ['u_noiseField'], bounds: smokeRingBounds,
  temporal: Object.freeze({ nextSampler: 'u_coverageFieldNext', blendUniform: 'u_coverageMix',
    sampleRate: fieldSamplingPolicy.sampleRate
  })
});
const smokeRingFragmentShader = `#version 300 es
precision mediump float;
uniform vec2 u_resolution;
uniform sampler2D u_coverageField;
uniform sampler2D u_coverageFieldNext;
uniform float u_coverageMix;
uniform vec4 u_colorBack;
uniform vec4 u_colors[${smokeRingMeta.maxColorCount}];
uniform float u_colorsCount;
out vec4 fragColor;
${temporalFieldSamplingShader}
void main() {
  float ringShape = sampleTemporalField(u_coverageField, u_coverageFieldNext,
    gl_FragCoord.xy / u_resolution, u_coverageMix).r;
  // One complete output write replaces the separate clear plus smoke draw.
  if (ringShape <= 0.) {
    fragColor = vec4(u_colorBack.rgb * u_colorBack.a, u_colorBack.a);
    return;
  }
  float mixer = ringShape * ringShape * (u_colorsCount - 1.);
  int idxLast = int(u_colorsCount) - 1;
  vec4 gradient = u_colors[idxLast];
  gradient.rgb *= gradient.a;
  if (u_colorsCount > 1.) {
    for (int i = ${smokeRingMeta.maxColorCount} - 2; i >= 0; i--) {
      float localT = clamp(mixer - float(idxLast - i - 1), 0., 1.);
      vec4 c = u_colors[i];
      c.rgb *= c.a;
      gradient = mix(gradient, c, localT);
    }
  }

  vec3 color = gradient.rgb * ringShape;
  float opacity = gradient.a * ringShape;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  ${colorBandingFix}

  fragColor = vec4(color, opacity);
}
`;
export {
  smokeRingFragmentShader,
  smokeRingNoiseField,
  smokeRingCoverageField,
  smokeRingMeta
};
