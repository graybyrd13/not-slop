# VERDICT PROTOCOL — the machine's learning loop
**notslop · what happens after F1**

The run does not end at the verdict. A machine that starts every run cold
never gets better; Gray's verdicts are the only contact with reality the
machine has, and failing to encode them is throwing away the most expensive
signal in the system.

## The procedure (parent executes — never skipped, never automated)

1. **Present blind.** File + render only. No process narration, no origin
   talk, no calibration reveals. One crisp question on the rendered thing.
2. **Capture verbatim.** Record Gray's verdict word-for-word. Then ask the
   standing flip question: *"What single change would flip your verdict?"*
   Optionally: *"What was the strongest decision?"* Keep the burden minimal —
   two questions max.
3. **Relaunch for encoding.** Relaunch `craft-build` with
   `resumeFromRunId=<the run>` and `args.f1_verdict` set to the verdict text
   (verbatim) plus the flip-question answer. Completed phases are reused; only
   the learn phase runs.
4. **Review the proposals.** The learn phase writes
   `<run>/learn/verdict-lessons.md`: concrete proposed edits (file, location
   anchor, exact new text, rationale tied to a verdict quote, confidence).
   The parent reviews each proposal on the merits.
5. **Apply by hand.** Approved edits go into the machine files directly:
   - New forbidding-grade nos → `NOS_CORPUS.md`
   - New exemplary references or bar refinements → `YES_CORPUS.md`
   - Brief weaknesses (hedged fields, failed unreachability in hindsight) →
     `brief-template.md`
   - Charter gaps (builder/critic/passes) → the respective charter
   - Process observations → `passes.md`, `render-loop.md`, `ledger-format.md`
6. **Log it.** Record applied lessons in the daily memory note: what the
   verdict taught, what changed in the machine, what to watch next run.

## What the learn phase may NOT do

- Edit standing machine files itself. It *proposes*; the parent *applies*.
  The machine's law changes only through a human-gated review.
- Invent lessons the verdict doesn't support. Every proposal must quote the
  verdict (or the ledger) as evidence. No verdict content → no proposal.
- Rewrite history. Superseded entries keep their status; nothing is deleted.

## Standing verdicts become law

A verdict that repeats an earlier one strengthens the corresponding entry
(confidence up, not a duplicate). A verdict that contradicts a standing
entry triggers the stare-decisis treatment: the contradiction is written up
explicitly, and the parent decides whether the old entry is DISTINGUISHED or
OVERRULED — never silently dropped.

## "Ship" verdicts are encoded too

A clean ship is not "nothing to learn." The learn phase must name what
*worked* — the decisions the verdict (or the flip-question answer) implies
were load-bearing — and propose them as standing directives or yes-corpus
entries. The machine should know what to repeat, not just what to avoid.
