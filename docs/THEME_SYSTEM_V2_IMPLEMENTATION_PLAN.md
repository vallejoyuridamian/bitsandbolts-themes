# Theme System v2 Implementation Plan

Status: Slice 1 web reference implemented; executable and cross-platform gates remain open  
Research basis: `../research/theme-system-standard-deep-research.md` in the workspace  
Authoritative owner: `bitsandbolts-themes`

## Ratified direction

- `bitsandbolts-themes` exclusively owns reusable visual UI intent across every product and platform.
- DTCG 2025.10 Format and Resolver are the portable token foundation. The separately versioned Bits & Bolts contract owns recipes, art direction, assets, validation, fallbacks, overrides, and release metadata.
- Runtime selection is `familyId + mode + declared density`. Art direction is authored into a family, not exposed as an independent switch.
- Normal creators begin with four identity color decisions. Themes resolve those inputs into 48 required semantic color roles.
- Typography requires one primary family and one mono family; accent is optional. Authored fallback stacks are forbidden. Usage is expressed through semantic text styles.
- Products own structure, content, behavior, semantic accessibility wiring, domain state, and functional geometry. They do not own reusable colors, typography, icons, visual spacing, radii, borders, depth, control appearance, visual states, or decorative motion.
- v2 ships beside v1. No v1 path is removed until automated evidence shows zero consumers.

## Target architecture

```text
DTCG tokens + B&B family/recipe documents
                  |
      validate and resolve every allowed tuple
                  |
       normalized, platform-neutral model
          /          |          |          \
   static/web      React     Compose    React Native
                  |
      one synchronized, versioned release
```

The source repository is authoritative. Generated files are release artifacts, never hand-maintained mirrors. A release carries distinct `contractVersion`, per-family `themeVersion`, and synchronized `artifactVersion` values.

## Checkpoint record — 2026-08-08

The research-backed architecture is ratified. DTCG 2025.10 remains the pinned
portable value/resolution substrate; the B&B contract owns the visual semantics
that DTCG does not: recipes, art direction, assets,
fallbacks, validation, provenance, and overrides. The mandatory target remains
four creator identity colors, 48 core semantic color roles, primary and mono
families with optional accent, fourteen semantic text styles, explicitly
allowed family/mode/density tuples, and the 37-recipe conformance battery.

Implemented in the first visible web reference:

- `contractVersion 2.0.0` source beside v1, B&B family metadata, light/dark
  standard-density modes, four identity colors, 48 semantic colors, fourteen
  text styles, art-direction traits, and the declarative Button recipe;
- one generated catalog consumed by AppScreen Studio, showing one selected
  family and one light/dark mode at a time with the Button state specimen;
- theme-owned Product Entry, Theme Gallery, Page Gallery, Button v2, typography,
  and shared Selection Controls web recipes;
- AppScreen Themes and Pages inspection workspaces. Both use the same product
  markup owner and theme selector recipe; Pages shows one real landing at a time
  and leaves scrolling to the embedded page;
- exact primary-family values without authored fallback stacks and bundled
  generated font artifacts; and
- a clean theme build. Base tokens are generator `include` defaults and family
  tokens are authoritative `source` overrides; removing the previous collision
  warnings changed none of the 94 generated artifact hashes.

This does **not** complete the research's first vertical slice. Pinned DTCG
Format/Resolver conformance, deterministic provenance, complete license/glyph
manifests, React/Compose/React Native Button adapters, packaged no-mirror
delivery, platform fallback fixtures, cross-platform accessibility gates, and
human approval on every target remain open. Cloud is now v2; Ocean and Robot
remain v1 families.

## Incremental slices and acceptance gates

### 1. B&B visual reference — web checkpoint implemented

Deliver the v2 contract beside v1, B&B light/dark source data, the four identity colors, 48 semantic colors, real primary/mono/accent families, structured art direction, and the first theme-owned Button web recipe. Show only one family and one mode at a time in AppScreen Studio.

Gate:

- v1 builds and consumers remain operational.
- Contract, family, mode, and recipe sources validate during generation.
- The catalog exposes v2 only where the complete reference data exists.
- The Themes tab renders identity first and keeps all 48 semantic roles behind disclosure.
- Button visibly covers primary, secondary, quiet, destructive and rest, hover, focus-visible, pressed, loading, disabled cases.
- Product code contains no Button visual values; it imports the theme-owned recipe stylesheet and generated runtime data.
- Focus, forced-colors, reduced-motion, and 44px ordinary web target behavior exist.
- Focused automated tests pass; subjective browser acceptance is user-owned.

This checkpoint is not the complete cross-platform Button slice. It exists to make the vocabulary and art direction visible before adapters multiply it.

### 1A. Canonical app-surface primitives — current transition

Before resuming landing acceptance or advancing the broader contract, use the
accepted AppScreen Studio interface as direct evidence for the next reusable web
batch. Themes must own:

- the workspace/canvas background role, including review of the current B&B
  neutral value rather than preserving its name or value by inertia;
- a Select/dropdown-trigger recipe covering color, border, type, caret, focus,
  hover, pressed/open, disabled, and motion;
- shared interaction-state roles that Select, Button, and Menu may consume where
  their feedback is genuinely the same, without merging their distinct anatomy;
- a Menu surface/item recipe shared by emergent and context menus, including
  depth, outline, separators, ordinary items, disabled items, informational text,
  hover/focus/pressed states, and safe motion; and
- showcase specimens rendered by the same gallery owner used locally, on GitHub
  Pages, and inside AppScreen.

AppScreen retains menu invocation, keyboard routing, commands, selection, and
domain behavior. Themes owns only reusable visual intent and state mapping. New
families must satisfy the required recipe roles; existing v1 families receive an
explicit compatible fallback or fail generation rather than silently drifting.

Version posture: keep this convergence work on the current in-progress contract
without a new major/minor theme version while the recipe is being accepted. Use
a patch only if an already-consumed contract must change; freeze the final version
decision after browser acceptance of the complete batch.

Gate:

- AppScreen and the shared showcase render the same Select/Menu/background
  recipes without product-local visual values;
- hover roles are shared only where direct comparison proves visual equivalence;
- ordinary, hover, focus-visible, pressed/open, disabled, separator, and info
  states are visible and keyboard/accessibility semantics remain product-owned;
- every required family resolves or declares an explicit fallback; and
- existing landing/publication behavior and Cloud Clipboard delivery are unchanged.

### 2. Complete the executable contract

Expand the validator and normalized model to cover spacing, density, all fourteen text styles, concrete component presentation, icon/assets, interaction states, product-domain namespaces, platform capabilities, declared fallbacks, license/glyph manifests, and override records. Add pinned DTCG Resolver contexts and deterministic OKLCH-to-sRGB generation.

Gate:

- Every allowed family/mode/density tuple resolves; undeclared tuples fail.
- Missing references, cycles, type mismatches, missing roles, and undeclared capability degradation fail generation.
- Two clean builds from identical inputs produce equivalent manifests and artifact hashes apart from explicitly excluded metadata.
- A provenance manifest records source, generator, contract, theme, artifact, asset, capability, and fallback versions.

### 3. Migrate Button vertically

Generate or implement adapters for static HTML/CSS, React/AppScreen, Compose, and React Native from the same normalized recipe. Products continue to own button semantics and behavior.

Gate:

- Every adapter renders the declared anatomy, variants, sizes, and applicable states.
- No adapter consumes primitives directly where a semantic or component binding exists.
- WCAG 2.2 AA contrast gates pass; web targets are at least 44px and Android targets at least 48dp.
- Keyboard focus, forced colors, text scaling, reduced motion, and declared visual fallbacks pass automated and manual review.
- Canonical specimens receive human visual acceptance on every target.

### 4. Eliminate manual mirrors

Publish synchronized artifacts as npm packages for contract/web/React/React Native, a Maven artifact for Compose, and an immutable versioned archive for static/offline consumers. Workspace links and local Maven composition remain development-only.

Gate:

- Consumers pin exact artifact versions with lockfiles.
- CI tests packaged artifacts, not only source checkouts.
- No product copies CSS, JSON, Kotlin, JavaScript, fonts, icons, or images by hand.
- CDN assets, if used, are immutable and version/content-hash qualified; production never depends on `latest`.

### 5. Establish complete switching continuity

Implement one resolver and preference model across landing, guest Studio, sign-in, and account Studio. Resolve precedence as: accessibility adaptation, scoped preview, account choice, guest/local choice, OS policy, family default.

Gate:

- Landing applies the last validated selection before first themed paint.
- Guest Studio inherits landing appearance without a flash or reset.
- Sign-in preserves appearance until account state resolves, then changes atomically only when necessary.
- Failed resolution retains the last-known-good theme; a bundled non-editable recovery theme exists.
- A Themes-tab preview is subtree-scoped and never mutates the Studio root.

### 6. Migrate component families in accepted batches

Migrate the 37-recipe conformance battery in small coherent groups: actions; inputs; navigation; overlays; containers; feedback; collections; progress/content state; browser chrome; marketing entry; Studio domains.

Gate for each batch:

- The recipe, states, accessibility, capabilities, fallbacks, and canonical specimens are complete before product adoption.
- Landing and Studio visual continuity remain intact.
- A visual batch is accepted before the next batch begins.
- No unrelated repository-wide restyle is included.

### 7. Migrate first-party families

Move Ocean and Robot to v2 one family and mode pair at a time, followed by any remaining B&B recipes.

Gate for each family:

- Full contract completeness and mandatory component coverage.
- Product identity survives human review; objective accessibility and platform checks pass.
- Existing consumers opt into the exact new artifact version intentionally.

### 8. Enable user-created themes

Implement the Studio lifecycle: create draft, edit, validate, isolated preview, save immutable valid snapshot, export/import, optional publish, and atomic activation. User themes are declarative bundles; arbitrary CSS and JavaScript are forbidden.

Gate:

- Invalid drafts can be saved but can never style Studio itself or become active.
- Studio keeps the previous valid snapshot while editing its current theme.
- Imports enforce archive, path, size, type, SVG, font, hash, license, glyph, capability, and fallback rules.
- Preview runs in an isolated boundary with restrictive policy and a recovery path.
- Contract migration creates a new draft and never mutates the last valid version in place.

### 9. Retire v1

Gate:

- Machine-verifiable dependency and runtime evidence shows zero v1 consumers.
- All supported products and platforms consume pinned v2 artifacts.
- Removal has an approved migration record and rollback release.

## Rare override workflow

An exception exists only as a themes-repository override record containing a stable ID, owner, rationale, exact scope, approved category, review date, objective removal condition, validation, canonical previews, release visibility, and external authority where applicable. Valid categories are external brand, platform technical, accessibility, legal, migration, or explicitly approved other. “Easier to keep locally” is never sufficient.

## Scope boundary

This plan includes landing-page standardization, Studio themes, and seamless landing → guest → sign-in → account appearance continuity. It excludes observability, billing, deployment architecture, and public-access infrastructure.
