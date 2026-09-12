export { vertexShaderSource } from './paper/vertex-shader.js';
import { vertexShaderSource } from './paper/vertex-shader.js';
import { sampledColorRenderDefinition } from './field-sampling.js';
import { smokeRingFragmentShader, smokeRingNoiseField, smokeRingCoverageField } from './paper/shaders/smoke-ring.js';
import { meshGradientFragmentShader } from './paper/shaders/mesh-gradient.js';
import { swirlFragmentShader } from './paper/shaders/swirl.js';
// Each effect declares only the capabilities it needs. Consumers share one owner.
export const animatedBackgroundRenderDefinitions = Object.freeze({
  'smoke-ring': Object.freeze({ fragment: smokeRingFragmentShader,
    preparedFields: Object.freeze([smokeRingNoiseField]),
    frameFields: Object.freeze([smokeRingCoverageField]) }),
  'mesh-gradient': sampledColorRenderDefinition({ id: 'mesh-gradient-color',
    vertex: vertexShaderSource, fragment: meshGradientFragmentShader }),
  swirl: sampledColorRenderDefinition({ id: 'swirl-color',
    vertex: vertexShaderSource, fragment: swirlFragmentShader })
});
export const animatedBackgroundNoiseUrl = new URL('./paper/noise.png', import.meta.url).href;
