# TECHNIQUES — the machine's library of moves
**notslop · standing library · created 2026-10-11**

A technique is a thesis-agnostic HOW — a concrete execution recipe — never a
pre-made WHAT. "Stamp a sealing impression" is a technique: it can serve a
custody file, a voided ticket, or a library due-date slip. "A stamp component"
would be a trap: pre-made visual elements are how outputs converge into slop
(component assembly is a documented AI-tell mechanism). Every entry below is
executable from its recipe alone, carries strict BREAKS WHEN conditions, and
names what validated it. A technique used against its conditions is slop.

## T-01 — Stamp a sealing impression

**THE MOVE:** Two stacked SVG `<use>` passes of the same mark group. Pass 1:
the full mark at opacity 0.5–0.6 (the ink bed). Pass 2: the same mark masked
by a radial gradient (black center → white rim, e.g. stops at 52% black /
80% white) so only the rim survives, run through a speckle-fade filter
(`feTurbulence` fractalNoise baseFrequency 0.4–0.5, numOctaves 3 →
`feColorMatrix` converting noise to a speckle alpha mask → `feComposite`
operator="in"), at opacity 0.9–1.0. Wrap both passes in a group with an
edge-roughening filter (`feTurbulence` baseFrequency 0.8–1.0, numOctaves 2 →
`feDisplacementMap` scale 3–5). Single hue only — the stamp's existing color;
never introduce a second hue with the texture.

**BREAKS WHEN:** the mark reads as uniform flat color (drawn, not stamped);
a second hue enters; it is used for a brand/logo mark rather than an act of
sealing, certifying, or voiding; more than two stamp impressions appear on
one page (scarcity — seals are rationed).

**VALIDATED BY:** v5 (M-0005). Critic density audit D2 counted it as a
material decision; P4 verified legibility at page scale; F1 "commit to the
details."

**THESIS-TEST:** Served the custody file as a seal; the identical two-pass
recipe makes a VOID stamp on a ticket, a date stamp on a manifest, or a
due-date stamp on a library slip — any thesis where a human pressed ink.

## T-02 — Lay procedural paper tooth

**THE MOVE:** A full-viewport fixed overlay (`position:fixed; inset:0;
pointer-events:none`) carrying an inline SVG data-URI: `feTurbulence`
fractalNoise baseFrequency 0.7–0.9, numOctaves 2, `stitchTiles="stitch"` →
`feColorMatrix` to luminance-only alpha (alpha row ≈ 2.2, offset ≈ −0.75), on
a 200–240px tile at ~0.5 rect opacity; the overlay element itself at ~0.5
opacity, for near-zero net effect. For tipped-in sheets, add directional
ribbing: `repeating-linear-gradient(90deg, rgba(ink,0.016) 0 1px, transparent
1px 4px)`. No image files, ever. Grain must cover the whole sheet uniformly.

**BREAKS WHEN:** the grain is visible as a pattern (too strong); it appears
in one region only (a texture in one place is a sticker, not stock); it
introduces any hue; the thesis's stock is digital/gloss — grain says "paper,"
never put paper tooth on glass.

**VALIDATED BY:** v5 (M-0006). P4 color sweep verified zero hue introduced;
P1 confirmed the gradients in source are luminance-only material, not
decoration.

**THESIS-TEST:** Served the handled file; the same recipe gives tooth to a
letterpress poster site, a zine, a restaurant menu — any thesis with physical
stock.

## T-03 — Write with the hand as instrument

**THE MOVE:** Handwritten marks as monoline SVG pen-stroke paths
(`stroke:ink; fill:none; stroke-width:1.4–1.8; stroke-linecap/linejoin:round`),
built from a small reusable glyph set (each glyph in an ~8px box, 2–4 path
segments per character). Hard caps: ≤5 marks per page, each ≤2 words, each
naming a specific act (initials + date across a seal, check-mark on a verified
entry, clearance code on a row). Slight rotation (−7° to +4°), opacity
0.85–0.95. Never a handwriting font — real paths, a visibly different
instrument from the page type.

**BREAKS WHEN:** a sixth mark appears; any mark exceeds two words; a mark
cannot name its act; the hand writes sentences, flourished signatures, or
personality; a handwriting typeface is substituted for paths.

**VALIDATED BY:** v5 (M-0007: four marks, one consistent B.W. actor thread).
P4 type sweep verified legibility at desktop and 375px.

**THESIS-TEST:** Served the custody file as the registrar's hand; the same
instrument writes a chef's special on a menu board, a mechanic's tick on a
work order, a margin grade — any thesis where a human acted.

## T-04 — Redact preserving the void

**THE MOVE:** An inline-block bar sized to the line box it replaces
(`height:1em`, baseline-aligned), full density, with its own surface: a
luminance-only gradient (`linear-gradient(180deg,#232323,#0e0e0e)` — marker
ink faintly glossier than matte paper, zero hue). Each bar carries the
deletion's metadata adjacent (§ code, initials, date). Never white-out: the
withheld material's volume and location stay legible.

**BREAKS WHEN:** the bar whites out (volume lost); it carries no metadata;
its height breaks the line rhythm; it is used decoratively (fake
"classified" styling on a marketing page).

**VALIDATED BY:** v5 (M-0009). Critic accepted; no P4 findings.

**THESIS-TEST:** Served the access-log redaction; the same bar redacts prices
on a leaked memo, names on a court filing, answers on a quiz — any thesis
with withheld information.

## T-05 — Tip in a photographic plate

**THE MOVE:** A figure on foreign stock: 1px hairline border, background a
luminance-only shift of the page stock (a few points lighter/darker, zero hue
shift), 12–16px padding, caption beneath in the page's own type register
(never a restyled caption). The attachment is implied, never shown:
`box-shadow:0 3px 0 rgba(ink,0.07)` — bottom edge only, no blur spread, no
drop shadow. Optional directional ribbing on the mount (see T-02). Each plate
gets an affixed registrar tab (see T-09).

**BREAKS WHEN:** full-bleed imagery; blurred drop shadows; rounded "photo
card" styling; sepia/vintage filtering (new hues smuggled as texture); the
plate loses its mount boundary; a drawn element outshines the plate.

**VALIDATED BY:** v5 (M-0008: three plates replaced SVG line drawings). F1
"real product is always great"; critic density audit counted the plates.

**THESIS-TEST:** Served forensic exhibits; the same mounting presents product
photos on a spec sheet, archival photos in a family history, portfolio pieces
— any thesis where a photograph is evidence.

## T-06 — Annotate with leader-line callouts

**THE MOVE:** An absolutely-positioned SVG overlay (`inset:0`, viewBox
matching the photo's aspect ratio, e.g. 1920×1280) so it scales proportionally
with the image at every width — margins are width-invariant. Leader lines:
thin strokes (3–4px at 1920 viewBox) from a dot marker (r 8–10) at the feature
to the label; labels in the page's own type (never a "callout" style),
positioned with ≥30px safe margins from all plate edges at the reference
width. The SVG is `aria-hidden`; the annotation terms are duplicated in the
image's alt text.

**BREAKS WHEN:** a label touches or crosses the plate boundary at any width;
leader lines cross each other confusingly; more than four callouts on one
plate; the alt text does not carry the terms.

**VALIDATED BY:** v5 Exhibit B. P3 required the terms in alt text; P7-F01
verified width-invariant margins with CDP bounding boxes (36px/34px margins
at 1440).

**THESIS-TEST:** Served the f-hole macro; the same overlay annotates a watch
movement, a garment's stitching, a building detail — any thesis needing
precise pointing at photographic evidence.

## T-07 — Leave an adhesive ghost

**THE MOVE:** A faint luminance-only rectangle where a label was removed:
`background:rgba(255,255,255,.10)` (protected-stock tone) +
`border:1px solid rgba(ink,.08)`, slight rotation (−1° to −2°). No shadow, no
texture, no hue, no damage. Cap: ≤2 such accumulation marks per page, each
naming its past event.

**BREAKS WHEN:** it gains color, texture, or reads as distress; a third
accumulation mark appears; no past event can be named (then it is decoration,
not administration).

**VALIDATED BY:** v5 (M-0011: the 2016 re-jacketing event).

**THESIS-TEST:** Served the file's re-jacketing; the same ghost marks a
price sticker removed from a book cover, tape residue on a gallery wall — any
thesis with a removed label.

## T-08 — Void with a cancellation stamp

**THE MOVE:** A typed uppercase word (e.g. CANCELLED), letter-spacing
.2–.3em, weight 700, 2px solid ink border, padding ≈ 4px 11px 3px, opacity
0.8–0.85, rotated −5° to −8°, run through the edge-roughening filter from
T-01. Positioned deliberately off-grid across the voided line — stamps are not
grid-aligned. Must stay legible at reading distance (≥12px type).

**BREAKS WHEN:** illegible at page scale (under-committed — a tentative
detail is a defect); it reads as a graphic badge rather than an impression;
it is aligned to the grid like a UI element.

**VALIDATED BY:** v5 (M-0012). P4-F01: the critic flagged under-commitment
(10.5px/0.5 opacity) and the fix (12px/0.82) was re-verified in renders.

**THESIS-TEST:** Served the voided access line; the same stamp voids a
ticket, a coupon, a contract clause — any thesis with a revoked entry.

## T-09 — Affix a registrar label

**THE MOVE:** A small typed tab on the object's corner: absolute top-left,
page-stock background, 1px ink border, 3px 8px padding, 9–10px uppercase
letterspaced type encoding identity + sequence ("M-1716 · Exh A · Ph 1 ·
B.W."). Straight, never rotated, never restyled. Authority comes from
position and content, never treatment.

**BREAKS WHEN:** restyled, rotated, or carrying non-functional text; used as
a decorative tag.

**VALIDATED BY:** v5 (M-0010). P4 alignment sweep clean.

**THESIS-TEST:** Served the exhibit plates; the same tab labels museum
objects, evidence bags, archive boxes — any thesis where things are
catalogued.

## T-10 — Compress to a bounded object

**THE MOVE:** Tighten vertical rhythm mechanically — section padding, row
padding, element scale (v5: 38→24px section padding, 15→11px row padding,
seal 148→120px) — until the page reads in fewer screens; close with an
explicit terminus (a rule + "END OF FILE" style closer). Target ≈25% vertical
compression. Compression is spacing-values only: no section is cut or merged.

**BREAKS WHEN:** the page still reads as a feed; compression causes crowding
(the spacing sweep must stay clean); the brief's subject is genuinely
feed-shaped — then the brief is wrong, not this technique.

**VALIDATED BY:** v5 (M-0004). P1 verified bounded composition; P4 spacing
sweep clean after compression.

**THESIS-TEST:** Served the dossier; the same compression bounds a product
page, a menu, a portfolio — any thesis that is a finite object, not a stream.

## T-11 — Budget motion by distance

**THE MOVE:** Duration scales with distance traveled: tooltip 125ms <
popover 200ms < modal 250ms < drawer 500ms < fullscreen menu 0.8–1.25s.
Nothing routine exceeds 500ms. Enter decelerates
(`cubic-bezier(0.05,0.7,0.1,1)`), exit accelerates
(`cubic-bezier(0.3,0,0.8,0.15)`) — symmetric timing both directions is
forbidden. Standard UI: `(0.2,0,0,1)`; popovers: `(0.23,1,0.32,1)`; drawers:
`(0.32,0.72,0,1)`; view-transition snaps: `(0.87,0,0.13,1)`. Bare `ease` /
`ease-in-out` banned. Linear is allowed only for indeterminate spinners and
real-time progress.

**BREAKS WHEN:** a tooltip and a menu share a duration; enter and exit are
symmetric; routine motion exceeds 500ms; linear is used for non-progress
motion.

**VALIDATED BY:** MOTION_SYNTHESIS (206 exemplars across 12 themes); encoded
in passes.md P5. v5 P5 verified zero unbudgeted motion and byte-identical
reduced-motion renders.

**THESIS-TEST:** Thesis-agnostic by construction — interface physics, not
style. Serves a dossier's instant state swaps and a soda site's drawer alike.

## T-12 — Overlap exit and enter

**THE MOVE:** Start the entering element during the exiting element's exit
via negative timeline offsets — never a dead frame between states. Separate
function time from theater time: the state commits instantly; celebration
runs in parallel and never blocks the commit.

**BREAKS WHEN:** the exit fully finishes before the enter starts (dead
frame); a celebration animation delays the state commit (theater blocking
function).

**VALIDATED BY:** MOTION_SYNTHESIS rules 8–9; encoded in passes.md P5.

**THESIS-TEST:** A modal replacing a popover, a route transition, a tab
switch — any state change with two sides, any thesis.

## T-13 — Scrub without easing

**THE MOVE:** Scroll-linked tweens use `ease:none`, always — the scroll
position IS the timeline and easing fights it. Pin the stage (a pinned
container), never `position:fixed` scroll hacks. Horizontal scroll is limited
to one chapter; parallax applies to scenery, never to body copy.

**BREAKS WHEN:** an easing curve is applied to a scrubbed tween;
scroll-jacking; parallax on copy; pinned hacks via fixed positioning.

**VALIDATED BY:** MOTION_SYNTHESIS rule 13 + scroll patterns; encoded in
passes.md P5 (pinned stage, `ease:none` mandatory, reduced-motion checked).

**THESIS-TEST:** A product story chapter, a timeline, a process explainer —
any scroll-driven sequence, any thesis.

## T-14 — Animate transform and opacity only

**THE MOVE:** Motion touches `transform` and `opacity` — never
width/height/top/left (layout thrash). Popovers/dropdowns scale 0.9–0.95→1
with `transform-origin` anchored to the trigger edge, never the center.
Headline reveals use masked lines: `yPercent:110→0` with +2° rotateZ, words
kept as `inline-block` units with spaces preserved. The default fade-up
(opacity 0→1 + translateY(20px) on everything) is explicitly banned.

**BREAKS WHEN:** layout properties are animated; center-origin scaling (the
popup-ad look); the wholesale default fade-up; springs/bounce on
non-momentum UI (unearned overshoot).

**VALIDATED BY:** MOTION_SYNTHESIS rules 12, 14, 16; amateur-mistakes #1, #3,
#5 name the banned defaults. Encoded in passes.md P5.

**THESIS-TEST:** A popover on a dossier, a menu on a soda site — interface
physics, thesis-independent.

## T-15 — Finish gradients with grain

**THE MOVE:** Every gradient gets a procedural grain pass (luminance-only
noise at near-zero opacity, per T-02) to kill banding — banded gradients are
the #1 amateur tell. Use a tiled grain texture, never a full-screen noise
canvas.

**BREAKS WHEN:** the noise reads as a visible pattern; any hue is introduced;
a large flat gradient field is left banded.

**VALIDATED BY:** MOTION_SYNTHESIS "highest-leverage cheap details" #2;
v5's grain discipline (M-0006, M-0013: construction adds no hue).

**THESIS-TEST:** A soda site's color field, a dossier's panel, a hero sky —
any gradient anywhere, any thesis.

## T-16 — Document the product, don't advertise it

**THE MOVE:** Show the product dead-center, upright, fully visible, front
label legible, flat even light, neutral ground — nothing cropped, nothing
styled, no props, no gloss. When variants must be shown together, shoot each
in the IDENTICAL register and framing (same camera, same light, same mount)
so they read as a series. Authority comes from the absence of styling.

**BREAKS WHEN:** floating product, glossy CGI, props, cropped detail-as-hero,
per-variant restyling; illustration substituted for photography; a permanent
flavor/variant mislabeled as something else (inventing product facts).

**VALIDATED BY:** fanta-v1 direction (imagery register: "vexillological
documentation"). The builder STOPPED the run (L-0002) rather than violate
it — refusing to crop a GRAPE-labeled can as a "new seasonal flavor," to use
a multi-flavor lineup the brief forbade, or to draw the product. The
technique's authority was confirmed by the refusal.

**THESIS-TEST:** Served "flavor is a flag"; the same register documents a
watch for sale, a sneaker drop, a book cover — any thesis where the product
is the evidence.

## T-17 — Vary the section instrument

**THE MOVE:** No run of four or more identical section treatments. Alternate
the gathering's instrument by function: full-bleed panel, tipped-in sheet,
working instrument (form), plain sequence — each section gets the treatment
its job demands, audited mechanically in source (v5 held max-consecutive-
identical at 1 against a cap of 3).

**BREAKS WHEN:** every section is the same card/grid; variation is decorative
rather than functional — each treatment must match its section's job.

**VALIDATED BY:** v5 PF3 disposition (max consecutive identical = 1); P1
structure pass.

**THESIS-TEST:** Served the dossier's sections; the same rhythm varies a
menu's courses or a portfolio's case studies — any multi-section page, any
thesis.

## T-18 — Verify renders forensically

**THE MOVE:** When a visual defect is reported, reproduce it in a full-page
UNCROPPED capture before editing anything; measure with bounding boxes (CDP),
not eyeballing; run controlled A/B renders to isolate causes (e.g. LCD text
rendering on/off to test for stray pixels). Never edit to fix a phantom —
repositioning correct elements risks real defects.

**BREAKS WHEN:** editing from a cropped or zoomed screenshot alone; "fixing"
without reproduction; treating screenshot artifacts (subpixel fringing, crop
edges) as page defects.

**VALIDATED BY:** v5 P7-F01 (a "clipped label" correctly identified as a crop
artifact — closed with no edit) and P7-F02 (stray blue pixel isolated by A/B:
2154 strong-blue pixels with LCD text vs 0 without — screenshot artifact, no
source cause).

**THESIS-TEST:** A builder's self-verification move rather than a visual one:
served the dossier's QA loop; applies to any build, any thesis — "never
trust, always render," with method.

---

## WIRING — how the builder consults this library

1. **Allowlist.** TECHNIQUES.md is a builder input alongside the frozen
   brief, quarantined abstractions, and the materiality track. It is craft
   knowledge, not forbidden knowledge: it contains no critic tests, no nos
   corpus, no defect lists, and no pass checklists — nothing that lets the
   builder aim at the test instead of the brief.
2. **Consultation rule.** Before executing any material, texture,
   imagery-mounting, or motion decision, the builder checks whether a library
   technique covers it. If one does, the builder executes the recipe and cites
   the technique id in the ledger entry. If none does, the builder derives
   the move from the abstractions — and the new move becomes a candidate for
   the library through the learning loop.
3. **Precedence.** A technique serves the frozen One Idea or it is not used.
   A technique whose recipe conflicts with the brief's not-list is forbidden
   for that build, no exceptions. The brief always outranks the library; the
   library never invents a requirement the brief did not set.

### Proposed builder-charter amendment (for the coordinator to apply)

> **Technique library.** `TECHNIQUES.md` is an allowlisted builder input: a
> library of thesis-agnostic craft moves (how), never components (what). A
> technique may be used only when it serves the frozen One Idea — the builder
> names the served idea in the ledger entry alongside the technique id. A
> technique that contradicts the brief's not-list is forbidden for that build
> even when the recipe fits; the brief always outranks the library.
