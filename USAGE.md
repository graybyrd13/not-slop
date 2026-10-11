# Using not-slop

not-slop is a machine that makes AI-built websites read as professionally made.
Two ways to use it: the skill (fast) or the full machine (thorough).

## The 30-second path

Install the skill, then hand `SKILL.md` to your AI agent whenever it builds
anything a human will see or read — websites, landing pages, UI, codebases.

```bash
curl -fsSL https://raw.githubusercontent.com/graybyrd13/not-slop/main/install.sh | bash
```

Then tell your agent:

> "Build this using the not-slop skill — follow every constraint in SKILL.md
> and run the mandatory finishing checklist before you call it done."

That's the whole integration. The skill enforces design, code, motion, and
structure constraints, runs the finishing checklist, and gates delivery on the
analyzer verdict (`python3 analyzer/analyze.py --file page.html` must say
`reads professional`, score ≥75, zero AI tells).

For the full machine (brief through the human verdict), see `machine/` —
the charters and passes are written as agent prompts, and
`craft-build.reference.js` is the orchestration to port.

## What the machine outputs at each stage

One artifact per stage. Each stage runs from a cold start; no agent ever
judges its own work.

- **Brief** — a frozen constraint document: problem, audience, one idea,
  not-list, feel→do. Makes the generic answer unreachable before any code
  exists. Tested adversarially (audience flip, not-list sweep, adjective
  negation).
- **Direction tournament** — three direction retrievers attack the brief from
  different angles; a cold judge picks one winner. You get the winning
  direction only — the loser directions never reach the builder.
- **Build** — a quarantined builder produces the artifact plus a build
  ledger (what was decided, what was skipped). It works from the brief and
  abstracted direction only; it never sees the critic's tests.
- **Render** — the artifact is screenshotted at 1440 / 768 / 375 after every
  significant change. You get the actual renders — a page is never judged
  from its source.
- **Critic** — a separate agent in a fresh session returns a kill list
  (P0/P1/P2): problems only, never fixes. Armed with the nos corpus, the
  positive-thesis triad, and the density audit.
- **Passes P1–P7** — structure, copy, robustness, surface, motion,
  adversarial, fresh-eyes, in strict order, each from a cold start with
  invalidation rules between them. You get a pass report per pass: what
  changed, what held.
- **P8 elevation** — one comparative round against the yes-corpus bar ("what
  is the single biggest gap between this artifact and the best work in this
  genre?"), plus a cold copy-authorship pass. No loops. You get the
  elevation note: the gap named, and whether it closed.
- **Human verdict (F1)** — the run blocks. A person judges the rendered
  artifact blind. You get a verdict, and the machine encodes it back into
  its files so the next run doesn't start cold.

## What you need to bring

Two things:

1. **The subject.** What the site is for, who it's for, the one idea. The
   machine can't brief itself.
2. **Real product imagery**, if the build has a product. The machine blocks
   rather than fakes it — the builder is forbidden from drawing the product,
   and there is no "placeholder for now." If you don't have photography,
   say so; the run waits.

## Contributing findings back

The contribution surface is the corpora:

- Found a new AI tell? Propose a **NO** — an AI tell with evidence
  (examples + data, never vibes).
- Found an exemplary site? Propose a **YES** — a site with a nameable,
  abstractable excellence claim.
- Built a reusable move? Propose a **TECHNIQUE** — a concrete recipe with
  BREAKS WHEN conditions and a validation source.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the evidence bar and the exact
entry formats. The maintainer is the final judge on every proposal.
