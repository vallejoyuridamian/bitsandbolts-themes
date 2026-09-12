// Generic interpolation for scalar, vector and color fields. Effect math stays
// in the supplied kernel; the renderer owns sample times and texture lifetimes.
export const fieldSamplingPolicy = Object.freeze({ maxLongEdge: 960, sampleRate: 15 });

export const temporalFieldSamplingShader = `
vec4 sampleTemporalField(sampler2D first, sampler2D next, vec2 uv, float blend) {
  vec4 value = texture(first, uv);
  if (blend > 0.) value = mix(value, texture(next, uv), blend);
  return value;
}
`;

const sampledColorOutputShader = `#version 300 es
precision mediump float;
uniform vec2 u_resolution;
uniform sampler2D u_colorField;
uniform sampler2D u_colorFieldNext;
uniform float u_colorFieldMix;
out vec4 fragColor;
${temporalFieldSamplingShader}
void main() {
  fragColor = sampleTemporalField(u_colorField, u_colorFieldNext,
    gl_FragCoord.xy / u_resolution, u_colorFieldMix);
}
`;

// Complete color kernels use the same field contract as scalar/vector kernels.
// Premultiplied channels preserve compositing when filtered in space and time.
export function sampledColorRenderDefinition({ id, vertex, fragment, inputs = [] }) {
  return Object.freeze({
    fragment: sampledColorOutputShader,
    frameFields: Object.freeze([Object.freeze({
      id, vertex, fragment, inputs: Object.freeze(inputs),
      maxLongEdge: fieldSamplingPolicy.maxLongEdge,
      internalFormat: 'RGBA8', bytesPerPixel: 4, coversTarget: true,
      sampler: 'u_colorField',
      temporal: Object.freeze({ sampleRate: fieldSamplingPolicy.sampleRate,
        nextSampler: 'u_colorFieldNext', blendUniform: 'u_colorFieldMix' })
    })])
  });
}
