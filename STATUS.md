# Bits and Bolts Themes — Status

Last verified: 2026-08-11

## Current Truth

- Five themes are generated: `cloud`, `ocean`, `slate`, `robot`, and
  `bitsandbolts`, each with light and dark variants.
- The deep-research architecture is ratified: pinned DTCG 2025.10 values and
  resolution plus a separately versioned B&B contract for recipes, art
  direction, assets, fallbacks, validation, provenance, and overrides.
- The first B&B v2 web reference now includes light/dark standard-density family
  data, four identity colors, 48 semantic color roles, fourteen text styles,
  shape/material/depth/motion specimens, and a declarative Button recipe.
- Generated web catalog data drives AppScreen's Themes tab one family/mode at a
  time. AppScreen's Pages tab previews one managed site/page/source at a time.
- Themes now owns the gallery renderer itself. One source generates the local
  `pnpm dev` showcase, the self-contained `docs/` GitHub Pages bundle, and the
  AppScreen Themes workspace through a one-line product adapter.
- Themes now also owns canonical workspace-background, Select, shared
  interaction-state, and Menu roles/recipes. AppScreen consumes their classes
  while retaining selection, commands, keyboard behavior, invocation, and
  positioning. Cloud, Ocean, Robot, and Slate declare explicit v1 fallbacks;
  generation rejects any family without the complete interface role set.
- Product Entry, Theme Gallery, Page Gallery, Button v2, typography, and the
  shared Selection Controls recipe are canonical theme-owned web components.
- Product Entry now supports declarative managed landing documents through
  semantic icon roles whose concrete Material glyphs remain theme-owned. The
  AppScreen Studio candidate proves the full navigation, hero proof, workflow,
  offer, policy, and footer composition without product-local visual code.
- Every v1 family/mode now resolves the shared marketing shell, brand chrome,
  information-surface, plan-tone, status, and Button dependencies. The build
  rejects missing marketing roles and literal colors in the marketing recipe.
- The marketing contract also owns secondary content cards, managed forms,
  deletion status, and hosted auth-action layouts/states used by every Cloud
  Clipboard secondary page; the private site repository contributes no CSS.
- Themes and Pages share one selector recipe and one product markup owner. The
  recipe supports Studio's canonical vertical left-sidebar arrangement without
  introducing a second toolbar component. Themes owns its preview scrolling;
  Pages has no metadata title bar or outer scroll owner.
- The owner accepted the managed-draft publication control below the selectors:
  `Publish online`, no idle description, the original dark subtle-gradient
  toolbar treatment, and a light foreground token. Local and hosted use the same
  theme-owned presentation.
- The showcase shell explicitly uses Bits & Bolts Dark. Its own top bar now
  renders the canonical Select trigger/Menu, not a visible native select; its
  workspace resolves to AppScreen's exact dark `#0f1415`, while header/control
  chrome uses the canonical app background role. Internal Art direction notes
  are not rendered.
- Themes owns the managed My Website homepage's canonical `portfolio-home`
  recipe: its original font boundaries, responsive composition, components,
  and vector icon treatment without React or product-local CSS.
- The owner accepted the managed portfolio homepage on desktop and narrow as a
  locked good-enough, not pixel-perfect, clone; the React reference is unchanged.
  The final accepted checkpoint includes the repaired alternating roadmap and
  the shared edge-fade mask on the testimonial and NeuroSharp background art.
- Themes owns the reusable Navbar markup, CSS, controller, placements, and
  responsive side panel. Managed My Website JSON is its first accepted consumer.
- One renderer supplies its local, GitHub Pages, and AppScreen specimens;
  generated source, `dist/web`, and `docs` artifacts are byte-identical.
- UI icons are inline SVG vectors or original assets. Emoji and Unicode text
  glyphs are forbidden as UI icon substitutes; stars and carousel controls use
  vectors. Review flags currently use lightweight 64x48 FlagCDN images and are
  accepted transition debt, not the future canonical theme icon contract.
- Themes generation, Sites' 30/30 checks and build, and AppScreen's focused
  9/9 theme-gallery contract pass.

## Open Gates

- The v2 web reference is not the full research-mandated vertical Button slice.
  Pinned DTCG Resolver validation, provenance/reproducibility manifests,
  license/glyph coverage, platform fallbacks, and React/Compose/RN adapters are
  still required.
- Versioned npm/Maven/static delivery is not implemented; manual mirrors remain
  forbidden but still exist as migration debt.
- `mywebsite/public/theme/` is such a copy today; its button and marketing
  components differ from the current canonical files. The managed Cloud
  Clipboard draft now consumes canonical generated artifacts instead.
- The managed Cloud Clipboard route now serves canonical generated assets. Its
  preserved Pages rollback source and `mywebsite/public/theme/` mirror remain
  migration debt; the main React website and AppScreen's legacy Studio
  stylesheet also remain app-local visual debt.
- Cloud, Ocean, Slate, and Robot remain v1 until migrated one family at a time.
- Studio and Cloud retain their navigation. Sites still wires Navbar placement
  and CSS/JS assets; fully declarative JSON dispatch is separately gated.

## Next Boundary

- The Navbar slice and first consumer are accepted. Await an explicit fresh
  instruction before another consumer or component.
- Possible next work is declarative JSON wiring or one consumer migration. Keep
  footer, CTA, cards, icons, flags, cyan, and renderer cleanup separately gated.
- The current B&B v2 specimens are not the visual reference for this work. The
  owner rejected that family except for the cut-out button shape; use the
  accepted managed homepage as the primary B&B identity reference.
- Resume the AppScreen Product Entry landing only when the owner explicitly
  returns to it; preserve `/ → /try → /app` continuity.
- Keep this as a transition patch to the current contract where compatible; do
  not start a new theme version merely to checkpoint exploratory convergence.
- Preserve the accepted Cloud Clipboard publication and every route boundary.
