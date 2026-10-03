# Shared authentication checkbox correction

The owner requires workspace-wide authenticated-session continuity and opted-in
persistence across app lifecycles, with Keep me signed in unchecked by default.
AUTHENTICATION_STANDARD.md owns behavior for every app, and ACCOUNT_ACCESS_UI_STANDARD.md owns exact presentation. Cluna implementation was explicitly approved
after those rules were installed.

components/account-funnel.js extracts its existing consent checkbox row into
one generic helper, also consumed by optional remembered-login markup. The
existing consent error ID, row classes, typography, midpoint alignment, full
clickable label and hidden field error contract remain intact. No checkbox CSS,
icon, font or product-local lookalike is added. Cluna supplies the label and
reads the native checked value through its existing event router for password,
Google and account creation through Google.

One pnpm build regenerates canonical dist/web and docs/theme output. All three
account-funnel modules are identical. Four focused account-funnel checks pass;
Studio Auth/Guest source graphs and safe session diagnostic fixtures pass. The
existing 39-token collision warnings are reported as a separate unchanged gate.
No Studio product build, product/browser service, publication, commit or push.

Fresh Cluna owner review is required for the new checkbox; previous login/logout
approval applies to the earlier exact state. Studio's controlling Auth plan,
STATUS and docs/history/AUTH_ASSETS_IMPLEMENTATION_2026-10-02.md own the full
implementation and complete owner browser sequence. No standalone route or
specimen was created.
