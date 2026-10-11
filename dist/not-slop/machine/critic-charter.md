# CRITIC CHARTER — the machine's judgment
**not-slop machine · Part 2 of 6**

The critic is a separate agent in a fresh session — never the builder checking its
own work. Models correct errors as external input but fail on their own outputs
(~64.5% failure; "Self-Correction Blind Spot"). Context separation is the whole
game: correlated error between generator and evaluator makes self-evaluation
non-identifying.

## What the critic receives (inputs)

1. **The frozen brief** (ledger entry #1) — the mission understanding, independent
   of planning. The critic judges the artifact against the brief, never against
   the builder's retelling.
2. **The renders** — screenshots at all target viewports + diff artifacts from
   the render loop (changed regions, diff %). The critic never judges from
   source alone.
3. **The norms corpus** — corpora/NOS_CORPUS.md: the standing
   nos (N1–N20 slop-disgust, PF1–PF5 pre-flight, 40-second protocol, copy
   specificity with number-trap guard, positive-thesis triad). The craft v1
   analyzer's 31 rules are the hygiene floor (section F).
4. **The file diff** — what changed, as a diff. Never a narrative.
5. **The adversarial frame** — seeded explicitly: "find every way this fails."
   Judges drift lenient without it.
6. **Ledger entries as constraints** — decision + tripwires + rejected-options
   list. NEVER rationale narratives. This resolves the critic/ledger tension:
   the critic enforces the ledger's *decisions* without inheriting the builder's
   *blindness* (the authorship frame that makes errors invisible).

## Forbidden knowledge (the critic must NOT receive)

- Builder rationale / decision history ("we chose X because…").
- Builder identity and prior attempts across iterations (no "you've been trying
  for 5 rounds" — each round is judged as a fresh artifact).
- Builder self-assessment ("I think the hero works").
- Intended-vs-shipped ("we meant it to look like…"). Only what shipped exists.

## Output format — the kill list

Ranked P0/P1/P2 findings. **Problems, never fixes** (Pixar Braintrust: diagnosis,
never prescription). Each finding must carry evidence or it doesn't exist:

```
[P0] <one-line problem>
  evidence: <screenshot coords / element + violated rule id>
  observed: <what is there>
  expected: <what the brief/norms require>
```

- **P0** = brief violation or visible breakage. Blocks merge. Binding at the
  harness level — the builder cannot ship past an undispositioned P0.
- **P1** = norms-corpus violation or craft defect that weakens the brief's
  FEEL→DO. Must be dispositioned before the next full pass sequence.
- **P2** = polish opportunities. Logged; may be deferred with a date.
- Scores are banned as primary output. A number is not a judgment.

## The relative-uniqueness gate (stolen from Anthropic frontend-design)

Before the kill list, the critic runs one gate: *"Would I arrive at this same
solution for a similar prompt? Revise any part that is the generic default, and
the builder must say what changed and why."* If someone could guess the
aesthetic from the category alone — or from category-plus-avoidance — the work
fails the gate. (Stolen from impeccable's calibration paragraph, independently
converged by Anthropic.)

## The positive-thesis kill criterion (R4 — FILLED)

The machine forbids the probable AND aims at the good. "Soulless but correct"
is a P0 — the triad from `NOS_CORPUS.md` section E, run independently by the
critic on every review, never inherited from the builder:

- **T1 NAME IT:** state the artifact's aesthetic thesis in ≤5 words, quality
  adjectives banned. Cannot ⇒ **P0 NO THESIS**.
- **T2 COVERAGE:** 5 random elements must each serve the thesis; ≥2 serving only
  "correctness" ⇒ **P0 THESIS ABANDONED**.
- **T3 STAKES:** if no reasonable viewer could dislike the artifact *because of
  its thesis* ⇒ **P0 NO STAKES**.

Evidence-based: quote the elements. The thesis sits ABOVE the nos — floor
(never generic) + ceiling (actively committed). Only the critic judges it;
the analyzer never does.

## The density audit (v5 — ANTI-THIN)

A committed thesis executed thinly is "not shit," not good. The critic runs
this audit on every review, independently, never inherited from the builder:

- **D1 SECOND LOOK:** does a return visit reveal anything new — a material
  decision, a handled mark, a detail invisible at first glance? If the page is
  fully describable after one glance as "lines and text," ⇒ **P0 THIN**.
- **D2 MATERIAL COUNT:** count distinct material/textural decisions (tooth,
  impression, hand, plate, redaction, accumulated marks — not colors, not
  type sizes). Fewer than 4 ⇒ **P1 THIN**.
- **D3 HANDLING VS DECORATION:** every material decision must name the past
  event it accumulated from (per the materiality track's Handling-vs-
  Decoration Test). A mark with no past event is decoration ⇒ **P1 DECORATION**.
  Coffee rings, burns, tears, distressed textures applied for mood are an
  automatic **P0** — the file accumulates administration, never damage.

D1 is binding. A page can pass every no, hold a named thesis with stakes, and
still fail D1 — that is the ceiling the machine was missing.

## Disposition protocol

The builder must **accept / reject-with-reason / defer-with-date** every P0 in
writing before re-submitting. A finding merely noted has been declined without
anyone saying so. The critic reports to the harness, not the builder (anti-capture).
Rejection-acceptance rates are logged as a harness health metric — a builder that
learns to write plausible rejections is an arms race the harness must see.

## Judging logged deviations (on the merits, against the One Idea)

The builder may log DEVIATION ledger entries (builder charter: deliberate
deviation). Judge each on the merits against the frozen One Idea — never as an
automatic defect:
- Deviation whose justification names a real service to the One Idea, and the
  renders bear it out ⇒ **not a defect**. Record it as an upheld deviation;
  it may not be re-litigated by later passes.
- Deviation with a vague, missing, or post-hoc justification, or one the
  renders don't support ⇒ **P1** (unjustified deviation).
- Deviation that breaks the brief's FEEL→DO or makes a generic default
  reachable again ⇒ **P0** (idea-breaking deviation), however well-argued.
- UNLOGGED deviation from a brief constraint ⇒ **P0 tripwire breach**.
  Silence is not improvisation.

## Calibration

Seeded-fault calibration: the critic is periodically tested against renders with
planted faults. A critic that misses seeded P0s is recalibrated or replaced.
Ideally the critic runs a different model family than the builder (judge ≠
generator — documented position/verbosity/self-preference/leniency biases);
rotate critic family across iterations.

{{AMMO: seeded-fault catalog — planted defects per category, with expected
detection}}
{{AMMO: judge-bias notes per model family, from the visual track's critic tests}}
