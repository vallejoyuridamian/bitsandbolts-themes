// Canonical effect presentation and authored parameter contracts.
const speed = { key: 'speed', label: 'Speed', min: 0, max: 2, step: 0.01, initial: 0.5 };
const scale = { key: 'scale', label: 'Scale', min: 0.1, max: 2, step: 0.01, initial: 0.8 };
export const animatedBackgroundEffects = Object.freeze([
  {
    id: 'smoke-ring', name: 'Smoke Ring',
    colors: { primary: '#ffffff', secondary: '#000000' },
    fields: [speed, scale,
      { key: 'radius', label: 'Radius', min: 0.05, max: 1, step: 0.01, initial: 0.41 },
      { key: 'thickness', label: 'Thickness', min: 0.01, max: 1, step: 0.01, initial: 0.07 }],
    uniforms: { u_innerShape: 0.7, u_noiseScale: 3, u_noiseIterations: 8 },
    parameterUniforms: { radius: 'u_radius', thickness: 'u_thickness' },
    colorSlots: ['primary'], backgroundSlot: 'secondary', noiseTexture: true
  },
  {
    id: 'mesh-gradient', name: 'Mesh Gradient',
    colors: { primary: '#71d2d7', secondary: '#182122' },
    fields: [speed, { ...scale, initial: 1 }],
    uniforms: { u_distortion: 0.8, u_swirl: 0.1, u_grainMixer: 0, u_grainOverlay: 0 },
    parameterUniforms: {}, colorSlots: ['primary', 'secondary']
  },
  {
    id: 'swirl', name: 'Swirl',
    colors: { primary: '#71d2d7', secondary: '#182122' },
    fields: [{ ...speed, initial: 0.32 }, { ...scale, initial: 1 }],
    uniforms: { u_bandCount: 4, u_twist: 0.1, u_center: 0.2, u_proportion: 0.5,
      u_softness: 0, u_noise: 0.2, u_noiseFrequency: 0.4 },
    parameterUniforms: {}, colorSlots: ['primary'], backgroundSlot: 'secondary'
  }
]);
