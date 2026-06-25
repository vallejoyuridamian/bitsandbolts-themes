# Bits and Bolts Themes - Changelog

Keep new changes easy to scan at the top.

---

## Session wrap-up (2026-06-25) - Bits & Bolts brand theme

### What changed
- Added the `bitsandbolts` theme with light, dark, and icon token files.
- Added generated web CSS for the `bitsandbolts` theme.
- Added Montserrat and Orbitron web font assets and copied them into the web distribution folder.
- Updated the theme build list so `bitsandbolts` is built with the other themes.
- Extended the build script to copy web font assets into `dist/web/fonts`.
- Documented `bitsandbolts` in the README theme table.

### Verification
- JSON token files parsed successfully.
- `node --check build.js` passed.
