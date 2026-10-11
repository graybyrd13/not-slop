# not-slop Changelog

All notable changes to the not-slop project will be documented in this file.

## [0.1.0] — 2026-10-11

Initial public release: not-slop as a one-command installable skill.

### Added
- `dist/not-slop/SKILL.md` — standalone, self-contained adaptation of the skill.
  YAML frontmatter (`name: not-slop`) preserved for skill discovery. Zero local
  paths; every depth reference resolves to the bundled copies (relative paths,
  works offline after install) with the canonical raw-URL upstream documented
  for updates. Legacy `analyzer/` / `references/` mentions resolved to the
  actual bundled files (`performance/` auditors, `corpora/`, `techniques/`,
  `machine/`).
- Bundled knowledge (BUNDLE-EVERYTHING — full offline robustness):
  - `corpora/` — `NOS_CORPUS.md` (AI-tell blocklists, pre-flight gates),
    `YES_CORPUS.md` (excellence bar)
  - `techniques/` — `TECHNIQUES.md` (move library with BREAKS WHEN conditions)
  - `machine/` — builder/critic charters, the 8 passes, render loop, brief
    template, corpus protocol, ledger format, verdict protocol, plus
    `craft-build.reference.js` (orchestration script to port)
  - `performance/` — `GATE_SPEC.md` (10 checkable gates), `budgets.md`,
    `images.md`, `fonts.md`, `css-js.md`, `measurement.md`, and the
    executable auditors `audit.py` / `cdp_measure.py`
- `dist/README.md` — package layout and the bundling tradeoff (bundled =
  offline + version-pinned; cost = larger install, updates require reinstall).
- `install.sh` — one-command installer:
  `curl -fsSL https://raw.githubusercontent.com/graybyrd13/not-slop/main/install.sh | bash`
  installs to `~/.claude/skills/not-slop/`; `--dir <path>` override supported.
  POSIX sh, needs only curl + tar (checked with clear errors). Existing target
  is overwritten with notice; prints an install summary with version.
