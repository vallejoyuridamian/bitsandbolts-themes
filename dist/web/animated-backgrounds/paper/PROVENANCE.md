# Paper shader inputs

Pinned package: @paper-design/shaders 0.0.80.
Source: https://github.com/paper-design/shaders
Package: https://registry.npmjs.org/@paper-design/shaders/-/shaders-0.0.80.tgz
Integrity: sha512-pcabvt5xDlFoEhpjUj4b1tGJMfqb0i5mXifWMNQf6z7FoOJYxYDo7F8R6k0JAh5D/7ouxjX5+N0cIq5WURyQ1Q==

The six JavaScript modules derive from the pinned upstream code, with source-map
directives removed because maps are not distributed here. noise.png is the exact PNG
embedded in the upstream get-shader-noise-texture.js module. LICENSE and
NOTICE are retained verbatim. Cluna uses these shader inputs under its own
explicit timeline and resource lifecycle; the Paper DOM player is not included.

Local adaptation, 2026-09-11: Smoke Ring retains the upstream ring, polar mapping,
shape controls and color/alpha composition. It supplies mathematical kernels to
Cluna's context-agnostic prepared-field renderer:

- Bake all eight weighted value-noise layers once into a 1024-square RG8 field,
  storing a normalized scalar with packed 16-bit precision. Linear filtering
  applies to its linear channel decode. Resident noise storage is 2 MiB.
- Wrap the base integer lattice at 32 and use octave frequency 2.0 instead of
  upstream 1.99 so every octave shares a seamless periodic domain. This changes
  the noise realization and was visually accepted by the owner before the next
  temporal refinement. It is not an exact-pixel equivalent of upstream.
- Evaluate scalar coverage at a maximum 960 px long edge, 960x540 at full HD.
  The shared field owner now retains four R8 sample surfaces for two neighboring
  samples per active pair of Scenes. Coverage storage is about 2 MiB; combined
  field storage is 4170752 bytes at full HD, excluding existing input/output.
- Temporal sampling uses a fixed 15-Hz timeline grid for every Smoke setting.
  The generic field sampling helper interpolates scalar, vector or RGBA channels;
  the existing requested output clock is unchanged. Scrub/export resolve direct
  bracketing times, with no replay or independent player. There is no setting-
  dependent eligibility threshold. Zero speed reuses one exact-time field.
- Coverage skips guaranteed-empty regions using conservative radial distortion
  bounds [0.79, 2.2], with filtering padding. The final shader writes the complete
  output once, including constant background pixels, replacing separate clear
  and smoke writes. The reference comparison has identical output pixels for
  that fused-output change alone. Color dithering remains unchanged.

Native NV118 measurements: fused output alone reduces the complete reference
batch from about 3.105 to 2.636 ms. Fixed temporal interpolation plus fused output
averages 2.448 ms across 12 output frames (range 1.823-3.072 ms), with six new mask
evaluations. These are native measurements, not browser acceptance. Reference
interpolation looks close in a local still; thin/fast coverage shows substantial
error. The owner accepts the fixed-rate Smoke result on 2026-09-11. This accepts its
appearance, not a strict browser GPU ceiling.

Sibling rollout, 2026-09-11: Mesh Gradient and Swirl retain their original
mathematical kernels and supply complete premultiplied RGBA fields through the
same fixed 15-Hz, 960-long-edge policy. One generic color-field definition and
output shader own spatial/temporal interpolation for both. Four RGBA8 samples
occupy 8294400 bytes at full HD per effect, excluding output surfaces. Full-target
kernels skip a redundant field clear. No setting rule, second player or clock is
introduced; original shader modules remain unchanged.

Native NV118 full-HD means across 12 output frames: Mesh Gradient decreases from
12.274 to 3.752 ms (sampled range 1.919-5.581 ms); Swirl from 10.945 to 3.526 ms
(range 1.922-5.132 ms). Each evaluates six new fields for 12 output frames. Normal
RGBA mean differences versus direct output are 0.120/255 and 0.499/255. Mesh max
difference is 1; Swirl has larger differences at moving edges (max 91). Fast Swirl
mean is 2.321/255, max 96. Direct return scrub and translucent-alpha checks pass.
These are native measurements; browser performance and sibling visual acceptance
remain pending. The shared engine and quality policy apply to all three effects.
