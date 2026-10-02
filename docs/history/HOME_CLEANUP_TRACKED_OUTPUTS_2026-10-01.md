# Home cleanup and committed Theme outputs

Date: 2026-10-01

## Defect and ownership

The owner's home cleanup removed 561 tracked files under Themes `dist/`.
Canonical source files remained intact. Themes deliberately commits generated
outputs for direct consumption; removing them from tracking would require a
separate delivery decision.

The script's audit and artifact deletion repeated the artifact-name policy and
treated every matching directory as disposable. The owner authorized correcting
the script and rebuilding the deleted Theme outputs.

## Correction

`/home/damian/cleanup.sh` now owns one `project_artifact_dirs` policy used by
both audit and deletion. It excludes artifact directories containing Git-tracked
files and preserves a directory if its Git tracking check fails. Untracked
artifacts and dependencies remain eligible. This protection applies to artifact
directory removal; the separate temporary-file and log cleanup rules were not
changed. The home script remains outside the workspace Git repository.

## Verification

- Bash syntax check passed.
- Actual Themes audit and dry-run artifact removal both exclude committed
  `dist/` and retain `node_modules` as a reclaimable candidate.
- Injected Git failure preserves artifact directories.
- Untracked fixture artifacts remain eligible, including paths with spaces.
- `pnpm install --frozen-lockfile` and one `pnpm build` passed.
- The existing 39 token-collision warnings remain a separate known gate.
- Regenerated tracked `dist/` and `docs/` outputs match Git exactly; all 561
  tracked deletions are cleared. No Theme source or presentation was changed.

Build output is retained in ignored `logs/themes-build.log`. No full home cleanup,
browser, Studio release build, commit, deployment or push was performed.
