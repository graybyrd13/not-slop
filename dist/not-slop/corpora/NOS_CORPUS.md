# NOS_CORPUS — the machine's ammunition
**not-slop · the critic's norms corpus**

## Entry format

Every entry below carries a YAML frontmatter block directly above it, so the
corpus is both human-readable and machine-validatable
(`scripts/validate_corpus.py` enforces the schema in CI). Fields:

- `id` — stable slug: `N1`–`N20` (slop-disgust), `PF1`–`PF5` (preflight),
  `TT-P1`–`TT-P4` / `TT-06`–`TT-12` (time-tells), `D1`–`D2` (copy specificity),
  `T1`–`T3` (positive thesis triad)
- `pattern` — the no's one-line name
- `tier` — `slop`, `preflight`, `time-tell`, `copy`, or `thesis`
- `check` — the mechanical, grep-able check; `⇒ FAIL` names the failure
- `evidence` — the counts / survey data behind the no (optional for
  thesis-tier entries)

The prose body under each frontmatter block is the entry's original text,
preserved intact.

Governing rule: every no is forbidding-grade — mechanical enough for a weak eye
to apply, or honestly tiered. TIER-1 = count/ruler, no taste. TIER-2 = one named
judgment call. TIER-3 = honestly unmechanized (never written as TIER-1).

If a crit finds ZERO nos firing, the crit failed — not the build.

---

## A. SLOP-DISGUST NOS (N1–N20) — from disgust forensics, 9 dashboard renders

---
id: "N1"
pattern: "No admin chrome by default"
tier: "slop"
check: "fixed sidebar ≥200px + header bar with ≥2 of {search, bell, avatar} on one screen ⇒ FAIL (unless the product IS an admin tool)."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N1** [T1] No admin chrome by default: fixed sidebar ≥200px + header bar with ≥2 of {search, bell, avatar} on one screen ⇒ FAIL (unless the product IS an admin tool).
---
id: "N2"
pattern: "No ALL-CAPS data labels"
tier: "slop"
check: "≥3 uppercase micro-labels ≤11px with letterspacing on one screen ⇒ FAIL. (Uppercase editorial eyebrows over headlines are fine — never as the label of a number.)"
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N2** [T1] No ALL-CAPS data labels: ≥3 uppercase micro-labels ≤11px with letterspacing on one screen ⇒ FAIL. (Uppercase editorial eyebrows over headlines are fine — never as the label of a number.)
---
id: "N3"
pattern: "No color-coded stat tiles"
tier: "slop"
check: "stat unit whose dominant color ∈ {blue, green, yellow, red, teal}, or white card with ≥4px solid color accent bar ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N3** [T1] No color-coded stat tiles: stat unit whose dominant color ∈ {blue, green, yellow, red, teal}, or white card with ≥4px solid color accent bar ⇒ FAIL.
---
id: "N4"
pattern: "No ghost icons"
tier: "slop"
check: "icon ≥3× text size at ≤25% opacity inside a stat unit ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N4** [T2] No ghost icons: icon ≥3× text size at ≤25% opacity inside a stat unit ⇒ FAIL.
---
id: "N5"
pattern: "No default chart colorways"
tier: "slop"
check: "≥2 series in the library's default palette with no documented custom color decision ⇒ FAIL. Go monochrome or specify every data color."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N5** [T2] No default chart colorways: ≥2 series in the library's default palette with no documented custom color decision ⇒ FAIL. Go monochrome or specify every data color.
---
id: "N6"
pattern: "No decorative world map"
tier: "slop"
check: "map present with <10 data-labeled regions ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N6** [T1] No decorative world map: map present with <10 data-labeled regions ⇒ FAIL.
---
id: "N7"
pattern: "No fake persona"
tier: "slop"
check: "topbar human name + avatar that isn't the signed-in user ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N7** [T1] No fake persona: topbar human name + avatar that isn't the signed-in user ⇒ FAIL.
---
id: "N8"
pattern: "No invented badge counts"
tier: "slop"
check: "numeric badges or decorative red dots not tied to real counts ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N8** [T1] No invented badge counts: numeric badges or decorative red dots not tied to real counts ⇒ FAIL.
---
id: "N9"
pattern: "No \"More info\" strips"
tier: "slop"
check: "darker footer strip on a stat tile whose only content is a generic more-link ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N9** [T1] No "More info" strips: darker footer strip on a stat tile whose only content is a generic more-link ⇒ FAIL.
---
id: "N10"
pattern: "No card control clusters"
tier: "slop"
check: "≥2 cards with corner kebab/collapse/close icons ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N10** [T1] No card control clusters: ≥2 cards with corner kebab/collapse/close icons ⇒ FAIL.
---
id: "N11"
pattern: "No fake chat / members filler"
tier: "slop"
check: "scripted chat threads, placeholder member rows ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N11** [T2] No fake chat / members filler: scripted chat threads, placeholder member rows ⇒ FAIL.
---
id: "N12"
pattern: "No delta-only narrative"
tier: "slop"
check: "≥3 cards where a colored %/arrow is the only non-number text ⇒ FAIL. Attach every delta to a sentence."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N12** [T1] No delta-only narrative: ≥3 cards where a colored %/arrow is the only non-number text ⇒ FAIL. Attach every delta to a sentence.
---
id: "N13"
pattern: "No per-card date selectors"
tier: "slop"
check: "same \"Last 7 days ▾\" on ≥3 cards ⇒ FAIL. One page-level time control max."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N13** [T1] No per-card date selectors: same "Last 7 days ▾" on ≥3 cards ⇒ FAIL. One page-level time control max.
---
id: "N14"
pattern: "No welcome-back card"
tier: "slop"
check: "\"Welcome back, {name}\" greeting card, flat corporate-illustration hero ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N14** [T2] No welcome-back card: "Welcome back, {name}" greeting card, flat corporate-illustration hero ⇒ FAIL.
---
id: "N15"
pattern: "No rainbow nav icons"
tier: "slop"
check: "sidebar with ≥4 nav icons in ≥4 distinct hues ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N15** [T1] No rainbow nav icons: sidebar with ≥4 nav icons in ≥4 distinct hues ⇒ FAIL.
---
id: "N16"
pattern: "No donut-gauge trios"
tier: "slop"
check: "row of ≥2 ring gauges with centered % labels ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N16** [T1] No donut-gauge trios: row of ≥2 ring gauges with centered % labels ⇒ FAIL.
---
id: "N17"
pattern: "No checkbox table as the page"
tier: "slop"
check: "checkbox-first-column table as primary content without a bulk-action bar ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N17** [T1] No checkbox table as the page: checkbox-first-column table as primary content without a bulk-action bar ⇒ FAIL.
---
id: "N18"
pattern: "No in-product upsell"
tier: "slop"
check: "\"Upgrade to Pro\" card inside app chrome ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N18** [T1] No in-product upsell: "Upgrade to Pro" card inside app chrome ⇒ FAIL.
---
id: "N19"
pattern: "No unmodified template token stack"
tier: "slop"
check: "<3 deliberate changes across {typeface, base size, border treatment, radius scale, primary hue} ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N19** [T2] No unmodified template token stack: <3 deliberate changes across {typeface, base size, border treatment, radius scale, primary hue} ⇒ FAIL.
---
id: "N20"
pattern: "No template-market marketing cluster"
tier: "slop"
check: "≥3 of {purple/blue gradient hero, star-rating badge, MIT badge, FREE DOWNLOAD/UPGRADE pair} ⇒ FAIL."
evidence: "from disgust forensics, 9 dashboard renders"
---

- **N20** [T1] No template-market marketing cluster: ≥3 of {purple/blue gradient hero, star-rating badge, MIT badge, FREE DOWNLOAD/UPGRADE pair} ⇒ FAIL.

## B. PRE-FLIGHT CHECKS (5 mechanical gates) — from 81 sites / 3,240 pairs

---
id: "PF1"
pattern: "Cross-project differentiation"
tier: "preflight"
check: "shares ≥1 typeface family with a previous project ⇒ FAIL."
evidence: "97% of pro pairs share zero."
---

- **PF1** Cross-project differentiation: shares ≥1 typeface family with a previous project ⇒ FAIL. (97% of pro pairs share zero.)
---
id: "PF2"
pattern: "Eyebrow cap"
tier: "preflight"
check: ">4 visible eyebrow/kicker labels on the page ⇒ FAIL."
evidence: "Pro median: 0."
---

- **PF2** Eyebrow cap: >4 visible eyebrow/kicker labels on the page ⇒ FAIL. (Pro median: 0.)
---
id: "PF3"
pattern: "Section repetition"
tier: "preflight"
check: "≥4 consecutive sections with identical (background, alignment, padding-size) triple ⇒ FAIL."
evidence: "0 occurrences in pro set. NOTE: the old analyzer REWARDED this as \"consistency\" — it is the top discriminator at 100%/0%."
---

- **PF3** Section repetition: ≥4 consecutive sections with identical (background, alignment, padding-size) triple ⇒ FAIL. (0 occurrences in pro set. NOTE: the old analyzer REWARDED this as "consistency" — it is the top discriminator at 100%/0%.)
---
id: "PF4"
pattern: "Template skeletons"
tier: "preflight"
check: "≥2 of {S1 centered hero stack (centered h1 + centered sub + ≥2 centered CTAs), S2 three-column feature grid, S3 centered dark CTA band} ⇒ FAIL."
evidence: "0/29 pro sites show ≥2."
---

- **PF4** Template skeletons: ≥2 of {S1 centered hero stack (centered h1 + centered sub + ≥2 centered CTAs), S2 three-column feature grid, S3 centered dark CTA band} ⇒ FAIL. (0/29 pro sites show ≥2.)
---
id: "PF5"
pattern: "Triple composite"
tier: "preflight"
check: "typeface J≥0.5 AND palette J≥0.5 AND breakpoint J≥0.5 vs any reference ⇒ FAIL."
evidence: "<0.1% of pro pairs."
---

- **PF5** Triple composite: typeface J≥0.5 AND palette J≥0.5 AND breakpoint J≥0.5 vs any reference ⇒ FAIL. (<0.1% of pro pairs.)

## C. 40-SECOND PROTOCOL (triage gate — run first)

≥2 fails ⇒ "rushed," ship-blocker. 1 fail ⇒ "look closer." 0 ⇒ not rushed by this protocol.
---
id: "TT-P1"
pattern: "`og:image` absent"
tier: "time-tell"
check: "`og:image` absent ⇒ FAIL."
evidence: "100% precision, 58% recall on corpus"
---

- **TT-P1** `og:image` absent ⇒ FAIL.
---
id: "TT-P2"
pattern: "Rendered-DOM `<h1>` count ≠ 1"
tier: "time-tell"
check: "Rendered-DOM `<h1>` count ≠ 1 ⇒ FAIL. (Run on rendered DOM, not source.)"
evidence: "100% precision, 58% recall on corpus"
---

- **TT-P2** Rendered-DOM `<h1>` count ≠ 1 ⇒ FAIL. (Run on rendered DOM, not source.)
---
id: "TT-P3"
pattern: "≥3 dead links AND dead/total ≥ 0.25"
tier: "time-tell"
check: "≥3 dead links AND dead/total ≥ 0.25 ⇒ FAIL."
evidence: "100% precision, 58% recall on corpus"
---

- **TT-P3** ≥3 dead links AND dead/total ≥ 0.25 ⇒ FAIL.
---
id: "TT-P4"
pattern: "`<title>` empty or >60 chars"
tier: "time-tell"
check: "`<title>` empty or >60 chars ⇒ FAIL."
evidence: "100% precision, 58% recall on corpus"
---

- **TT-P4** `<title>` empty or >60 chars ⇒ FAIL.
---
id: "TT-06"
pattern: "dead form"
tier: "time-tell"
check: "form present with no working submit handler ⇒ FAIL"
evidence: "additional tier-1 time-tell; 100% precision, 58% recall on corpus"
---

---
id: "TT-07"
pattern: "stale copyright year"
tier: "time-tell"
check: "footer copyright year ≠ current year ⇒ FAIL"
evidence: "additional tier-1 time-tell; 100% precision, 58% recall on corpus"
---

---
id: "TT-08"
pattern: "og:title/description missing"
tier: "time-tell"
check: "og:title or og:description absent ⇒ FAIL"
evidence: "additional tier-1 time-tell; 100% precision, 58% recall on corpus"
---

---
id: "TT-09"
pattern: "generic/numbered alt text"
tier: "time-tell"
check: "alt text that is generic or numbered (e.g. \"image 1\") ⇒ FAIL"
evidence: "additional tier-1 time-tell; 100% precision, 58% recall on corpus"
---

---
id: "TT-10"
pattern: "favicon missing live"
tier: "time-tell"
check: "no favicon served on the live page ⇒ FAIL"
evidence: "additional tier-1 time-tell; 100% precision, 58% recall on corpus"
---

---
id: "TT-12"
pattern: "lorem ipsum visible"
tier: "time-tell"
check: "lorem ipsum visible anywhere ⇒ FAIL (absolute gate)"
evidence: "additional tier-1 time-tell; 100% precision, 58% recall on corpus"
---

Validation: 100% precision, 58% recall on corpus. Additional tier-1 time-tells: dead form (TT-06), stale copyright year (TT-07), og:title/description missing (TT-08), generic/numbered alt text (TT-09), favicon missing live (TT-10), lorem ipsum visible (TT-12, absolute gate).

## D. COPY SPECIFICITY (with the number-trap guard)

---
id: "D1"
pattern: "Numbers must be anchored, not merely present"
tier: "copy"
check: "every stat anchored (source, date, or method); a bare unanchored number counts AGAINST ⇒ FAIL"
evidence: "88% of AI stats unanchored vs 0% pro; AI body copy has 2.7× MORE numbers than pro"
---

- Pro copy names numbers/names/constraints; AI copy leans on adjectives. BUT: AI body copy has 2.7× MORE numbers than pro — the gradient is number-ANCHORING, not number-presence. **88% of AI stats are unanchored vs 0% pro.** Never reward a bare number; every stat must be anchored (source, date, or method) or it counts AGAINST.
---
id: "D2"
pattern: "Banned vocabulary"
tier: "copy"
check: "banned abstract-adjective vocabulary present ⇒ FAIL: seamless, elevate, delve, unlock, supercharge, cutting-edge"
evidence: "the abstract-adjective cluster"
---

- Banned vocabulary: seamless, elevate, delve, unlock, supercharge, cutting-edge (the abstract-adjective cluster).

## E. POSITIVE THESIS TRIAD (R4 — the ceiling; all P0, merge-blocking)

---
id: "T1"
pattern: "NAME IT: state the artifact's aesthetic thesis in ≤5 words"
tier: "thesis"
check: "thesis cannot be stated in ≤5 words, or uses quality adjectives ⇒ P0 NO THESIS"
---

- **T1 NAME IT:** state the artifact's aesthetic thesis in ≤5 words, quality adjectives banned. Cannot ⇒ P0 NO THESIS.
---
id: "T2"
pattern: "COVERAGE: 5 random elements must each serve the thesis"
tier: "thesis"
check: "≥2 of 5 random elements serving only \"correctness\" ⇒ THESIS ABANDONED, P0"
---

- **T2 COVERAGE:** 5 random elements must each serve the thesis; ≥2 serving only "correctness" ⇒ THESIS ABANDONED, P0.
---
id: "T3"
pattern: "STAKES: a reasonable viewer must be able to dislike the artifact because of its thesis"
tier: "thesis"
check: "no reasonable viewer could dislike the artifact because of its thesis ⇒ NO STAKES, P0"
---

- **T3 STAKES:** if no reasonable viewer could dislike the artifact *because of its thesis* ⇒ NO STAKES, P0.
- The thesis sits ABOVE the nos: floor (never generic) + ceiling (actively committed). Only the critic judges it — never the analyzer.

## F. HYGIENE FLOOR

The craft v1 analyzer's 31 rules (title/meta/OG/alt/semantics/no-AI-tells). Necessary, never sufficient. The analyzer outputs only `clean` or `killed: <reasons>` — scores are hidden from the builder.
