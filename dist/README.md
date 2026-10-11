# not-slop — distributable skill package (`dist/`)

This directory contains the one-command-installable `not-slop` skill.

## Layout

```
dist/
  README.md        # this file
  not-slop/         # the installable skill (this is what ships)
    SKILL.md       # the skill entry point — YAML frontmatter preserved for discovery
    README.md      # installed copy notes (omitted; see repo docs instead) — not present
    corpora/       # NOS_CORPUS.md (tell blocklists), YES_CORPUS.md (excellence bar)
    techniques/    # TECHNIQUES.md (move library with BREAKS WHEN conditions)
    machine/       # charters, passes, protocols + craft-build.reference.js (orchestration to port)
    performance/   # GATE_SPEC.md, budgets + technique depth, audit.py + cdp_measure.py auditors
```

Everything under `dist/not-slop/` is copied verbatim from the repo tree at
build time (`corpora/`, `techniques/`, `machine/`, `performance/`), with two
intentional exceptions:

1. `SKILL.md` is adapted into a standalone install form (local paths
   resolved, legacy `analyzer/` / `references/` mentions pointed at the
   actual bundled files).
2. `machine/craft-build.reference.js` has its stale `workspace/craft-v2/`
   path constants remapped to the bundled layout (`machine/*.md`,
   `corpora/*.md`, `performance/*`, `./runs/`) — the old paths assumed the
   author's home-directory workspace and resolved nowhere, including in the
   source repo. Prose is untouched.

## Bundling tradeoff: BUNDLE-EVERYTHING

This package ships **all** depth files instead of fetching them on demand.

**Why (bundled wins):**
- Works fully offline after install — no network dependency at skill-use time.
- Version-pinned: the skill you install is the skill you run. Upstream edits
  can't silently change behavior under you mid-project.
- Zero resolution logic in agents — relative paths always resolve; no
  raw-URL fetching code needed in the skill itself.

**Costs (accepted):**
- Larger install footprint (all knowledge ships, even files a given task
  never reads).
- Updates require reinstall — there is no auto-update. Re-run the installer
  to move to a newer snapshot.

**Update path:** re-run the one-command installer; it overwrites the target
directory with the latest `dist/not-slop` snapshot and prints the new version.
The canonical upstream files live at
`https://raw.githubusercontent.com/graybyrd13/not-slop/main/dist/not-slop/<path>`
(e.g. `.../dist/not-slop/corpora/NOS_CORPUS.md`).

## Install

```sh
curl -fsSL https://raw.githubusercontent.com/graybyrd13/not-slop/main/install.sh | bash
```

Installs to `~/.claude/skills/not-slop/` (override with `--dir <path>`).
See repo-root `install.sh` and `CHANGELOG.md` for details and version history.
