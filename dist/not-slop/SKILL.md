---
name: not-slop
description: "Build websites, UI, and codebases that read as professionally made. Enforces design/code/motion/structure constraints, a mandatory finishing checklist, a 6-phase build playbook, and a runtime analyzer gate. Invoke when building any website, page, UI, or codebase the user will see or read."
---

# not-slop — the professional-output skill

> **Portability.** This skill is self-contained prose: the constraints, the
> build playbook, and the finishing checklist below work for any AI agent.
> The bundled companions — `corpora/` (tell blocklists + excellence bar),
> `techniques/` (move library), `machine/` (multi-agent charters, passes,
> protocols), and `performance/` (gate spec + executable auditors) — ship
> alongside this file as relative paths, so the skill works fully offline
> after install. Every rule here is still enforceable by hand (grep,
> checklist, judgment) without the companions.

## Layer 1 — Invariants (always loaded, non-negotiable)

These govern every invocation, regardless of task:

1. **Close every loop on external ground truth.** Never finish an edit without running something after it: tests, build, the auditors, a repro. Self-correction without external feedback degrades accuracy.
2. **Reproduce before editing.** Validate the reproduction through the real user-facing entry point, not a synthetic shortcut.
3. **State the decisive assumption and its falsifier before the first edit.** "What single observation would prove me wrong?" 38.5% of first mistakes are never detected.
4. **Never retry a failed action unchanged.** Vary the command, the assumption, or the approach. Cap repair at 2–3 rounds, then replan or escalate.
5. **Done is a checklist, not a feeling.** Run the finishing pass below. No new information in N steps → replan or escalate.

## When to invoke

Any website, landing page, UI component, design system, or codebase the user (or their users) will see or read. Do NOT invoke for throwaway scripts, internal tooling, or quick experiments — the constraint budget is for shipped work.

## Why this works (the hypothesis, one paragraph)

The observable difference between professional and AI-made artifacts is the density of deliberate, checkable constraints per unit of output. Professional work is constraint-driven — a series of explicit nos, rationing decisions: one font, monochrome UI with one brand moment, errors that propagate, comments that earn their place. AI output is default-driven — unexamined yeses from regression to the training mean, plus template defaults that were never chosen. This skill does not teach taste; it enforces constraints, hardest at the finishing layer, because that is where professionals spend disproportionate effort and where models stop at "looks done." Every rule below is checkable: a linter, a grep, or the bundled auditors can verify it.

## The constraint core (the 80/20)

Apply all of these on every invocation. Full catalogs with evidence are bundled in this install — pull the relevant file per task (see References).

### Web

- **W1.** Exactly one `<h1>`; `h2`/`h3` form a real outline. *Why: the heading outline is the document's table of contents; duplicates signal generated filler.*
- **W2. The head is copywriting.** Hand-written `<title>` ≤60 chars, OG + Twitter tags with real copy and resolvable images, meta description 120–160 chars. Ban placeholders (`yoursite.com`, `example.com`, lorem). *Why: the head is the cheapest credibility signal and the first place generated output shows.*
- **W3. Semantics are real.** Landmarks (`header`/`nav`/`main`/`footer`), content in `section`/`article`, 100% `alt` coverage, `<button>` not clickable divs, labeled inputs, skip link + `focus-visible` styles. *Why: accessibility is reviewer ergonomics; its absence is the most reliable amateur signal.*
- **W4. ≤2 font families, self-hosted.** One text face + optional mono. Versioned woff2, preloaded, `display=swap`, subset weights. No Google Fonts full-range links, no duplicate includes. *Why: fonts are infrastructure; third-party font links are render-blocking and read as default.*
- **W5. Monochrome UI chrome; brand color in ≤2 signature places.** *Why: rationing is the mechanism — amateurs decorate UI with color, pros spend it once.*
- **W6. BAN:** shadcn token names (`text-muted`, `bg-input`, `border-ring`, `text-foreground`), purple→blue gradients, pastel `*-50` section washes, default shadcn violet. Define a real named palette instead. *Why: these are cross-tool AI fingerprints with ~100% precision.*
- **W7. BAN canonical default clusters appearing together:** `max-w-7xl` + `py-20` + `rounded-full` + `md:grid-cols-3` + `text-4xl/7xl` hero. If Tailwind is used, customize container, spacing, and radii so output doesn't read as defaults. *Why: the cluster is the AI layout fingerprint.*
- **W8. Tokens in `:root`, referenced everywhere.** 4/8pt spacing scale, one container width per breakpoint tier, 2–3 section-spacing tokens. No raw hex scattered in markup. *Why: systems beat decisions — one source of truth kills drift.*
- **W9. `::selection` styled; 150–250ms transitions on every interactive state.** No instant color snaps. *Why: ~20 lines that 20/20 non-pro sites lacked — disproportionate signal.*
- **W10. Per-image loading.** Hero `fetchpriority="high"` + eager; everything else lazy; modern formats (avif/webp) at display size. *Why: performance is a design decision, not an accident.*
- **W11. Finish the document.** Favicon stack (SVG + PNG + apple-touch-icon); viewport without `maximum-scale=1`; all scripts `defer`/`async`. *Why: missing finish work is the #1 "generated, not authored" tell.*
- **W12. One coherent icon set, custom SVG preferred; no emoji iconography.** *Why: 20+ library refs with zero custom icons reads as assembled, not designed.*

### Code

- **C1. Information-gain test.** No comment may restate what adjacent code says. Delete the code mentally — if the comment loses all information, delete the comment. *Why: narrating comments are the most common AI code tell; real comments carry context the code can't (why, constraints, calling context).*
- **C2. Ban generic identifiers:** `data`, `result`, `temp` (beyond loop-local), `manager`, `handler`, `utils`, `misc`, `stuff`. Name the domain thing. *Why: generic names mean the author never formed a model of the domain.*
- **C3. One error convention per project; errors propagate as values.** Never swallow (`except: pass`); never return success from an unimplemented path. *Why: AI code handles errors; professional code accounts for every outcome.*
- **C4. Ownership must be lexical.** Every acquisition's release is visible in the same function, or the transfer is documented at the call site. *Why: resource lifetimes are the deep structure reviewers actually check.*
- **C5. No dead code, no commented-out code, no ownerless TODOs.** No copy-paste twins: blocks differing in ≤2 tokens become a loop, table, or helper. *Why: dead code is deferred decisions; twins are abstraction refused.*
- **C6. Magic numbers get named constants with rationale.** No hardcoded instance data in logic files. *Why: a bare literal hides the decision; a named constant documents it.*
- **C7. Public functions document params, return contract, AND calling context** (locks held? may sleep? thread constraints?). Doc coverage scales with API surface, not function size — uniform doc-on-everything is wallpaper. *Why: the context line is what generated docs never write.*
- **C8. Working code is quiet.** No demo-theater prints; logging through the project's facility at the correct level. *Why: stray output is scaffolding left in the building.*
- **C9. One formatter, entire repo, zero mixed conventions.** Never break user-visible strings across lines — grepability outranks prettiness. *Why: mechanical consistency is reviewer ergonomics specified as engineering.*
- **C10. One logical change per commit.** Subject `<area>: <imperative> <what+why>`, ≤72 chars; body explains *why*, never *what*. *Why: the commit log is the project's memory; "what" is in the diff.*

### Motion

- **M1. Duration budgets (data, not lore).** Micro-feedback 100–300ms; state/route transitions 300–500ms; staged choreography 0.5–2.2s; ambient loops 8–28s. **Nothing routine exceeds 500ms.** Duration scales with distance (tooltip 125ms < popover 200ms < modal 250ms < drawer 500ms). *Why: duration is the single most legible motion decision; overlong motion reads as amateur immediately.*
- **M2. Easing is always chosen, never default.** Standard UI `cubic-bezier(0.2,0,0,1)`; entrances `(0.05,0.7,0.1,1)`; exits `(0.3,0,0.8,0.15)`. **Asymmetry rule:** enter decelerates, exit accelerates — never one symmetric easing both directions. *Why: symmetric ease-in-out everywhere is the #1 motion tell.*
- **M3. Transform and opacity ONLY.** Never width/height/top/left. Scrubbed (scroll-linked) tweens use `ease: "none"`. *Why: layout animation janks; the constraint forces GPU-cheap motion.*
- **M4. Overlap exit and enter** (negative timeline offsets — never a dead frame). Stagger ladders: chars 0.02–0.03s, words 0.07–0.1s; one causal thread. *Why: choreography is what separates designed motion from garnish.*
- **M5. Grain finishing pass on every gradient.** Kills banding — the #1 amateur visual tell in rendered gradients. *Why: 3 lines, disproportionate polish.*
- **M6. Celebration is budgeted.** 50 particles = polite puff, 150 = celebration. Milestones/firsts/streaks/100% only; always skippable; frozen under reduced-motion. *Why: unbudgeted celebration reads as a template showing off.*
- **M7. `prefers-reduced-motion`: kill movement, keep state feedback.** *Why: free professionalism signal; its absence marks generated output.*
- **M8. Springs:** stiffness 150–500, damping 15–35, mass 0.5–5; critically damped default; overshoot only when the gesture carried momentum; never spring opacity/color. *Why: spring parameters are the difference between physical and nauseating.*

### Structure

- **S1. Entry points are wiring-only.** The program is reachable in ≤3 hops; `main` parses, wires, delegates — zero business logic. *Why: the entry point is a map; logic there means no map exists.*
- **S2. No god-dirs.** No top-level `common/`/`shared/`/`utils/`/`helpers/`/`misc/`. Cross-cutting code gets a precise name or lives in the owning subsystem. *Why: 0/14 exemplary repos have one — the god-dir is where unmade decisions go.*
- **S3. One organizing principle, statable in one sentence.** Boundaries are physical and executable (compiler, linter, CI) — never just documented. *Why: a diagram is not a boundary; unenforced structure rots.*
- **S4. Test location is derivable.** Colocated, mirrored 1:1, or named by strategy — nobody hunts for tests. *Why: undiscoverable tests don't get run.*
- **S5. Naming is domain vocabulary, at scale a grammar.** Never `manager`/`handler`/`data`/`util`. *Why: the name is the architecture diagram.*

## The finishing pass (mandatory checklist)

Run this after "looks done," before delivery. The research is unanimous: the finishing layer is the highest-density constraint region and the most reliable discriminator between professional and generated work.

**Document**
- [ ] `<title>` hand-written, ≤60 chars, benefit- or brand-led
- [ ] OG + Twitter tags present with real copy and resolvable images; zero placeholders
- [ ] Meta description 120–160 chars, written as copy
- [ ] Favicon stack: SVG + PNG + apple-touch-icon; no default `/favicon.ico`
- [ ] Exactly one `<h1>`; outline below it is real; 100% `alt` coverage
- [ ] Skip link, `focus-visible` styles, semantic buttons/inputs
- [ ] Viewport without `maximum-scale=1`; all scripts `defer`/`async`

**Copy**
- [ ] Zero placeholder text anywhere (`yoursite.com`, lorem, "TODO", prompt-echo in metadata)
- [ ] No sycophantic openings, no list-of-three-everything, no made-up stat trios
- [ ] Headlines say something; feature descriptions describe a feature

**Code**
- [ ] Dead-code sweep: no unused exports, no commented-out code, no ownerless TODOs
- [ ] Information-gain spot check: read 5 random comments; delete any that restate code
- [ ] Grep generic identifiers (`data`, `result`, `temp`, `manager`, `utils`) — rename or justify
- [ ] No demo prints; logging at correct levels; error paths exercised by tests
- [ ] Formatter run; no mixed conventions within any file

**Motion**
- [ ] Nothing routine exceeds 500ms; entrances and exits use asymmetric easings
- [ ] Transform/opacity only; grain pass on gradients; reduced-motion handled
- [ ] Celebration budgeted and skippable; no garnish animation without purpose

**Boring screens**
- [ ] 404, empty states, error states, loading states get the same finish as the hero

**Gate**
- [ ] Run the gate suite: `python3 performance/audit.py artifact.html` (exit 0 = all gates pass — see `performance/GATE_SPEC.md`). A gate failure fails the task — fix the flagged gate, don't argue with the checker; a miss is justified in writing, never silently.
- [ ] For the gold-standard image-slot check, use `python3 performance/cdp_measure.py <url>` against headless Chrome.

## The 6-phase build playbook

Drive every greenfield build through these phases in order. Do not skip; each phase has an exit criterion.

- **Phase 0 — Frame.** Intent → Spec → Plan. Name the decisions the implementer may NOT make silently (palette, typeface, motion personality, module boundaries). *Exit: written spec; riskiest unknowns named.*
- **Phase 1 — Walking skeleton.** Thinnest end-to-end slice across all real layers, kept code; build+test loop is iteration zero. *Exit: executes end to end on real infrastructure; pipeline green.*
- **Phase 2 — Slice by slice.** One thin vertical slice at a time, tested, with feedback per slice; fresh context per slice. *Exit per slice: verified before the next begins.*
- **Phase 3 — Make it right** (scheduled, not aspirational). Dedupe, rename to domain vocabulary, re-place per S1–S5. *Exit: structure rules checked; tests green.*
- **Phase 4 — Quality slice** (time-boxed). One narrow band at shipping quality, externally gated. *Exit: passes the external gate; establishes the quality bar.*
- **Phase 5 — Harden & polish** (late, last). Error paths, security, deployment — then polish. *Exit: independent verifier signs off; the finishing checklist above is complete.*

Through-line: front-load the riskiest unknowns; schedule refactoring and polish as named phases; the stop condition is external verification, never "looks done."

## Worked mini-examples

**Example 1 — applying web constraints to a hero.**
❌ *Before (default-driven):* Inter 100–900 via Google Fonts, purple→blue gradient background, `max-w-7xl mx-auto py-20`, pill eyebrow badge, three `md:grid-cols-3` feature cards with Lucide icons, `text-xs` microcopy.
✓ *After (constraint-driven):* one self-hosted face, two weights, preloaded. Near-black `#0A0B0D` UI; color appears exactly once — the primary CTA in brand `#2DD4A8`. Single 1200px container; sections breathe on 96/128px rhythm. Icons: one custom SVG set. `::selection` in brand color. OG tags with a real social image. Every default above was a decision the first version never made.

**Example 2 — the information-gain test on a comment.**
❌ *Before:*
```python
# increment the counter by one
counter += 1
```
Apply the test: delete the code — the comment says nothing. Delete the comment.
✓ *After:* no comment. Or, when context is real:
```python
# Retry once: the payment gateway returns 429 on the first charge after
# midnight UTC during ledger rollover (incident #4821).
```
This comment survives the test — it carries what the code cannot.

**Example 3 — a motion budget for a modal.**
Enter: 250ms, `cubic-bezier(0.05,0.7,0.1,1)` (decelerate in), scale 0.95→1 from the trigger edge, opacity 0→1. Exit: 200ms, `cubic-bezier(0.3,0,0.8,0.15)` (accelerate out) — asymmetric, per M2. Backdrop fades 150ms. Content stagger: 0.07s per line. All transform/opacity. `prefers-reduced-motion`: instant state change, no movement. Total: nothing exceeds 500ms, every value chosen.

## Runtime enforcement (bundled auditors)

The mechanical layer ships with the skill in `performance/`:

```bash
python3 performance/audit.py artifact.html     # static gates G1, G3–G10 + G2 proxy (exit 0 = all pass)
python3 performance/cdp_measure.py <url>       # gold-standard G2 image-slot check via Chrome DevTools Protocol
```

A gate failure fails the task — fix the flagged gate, don't argue with the checker. The AI-tell blocklists are enforced by hand or grep against `corpora/NOS_CORPUS.md` (the N-nos plus the five mechanical pre-flight gates PF1–PF5); the comparative excellence bar for elevation rounds is `corpora/YES_CORPUS.md`. The full multi-agent machine (brief → build → critic → 8 passes → human verdict) is documented in `machine/` — the charters and passes are written as agent prompts, and `machine/craft-build.reference.js` is the orchestration script to port (Hatch workflow runtime; not standalone-runnable).

## Sunset rule

Prescriptive rules that bridge a gap for weaker models can degrade stronger ones — the same rule text that constrains well for one model class creates drag for the next. Every rule set here carries a sunset condition: **re-audit this skill on model upgrades.** If a rule has become a tic (applied formulaically, without judgment — e.g., monochrome+one-accent on every site regardless of brand), kill it or re-scope it. Constraints need gardeners. What the skill cannot do: choose the brand (which font, which color moment, which motion personality), make architecture decisions, or supply novelty under constraint — the ceiling stays human.

## References (bundled — pull per task)

All paths are relative to this file; the install works offline. (Upstream canonical URLs below.)

- `corpora/NOS_CORPUS.md` — the tell blocklist: slop-disgust nos, the 5 mechanical pre-flight gates, the 40-second protocol, the positive-thesis triad
- `corpora/YES_CORPUS.md` — the excellence bar: exemplary sites with abstractable excellence claims
- `techniques/TECHNIQUES.md` — the move library: concrete recipes, each with BREAKS WHEN conditions
- `machine/brief-template.md` — the frozen constraint document that makes the generic answer unreachable
- `machine/builder-charter.md` — standing orders for the build agent
- `machine/critic-charter.md` — the critic's kill-list protocol (fresh session, never the builder)
- `machine/passes.md` — the 8 passes, run in strict order from cold starts
- `machine/corpus-protocol.md` — how the machine retrieves corpora without cloning (the quarantine)
- `machine/render-loop.md` — screenshot points and viewports; never ship unseen work
- `machine/ledger-format.md` — the decision ledger format
- `machine/verdict-protocol.md` — what happens after the human verdict (the learning loop)
- `machine/craft-build.reference.js` — the orchestration script to port (Hatch workflow runtime; not standalone)
- `performance/GATE_SPEC.md` — the 10 checkable performance gates
- `performance/images.md`, `performance/fonts.md`, `performance/css-js.md`, `performance/measurement.md` — technique depth for how to check or fix
- `performance/budgets.md` — the provenance behind every number
- `performance/audit.py`, `performance/cdp_measure.py` — the executable auditors

## Upstream (canonical source)

This install is a version-pinned snapshot. The canonical files live under
`https://raw.githubusercontent.com/graybyrd13/not-slop/main/dist/not-slop/` —
every relative path above resolves to that base plus the path (e.g.
`https://raw.githubusercontent.com/graybyrd13/not-slop/main/dist/not-slop/corpora/NOS_CORPUS.md`).
To update, reinstall — the installer overwrites this directory with the
latest snapshot. See the package README for the bundling tradeoff.
