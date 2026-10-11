# THE 8 PASSES — the machine's time
**notslop machine · Part 3 of 6**

You can't fake time. These passes are the mechanical substitute: eight distinct
jobs, run in strict order, each from a cold start. Fifty identical "revise"s are
waste; eight *different* jobs are the perfected process.

## Inter-pass hygiene (applies to every pass)

- Each pass starts from **the brief + a one-page summary only** — never full
  history. This is the fixation reset (incubation research: the effect appears
  only with complete removal of the problem from sight).
- Each pass has one job, a non-overlapping checklist, explicit NOT-checks, and
  an exit criterion. A pass exits when its checklist is clean, not when it
  "feels done."
- Per-pass bounded loop: collect defects → fix batch → one confirmation pass →
  stop. Tinkering check: "not substantially improving, just tinkering" = stop.

## The sequence

### P1 — Structure
*Does the skeleton answer the brief?*
- Checklist: every brief requirement maps to a visible block; no orphan blocks
  (visible but unrequired); no invented claims (required but unverified);
  information hierarchy matches the brief's FEEL→DO.
- **Bounded composition:** the page reads as a finite, bounded object — not a
  feed. Endless scroll is a structural defect unless the brief demands it.
  Standing F1 law: the frame is underrated; scrolling down endlessly makes
  people skip. Tighten vertical sprawl; make the frame deliberate.
- **Multi-page (when the brief declares S0 scope >1 page):** every sitemap page
  is built and serves its declared purpose (a page that doesn't is a defect);
  no orphan pages (unreachable from nav or body links); every built page
  appears in the sitemap.
- NOT-checks: do not fix copy, pixels, or motion here. Structure only.
- Exit: all brief requirements mapped, zero orphans, zero invented claims,
  composition bounded, sitemap fully honored.
- ⚠️ **Invalidation:** any structural change forces re-run of P3–P5. (No point
  polishing a chapter you may delete.)

### P2 — Copy
*Every word correct.*
- Checklist: zero placeholders; tone matches the brief (run the Adjective
  Negation test on the actual copy); every claim verified against a source;
  copy-specificity test (`NOS_CORPUS.md` section D): pro copy names
  numbers/names/constraints, AI copy leans on adjectives — BUT never reward
  bare numbers (AI uses 2.7× more; 88% unanchored vs 0% pro). Every stat must
  be anchored (source/date/method) or it counts against. Banned vocabulary:
  seamless, elevate, delve, unlock, supercharge, cutting-edge.
- NOT-checks: P2 judges *what* the words say; P4 judges how text *renders*.
- Exit: no placeholders, tone test passes, all claims sourced.

### P3 — Robustness
*Nothing breaks off the happy path.*
- Checklist: all target viewports rendered (1440 / 768 / 375); empty, loading,
  error, and overflow states reviewed; a11y thresholds pass (contrast, focus,
  reduced-motion path exists); no layout shift between states.
- **PERFORMANCE GATE (BLOCKING):** the pass reads ONLY the outline at
  performance/GATE_SPEC.md — budgets, gates, checkable
  rules (small context, never the whole repo). Technique depth is pulled from
  the performance repo on demand, one file at a time (progressive disclosure —
  "chain of helpfulness," never a context dump). Over-budget findings are
  P1-class: fix or disposition like any other defect.
- The gate spec is authoritative: `performance/GATE_SPEC.md` in this
  repo. (Fallback if the spec is ever unreachable: zero external requests,
  total bytes measured, >2MB flagged P1, report notes 'GATE_SPEC pending'.)
- NOT-checks: do not restyle here. Breakage only.
- Exit: every state renders without breakage at every viewport, performance
  gate clean.

### P4 — Surface / craft
*Pixel-level correctness, one error class per sweep.*
- Method: single-error-class sweeps — alignment sweep, then spacing sweep, then
  type sweep, then color sweep, then **cross-page sweep** (multi-page runs):
  nav byte-identical across pages except active state (links, order, labels);
  shared tokens honored on every page per the architecture token table
  (typeface, palette, spacing, radius) — a page inventing its own tokens fails;
  no visual drift between pages. One class per sweep (the proofreader's technique:
  you cannot see every error class at once).
- Checklist per sweep: the mechanical pre-flight values (`NOS_CORPUS.md`
  section B): PF2 eyebrow cap ≤4; PF3 no ≥4 consecutive identical section
  triples; PF4 <2 template skeletons; PF1 no shared typeface with previous
  projects; plus TT-P2 (exactly one h1 in rendered DOM), TT-P4 (title ≤60
  chars). Alignment/spacing/type/color/cross-page sweeps each verify their class.
- NOT-checks: do not restructure, do not rewrite copy, do not add motion.
- Exit: all five sweeps clean.

### P5 — Motion
*Every transition exercised on the final build.*
- Checklist: durations within budget (micro 100–300ms; nothing routine >500ms;
  ladder — duration scales with distance: tooltip 125ms < popover 200ms <
  modal 250ms < drawer 500ms < fullscreen menu 0.8–1.25s); enter decelerates,
  exit accelerates — never one symmetric duration both directions; no dead
  frame — exit and enter overlap; easing tokens in use — standard
  (0.2,0,0,1), entrances (0.05,0.7,0.1,1), exits (0.3,0,0.8,0.15), popovers
  (0.23,1,0.32,1), drawers (0.32,0.72,0,1), view-transition snaps
  (0.87,0,0.13,1) — never bare `ease`/`ease-in-out`; linear only for spinners
  and real-time progress; scroll behavior — scrubbed (1:1 or scrub:1) not
  timed, `ease:'none'` on scrubbed tweens, pinned stage not fixed hacks,
  horizontal scroll ≤1 chapter with parallax on scenery not copy; reduced-motion
  path verified by actually rendering it (kill movement, keep feedback).
- NOT-checks: do not add new motion to fix static problems.
- Exit: all transitions within budget, reduced-motion verified.

### P6 — Adversarial
*Attack the finished artifact, not a draft.*
- Method: red-team the FINISHED build (attacking a draft wastes attacks on
  things that will change). Pre-mortem framing allowed: "it's a year later and
  this failed — why?"
- Checklist: the slop-disgust triggers as attack prompts (`NOS_CORPUS.md`
  section A, N1–N20 — run every one as "does this fire?"); the 40-second
  protocol as triage (`NOS_CORPUS.md` section C: TT-P1–P4, ≥2 fails = rushed);
  assumption attacks (every ledger tripwire: does the `breaks when` signal
  fire?); the relative-uniqueness gate re-run against the finished artifact;
  the positive-thesis triad re-run (T1/T2/T3).
- Non-overlap: code review checks correctness; red-teaming attacks assumptions.
- Findings route to the owning pass for fix + re-verification (P6 never fixes).
- Exit: zero new attack findings, or all findings routed with dispositions.

### P7 — Fresh-eyes
*The cold read.*
- Method: new agent (or full context clear), receives **brief + current render
  only** — zero chain-of-thought, zero prior defect lists. Format-shift first:
  different viewport, zoom, or medium (the proofreader's "print it, change the
  font" trick, mechanized).
- Checklist: the four-word disposition (stolen from impeccable's finish
  reviewer): **recapture / rebuild / fix / ship** — unsoftenable, the builder
  cannot negotiate it down.
- Exit: disposition = ship. Anything else routes back with the disposition as
  the work order.

### P8 — Elevation
*From "no defects" to "amazing."*
- Method: new agent, cold start. Receives **brief + final renders + the bar**
  (the run's abstracted bar-lessons from `direction/bar.md`, plus the
  YES_CORPUS exemplar names and their excellence claims). NOT the ledger, NOT
  prior defect lists — this pass judges against excellence, not against the
  absence of failure.
- The one question: *"What is the single biggest gap between this artifact
  and the best work in this genre?"* — concrete, locatable, one gap only.
  If no meaningful gap exists, report **"no gap"** and the run proceeds.
- Exactly ONE bounded builder round addresses the gap (minimal edits honoring
  stare decisis; logged as P8-E## ledger entries), followed by re-render and
  targeted re-verification: P3, P4, P5 re-run (invalidation as appropriate —
  structural changes re-run the trio, surface-only changes re-run P4).
  No loops: if re-verification isn't clean, the run blocks for F1 rather than
  iterating.
- **AUTHOR STEP (copy authorship, inside P8):** after the elevation round, a
  cold copy-author agent REWRITES the page copy for voice, rhythm, and
  memorability, working from the brief's FEEL→DO. This is a writer, not a
  checker: one bounded authoring round (P2 keeps its defect-checking role and
  re-verifies the rewritten copy afterward). Hard constraints: invent nothing
  (every claim already on the page stays; no new stats/names/promises), keep
  every sourced claim, do not move FEEL→DO, words and sentences only (no
  restructuring), brief-true always (a pretty line that breaks a NOT-list item
  dies). Logged as P8-A## entries. Runs in every P8 — copy voice is
  independent of the visual gap.
- NOT-checks: do not re-litigate P1–P7 findings; do not add scope the brief
  didn't earn; do not chase a second gap.
- Exit: gap addressed + authorship done + P2/P3/P4/P5 clean, or "no gap" +
  authorship done + P2/P3/P4/P5 clean.

## Invalidation logic (the dependency rule)

| Change class | Re-runs |
|---|---|
| Structural (P1) | P3, P4, P5 |
| Copy (P2) | nothing (P4 already judges rendering, not wording) |
| Robustness fix (P3) | P4 if pixels moved |
| Surface (P4) | nothing |
| Motion (P5) | P3 (layout shift check) |
| Adversarial finding (P6) | the owning pass + its dependents |
| Elevation change (P8) | P3, P4, P5 re-verified (structural → full trio; surface-only → P4) |

A structural change late in the sequence is expensive by design — this is what
makes "get P1 right" a forcing function instead of advice.

## Stop rule (borrowed from reliability engineering)

Ship when **all passes exit clean AND two consecutive full-sequence runs surface
zero new P0/P1 defects**. Released not when known correct, but when the defect
discovery rate is acceptable. (Cheap-stop for small builds is an open falsifier:
which passes can be skipped for which build sizes without quality collapse —
{{AMMO: build-size → pass-subset mapping, when the visual track has data}}.)

{{AMMO: per-pass checklists expanded with the visual track's checkable values —
spacing tokens, type scales, disgust triggers, time-tell signals}}
