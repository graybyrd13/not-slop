# not-slop — performance

In-depth performance knowledge for the `not-slop` website-building machine.

## The chain of helpfulness

**The skill is the outline; this repo is the depth.**

The skill files carry only performance budgets, gates, and checkable rules — a
small context footprint a checking agent can hold in memory. Everything in this
repo is progressive disclosure:

- Need a number or a pass/fail rule → read `GATE_SPEC.md`
- Need the reasoning behind a number → read `budgets.md`
- Need technique depth on a topic → read `images.md`, `fonts.md`, or `css-js.md`
- Need to run the audit → read `measurement.md`, run `audit.py`

Never dump this repo into an agent's context wholesale. The checking agent
enforces every gate from `GATE_SPEC.md` alone and pulls a topic file only when
it needs to know *how* to check or fix something. That is the whole
architecture: outline in the skill, depth on demand.

## Repo map

| File              | What it is                                                     |
|-------------------|----------------------------------------------------------------|
| `GATE_SPEC.md`    | The skill-side outline: 10 checkable gates, nothing else. The coordinator integrates this into the machine. |
| `budgets.md`      | The rationale behind every number. Every figure is labeled: standard, measured, research-backed, or judgment call with reasoning. |
| `images.md`       | Format discipline, the 2× slot rule, role budgets, lazy-loading, the base64 rule. |
| `fonts.md`        | Self-hosted versioned woff2, subsetting, `font-display`, family/weight budgets. |
| `css-js.md`       | CSS weight discipline, dead-code rule, JS budget and justification, no-framework default. |
| `measurement.md`  | The repeatable audit procedure: static audit (always) + CDP rendered audit (gold standard). |
| `audit.py`        | Executable static auditor. Implements gates G1, G3–G10 and a proxy G2 from stdlib + PIL. |
| `cdp_measure.py`  | Gold-standard rendered-dimension check via Chrome DevTools Protocol. |

## Design intent

These gates are strict but realistic. They were calibrated against a real
artifact: the machine's v5 violin build shipped at **2.05 MB** — 74% of it
base64-embedded plate images served at ~5× their display slots. Every gate in
`GATE_SPEC.md` was chosen so that it would have caught that.

## Status

Designed to be pushed to GitHub as a public repo. No secrets, no internal
paths, no account-specific references.
