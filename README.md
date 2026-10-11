# notslop

A machine that makes AI-built websites read as professionally made.

## The problem

AI-generated websites look like AI generated them. Not because the models are
weak — because they optimize for the *appearance* of completion: template
defaults, purple gradients, three-column feature grids, shadcn token soup,
copy full of unanchored stats. Every output regresses to the training mean.
The tells are mechanical, which means they're checkable — and a machine can
forbid them harder than any prompt can.

## How it works

notslop is a multi-agent pipeline with a human verdict at the end. No single
agent ever judges its own work.

1. **Brief** — a frozen constraint document (problem, audience, one idea,
   not-list, feel→do) that makes the generic answer unreachable *before any
   code exists*. Tested adversarially: audience flip, not-list sweep,
   adjective negation.
2. **Direction tournament** — three direction retrievers attack the brief from
   different angles; a cold judge picks one winner. Only the winner reaches
   the builder.
3. **Build** — a quarantined builder works from the brief and abstracted
   direction only. It never sees the critic's tests. Missing product imagery
   blocks the build; the builder may not draw the product.
4. **Render** — the artifact is screenshotted at 1440 / 768 / 375 after every
   significant change. An agent is never allowed to not-see its own work.
5. **Critic** — a separate agent in a fresh session returns a kill list
   (P0/P1/P2, problems never fixes), armed with the nos corpus, the
   positive-thesis triad, and the density audit.
6. **Passes** — P1–P7 in strict order (structure, copy, robustness, surface,
   motion, adversarial, fresh-eyes), each from a cold start, with invalidation
   rules between them.
7. **P8 elevation** — one comparative round against the yes-corpus bar ("what
   is the single biggest gap between this artifact and the best work in this
   genre?"), plus a cold copy-authorship pass. No loops.
8. **Human verdict (F1)** — the run blocks. A person judges the rendered
   artifact blind. The verdict is encoded back into the machine's files, so
   the next run doesn't start cold.

## Repo map

| Path | What it is |
|---|---|
| `SKILL.md` | The portable skill: constraints, build playbook, finishing checklist. Give this to any AI agent. |
| `corpora/NOS_CORPUS.md` | The thousand ways to fail: AI tells, pre-flight gates, the 40-second protocol, the positive-thesis triad. |
| `corpora/YES_CORPUS.md` | The bar: exemplary sites with abstractable excellence claims. |
| `techniques/TECHNIQUES.md` | The library of moves: concrete recipes, each with BREAKS WHEN conditions. |
| `machine/` | The portable machine knowledge: builder/critic charters, the 8 passes, render loop, brief template, corpus protocol, ledger format, verdict protocol — plus `craft-build.reference.js`, the actual orchestration script (Hatch runtime; port it). |
| `performance/` | The performance knowledge base: 10 checkable gates (`GATE_SPEC.md`), budgets with provenance, technique depth, executable auditors (`audit.py`, `cdp_measure.py`). |
| `gallery/` | Before/after proof from the violin build. |
| `.github/ISSUE_TEMPLATE/` | Propose a NO, a YES, or a TECHNIQUE. |

## Using the skill

Give `SKILL.md` to your agent when it builds anything a human will see or
read — websites, landing pages, UI, codebases. The skill enforces design, code,
motion, and structure constraints, runs a mandatory finishing checklist, and
gates delivery on its analyzer verdict. For the full machine (brief through
F1), see `machine/` — the charters and passes are written as agent prompts,
and `craft-build.reference.js` is the orchestration to port.

## Contributing

The contribution surface is the corpora. Anyone can propose:

- a **NO** — an AI tell with evidence (examples + data, never vibes),
- a **YES** — an exemplary site with a nameable, abstractable excellence claim,
- a **TECHNIQUE** — a concrete move with a recipe, BREAKS WHEN conditions,
  and a validation source.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the evidence bar and the exact
entry formats. The maintainer is the final judge on every proposal.

## License

MIT — see [LICENSE](LICENSE).
