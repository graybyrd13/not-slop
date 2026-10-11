# RENDER LOOP — the machine's eyes
**notslop machine · Part 6 of 6**

The original sin of v1–v3: three pages shipped without ever being seen. The
agent is never allowed to not-see its own work again. The render loop is the
external ground truth that makes self-correction work instead of degrade.

## Screenshot points (when)

1. **After every significant change** during build — not at the end. The loop
   is continuous, not a final gate.
2. **At every pass boundary** — each of the 8 passes starts from a fresh
   render, not from memory of the last one.
3. **Before every critic invocation** — the critic judges renders, never
   source.
4. **At ship** — the final renders become the baseline for the next iteration's
   regression diffs.

## The 3 viewports (every screenshot point)

- Desktop 1440px, tablet 768px, mobile 375px. Full-page captures.
- The P7 fresh-eyes format-shift may add zoom/medium variants; those are
  review aids, not baseline viewports.

## Deterministic diff first, vision critic second

Industry practice converges (Playwright/pixelmatch YIQ, Chromatic's 0.063
threshold):

1. **Per-pixel diff in YIQ color space** against the baseline. Ignore
   anti-aliased pixels. Thresholds + region scoping handle signal vs noise —
   not staring at pixels.
2. **The automated layer may KILL on regressions — it may never PASS.**
   A clean diff is the absence of detected change, not the presence of
   quality. Passing requires the adversarial critic. This asymmetry is
   load-bearing: the machine that can pass itself is the machine that ships
   the mean.
3. **Diff triage:** changed regions + diff % become artifacts the critic
   receives alongside the renders. The critic sees *what changed* and *where*,
   then judges *whether it should have*.

## Kill-vs-pass rules

| Signal | Authority |
|---|---|
| Pixel diff vs baseline exceeds threshold in a region | KILL (automated) — builder must explain or revert |
| Baseline itself changed intentionally | New baseline requires a ledger entry (OVERRULE the old baseline) |
| Diff clean | Nothing — proceed to critic; clean diffs earn no credit |
| Critic P0 | KILL (binding at harness level) |
| Critic all-clear + 7 passes clean + stop rule met | PASS — the only path to ship |

## What the loop does NOT do

- It does not judge aesthetics. Diffs detect change; only the critic (armed
  with the brief and the norms corpus) judges.
- It does not replace the critic. A pixel-perfect regression of a bad design
  is still a bad design — the diff layer would pass what the critic must kill.
- It does not run on source. Rendered pixels or nothing.

## Implementation notes (durable)

- Headless Chrome: `--headless --no-sandbox --disable-dev-shm-usage
  --ignore-certificate-errors --proxy-server=<fwd> --virtual-time-budget=15000
  --window-size=<W>,<H> --hide-scrollbars --screenshot=<path>`
  (`--disable-dev-shm-usage` is load-bearing against OOM-kill.)
- Screen recording for motion review: Xvfb + Chrome `--remote-debugging-port`
  + ffmpeg x11grab.
- If screenshots run through a proxy, keep auth in the environment — nothing
  secret on disk.
- Keep all pipeline scripts in the repo or a durable workspace path; never in
  `/tmp` (ephemeral on many CI runners).

{{AMMO: diff thresholds per region type — what counts as a regression in
chrome vs content vs imagery}}
{{AMMO: the motion-review protocol — what the critic looks for in recordings,
from the visual track's motion findings}}
