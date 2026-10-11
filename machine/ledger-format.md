# DECISION LEDGER — the machine's memory
**notslop machine · Part 4 of 6**

The ledger is executed, not read. Standing entries are compiled into reviewer
checks: a pass that contradicts an entry fails; a pass that ignores one fails
too. Amnesia is how the mean sneaks back in.

## Entry format (minimal — refuses separate rationale fields)

A rationale that matters is a sentence in the statement. Fields:

```
id:        L-0042  (monotonic, never reused)
date:      2026-10-11
decision:  <what was decided, one sentence>
rationale: <why, one to three sentences — the reason a later pass needs>
breaks-when: <observable signal that falsifies this decision>
confidence: high | medium | low
status:    standing | superseded | weakened
```

- **breaks-when** is the load-bearing field (the one the 2005 ADR original had
  and minimalism deleted): a *falsifiable tripwire*, not a note. "Breaks when
  the hero copy exceeds 12 words" — observable, checkable.
- **The blur test gates writes:** "could a later pass re-derive this from the
  brief alone?" If yes, don't log it. (Stolen from domain-modeling's ADR
  three-gate: log only if hard-to-reverse AND surprising-without-context AND a
  real trade-off. Documentation theater is banned.)
- **Record the kills, not just the wins.** Every entry's rejected options are
  the critic's anti-relapse weapon: they stop the next pass re-deriving the
  attractive wrong answer.

## The stare decisis protocol (the forcing function)

For every standing entry a pass's work touches, the pass must declare exactly
one of:

- **APPLY** — cite the entry id; the work follows it.
- **DISTINGUISH** — the facts differ; say precisely why the entry doesn't bind
  here. (Not a loophole: the distinction is itself reviewable.)
- **OVERRULE** — write a superseding entry with new evidence; the old entry's
  status becomes `superseded`, never deleted. History is preserved.

**There is no silent fourth option.** A pass that touches a standing entry
without declaring is an automatic critic finding (P1).

## DEVIATION entries (deliberate improvisation)

A builder's deliberate deviation from the brief/direction is logged as a
DEVIATION entry — same fields as a normal entry, plus two required extras:

```
id:        L-0043
date:      2026-10-11
type:      DEVIATION
decision:  <what was done instead of the briefed constraint, one sentence>
constraint-broken: <the exact brief/direction constraint, quoted>
one-idea-service:  <one clause: how this serves the frozen One Idea BETTER
                    than compliance would>
rationale: <why, one to three sentences>
breaks-when: <observable signal that falsifies this deviation>
confidence: high | medium | low
status:    standing
```

The `one-idea-service` clause is load-bearing: if it can't be written in one
clause, the deviation is unjustified and dies. The critic judges DEVIATION
entries against the One Idea on the merits (critic charter); an upheld
deviation is recorded as such and may not be re-litigated by later passes.

## Ledger placement and lifecycle

- Lives in-repo next to the work (`ledger/` or the project's docs dir), not in
  a separate system. Entry #1 is always the frozen brief.
- **Tripwire ritual at ship:** every standing entry checked — holds / weakened /
  broken — against its `breaks when` signal. Broken entries are superseded in
  writing, never silently dropped.
- **Invalidation propagation:** a structural change that re-runs P3–P5 also
  re-opens any ledger entries those passes' work touches — APPLY/DISTINGUISH/
  OVERRULE re-declared.

## The critic/ledger interlock

The critic receives entries **as constraints** (decision + tripwires + rejected
list), never as narratives — enforcing the decision without inheriting the
builder's blindness. The critic verifies stare-decisis compliance mechanically:
every touched entry must carry a declaration.

## Worked examples

```
id:        L-0001
date:      2026-10-11
decision:  The page reads as a dossier, not a listing: single contact path,
           no price grid, no comparison table.
rationale: The brief's One Idea is "evidence, not merchandise"; any
           commerce chrome contradicts it. Rejected: tiered pricing cards
           (reads as SaaS), "request quote" form grid (reads as lead-gen).
breaks-when: a second conversion path appears anywhere on the page.
confidence: high
status:    standing
```

```
id:        L-0002
date:      2026-10-11
decision:  Palette is ink-on-paper monochrome; the single color moment is
           the seal/stamp, used once.
rationale: Monochrome + one rationed brand moment is the brief's restraint
           mechanism. Rejected: gold accents (luxury pastiche — brief
           NOT-list #1), drafting-red annotations (techy costume).
breaks-when: a second hue appears outside the seal, or the seal appears
           more than once per viewport.
confidence: medium
status:    standing
```

```
id:        L-0003
date:      2026-10-11
decision:  No scroll-driven animation on the custody ledger; it is a
           document and documents don't perform.
rationale: Motion budget reserved for the single reveal moment (the seal
           draw). Animating the ledger would spend surprise where the brief
           wants calm. Rejected: staggered row entrances (the v2 failure
           pattern — decoration spending the brief's restraint).
breaks-when: any ledger row animates on scroll.
confidence: medium
status:    standing
```

{{AMMO: ledger anti-patterns — the documentation-theater entries to refuse,
from the visual track's process observations}}
