# NOS_CORPUS — the machine's ammunition
**notslop · the critic's norms corpus**

Governing rule: every no is forbidding-grade — mechanical enough for a weak eye
to apply, or honestly tiered. TIER-1 = count/ruler, no taste. TIER-2 = one named
judgment call. TIER-3 = honestly unmechanized (never written as TIER-1).

If a crit finds ZERO nos firing, the crit failed — not the build.

---

## A. SLOP-DISGUST NOS (N1–N20) — from disgust forensics, 9 dashboard renders

- **N1** [T1] No admin chrome by default: fixed sidebar ≥200px + header bar with ≥2 of {search, bell, avatar} on one screen ⇒ FAIL (unless the product IS an admin tool).
- **N2** [T1] No ALL-CAPS data labels: ≥3 uppercase micro-labels ≤11px with letterspacing on one screen ⇒ FAIL. (Uppercase editorial eyebrows over headlines are fine — never as the label of a number.)
- **N3** [T1] No color-coded stat tiles: stat unit whose dominant color ∈ {blue, green, yellow, red, teal}, or white card with ≥4px solid color accent bar ⇒ FAIL.
- **N4** [T2] No ghost icons: icon ≥3× text size at ≤25% opacity inside a stat unit ⇒ FAIL.
- **N5** [T2] No default chart colorways: ≥2 series in the library's default palette with no documented custom color decision ⇒ FAIL. Go monochrome or specify every data color.
- **N6** [T1] No decorative world map: map present with <10 data-labeled regions ⇒ FAIL.
- **N7** [T1] No fake persona: topbar human name + avatar that isn't the signed-in user ⇒ FAIL.
- **N8** [T1] No invented badge counts: numeric badges or decorative red dots not tied to real counts ⇒ FAIL.
- **N9** [T1] No "More info" strips: darker footer strip on a stat tile whose only content is a generic more-link ⇒ FAIL.
- **N10** [T1] No card control clusters: ≥2 cards with corner kebab/collapse/close icons ⇒ FAIL.
- **N11** [T2] No fake chat / members filler: scripted chat threads, placeholder member rows ⇒ FAIL.
- **N12** [T1] No delta-only narrative: ≥3 cards where a colored %/arrow is the only non-number text ⇒ FAIL. Attach every delta to a sentence.
- **N13** [T1] No per-card date selectors: same "Last 7 days ▾" on ≥3 cards ⇒ FAIL. One page-level time control max.
- **N14** [T2] No welcome-back card: "Welcome back, {name}" greeting card, flat corporate-illustration hero ⇒ FAIL.
- **N15** [T1] No rainbow nav icons: sidebar with ≥4 nav icons in ≥4 distinct hues ⇒ FAIL.
- **N16** [T1] No donut-gauge trios: row of ≥2 ring gauges with centered % labels ⇒ FAIL.
- **N17** [T1] No checkbox table as the page: checkbox-first-column table as primary content without a bulk-action bar ⇒ FAIL.
- **N18** [T1] No in-product upsell: "Upgrade to Pro" card inside app chrome ⇒ FAIL.
- **N19** [T2] No unmodified template token stack: <3 deliberate changes across {typeface, base size, border treatment, radius scale, primary hue} ⇒ FAIL.
- **N20** [T1] No template-market marketing cluster: ≥3 of {purple/blue gradient hero, star-rating badge, MIT badge, FREE DOWNLOAD/UPGRADE pair} ⇒ FAIL.

## B. PRE-FLIGHT CHECKS (5 mechanical gates) — from 81 sites / 3,240 pairs

- **PF1** Cross-project differentiation: shares ≥1 typeface family with a previous project ⇒ FAIL. (97% of pro pairs share zero.)
- **PF2** Eyebrow cap: >4 visible eyebrow/kicker labels on the page ⇒ FAIL. (Pro median: 0.)
- **PF3** Section repetition: ≥4 consecutive sections with identical (background, alignment, padding-size) triple ⇒ FAIL. (0 occurrences in pro set. NOTE: the old analyzer REWARDED this as "consistency" — it is the top discriminator at 100%/0%.)
- **PF4** Template skeletons: ≥2 of {S1 centered hero stack (centered h1 + centered sub + ≥2 centered CTAs), S2 three-column feature grid, S3 centered dark CTA band} ⇒ FAIL. (0/29 pro sites show ≥2.)
- **PF5** Triple composite: typeface J≥0.5 AND palette J≥0.5 AND breakpoint J≥0.5 vs any reference ⇒ FAIL. (<0.1% of pro pairs.)

## C. 40-SECOND PROTOCOL (triage gate — run first)

≥2 fails ⇒ "rushed," ship-blocker. 1 fail ⇒ "look closer." 0 ⇒ not rushed by this protocol.
- **TT-P1** `og:image` absent ⇒ FAIL.
- **TT-P2** Rendered-DOM `<h1>` count ≠ 1 ⇒ FAIL. (Run on rendered DOM, not source.)
- **TT-P3** ≥3 dead links AND dead/total ≥ 0.25 ⇒ FAIL.
- **TT-P4** `<title>` empty or >60 chars ⇒ FAIL.
Validation: 100% precision, 58% recall on corpus. Additional tier-1 time-tells: dead form (TT-06), stale copyright year (TT-07), og:title/description missing (TT-08), generic/numbered alt text (TT-09), favicon missing live (TT-10), lorem ipsum visible (TT-12, absolute gate).

## D. COPY SPECIFICITY (with the number-trap guard)

- Pro copy names numbers/names/constraints; AI copy leans on adjectives. BUT: AI body copy has 2.7× MORE numbers than pro — the gradient is number-ANCHORING, not number-presence. **88% of AI stats are unanchored vs 0% pro.** Never reward a bare number; every stat must be anchored (source, date, or method) or it counts AGAINST.
- Banned vocabulary: seamless, elevate, delve, unlock, supercharge, cutting-edge (the abstract-adjective cluster).

## E. POSITIVE THESIS TRIAD (R4 — the ceiling; all P0, merge-blocking)

- **T1 NAME IT:** state the artifact's aesthetic thesis in ≤5 words, quality adjectives banned. Cannot ⇒ P0 NO THESIS.
- **T2 COVERAGE:** 5 random elements must each serve the thesis; ≥2 serving only "correctness" ⇒ THESIS ABANDONED, P0.
- **T3 STAKES:** if no reasonable viewer could dislike the artifact *because of its thesis* ⇒ NO STAKES, P0.
- The thesis sits ABOVE the nos: floor (never generic) + ceiling (actively committed). Only the critic judges it — never the analyzer.

## F. HYGIENE FLOOR

The craft v1 analyzer's 31 rules (title/meta/OG/alt/semantics/no-AI-tells). Necessary, never sufficient. The analyzer outputs only `clean` or `killed: <reasons>` — scores are hidden from the builder.
