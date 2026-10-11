# Budget Rationale

Every number in `GATE_SPEC.md`, with its provenance. Labels:

- **[standard]** — a published, checkable industry standard.
- **[method]** — the professional methodology the number is derived from.
- **[community]** — long-standing community consensus, not a formal standard.
- **[research]** — a finding from this project's own research corpus.
- **[measured]** — measured from the machine's own artifacts.
- **[judgment]** — my call, with the reasoning shown. Disagree by arguing
  with the reasoning, not the number.

## G1 — Total ≤ 1,000,000 bytes

**[method]** Professional performance budgets are derived from time goals,
not chosen by feel: pick the network and the time target, divide. Google's
Web Vitals **[standard]** define "good" Largest Contentful Paint as ≤ 2.5 s.
On Chrome DevTools' "Fast 3G" preset (1.6 Mbps ≈ 200 KB/s), 1 MB needs ~5 s
of transfer — already over the LCP bar — while on typical broadband
(≥ 10 Mbps) it needs under a second. The 1 MB line is therefore the
**[community]** "fast page" boundary (the 1 MB / 512 KB club ethos): above
it, the page cannot be fast on a slow connection no matter how well built.
**[measured]** The machine's v5 artifact shipped at 2,098,818 bytes and
this gate catches it. The exact figure (1,000,000 rather than 900,000 or
1,200,000) is **[judgment]**: round, memorable, enforceable, and roughly
2× headroom over what a disciplined single-page artifact needs.

Stretch target: 600,000 bytes (≈3 s on Fast 3G — inside the LCP bar).

## G2 — Intrinsic ≤ 2× rendered width

**[method]** The responsive-images model (`srcset`/`sizes`) exists to serve
roughly 1×–2× the display size: 1× for the CSS pixel, 2× for retina
(`devicePixelRatio: 2`) displays. Pixels beyond 2× are never seen by any
mainstream display and are pure waste. **[measured]** v5 served ~1.55 MB of
plate images into ~340 px slots — roughly 5× overshoot. At 2× those slots
need ≤ 680 px-wide images, about one-fifth the pixels. This single gate
would have eliminated most of v5's overweight.

## G3 — Role caps: hero 200 KB, secondary 150 KB, thumbnail 50 KB

**[judgment]** anchored to LCP timing: the hero is usually the LCP element,
so it gets the tightest *timing* attention but the largest *size* allowance —
200 KB is ~1 s on Fast 3G for the single most important asset, and a
1600 px AVIF/WebP photograph at 200 KB is visually transparent at normal
viewing distances. Secondary images support rather than lead: 150 KB each
keeps four plates under 600 KB combined, inside the stretch total.
Thumbnails are never looked at closely: 50 KB is generous.
**[measured]** sanity check: v5's three plates averaged ~517 KB decoded —
more than 3× the secondary cap — and carried no visible benefit for it.

## G4 — Embed: 100 KB per image, 300 KB total (encoded)

**[judgment]** with physical reasoning. Base64 inflates bytes by ~33%,
defeats progressive decoding (the browser must receive the whole document
before any embedded image can paint), and defeats caching (edit one byte of
copy and every image re-downloads). Below ~100 KB the portability win of a
single self-contained file outweighs those costs; above it, the costs
dominate and separate files win on every axis. 300 KB total keeps embedded
images under one-third of the total budget. **[measured]** v5 embedded
1,551,234 decoded bytes (×1.33 encoded) — 74% of the document — the
canonical violation.

## G5 — Fonts ≤ 100 KB, ≤ 2 families, ≤ 3 weights

**[research]** The project's own website-track research found 9/10
professional sites self-host versioned woff2 and use *one* font family with
a rationed set of weights. **[judgment]** A subsetted latin woff2 is
typically 15–40 KB, so 2 families × 2 weights lands at 60–100 KB — the cap
is the research finding expressed as a number, with headroom for one extra
weight. More than that is almost always "I couldn't decide," not "the
design needed it."

## G6 — font-display: swap, zero Google Fonts hotlinks, ≤ 1 preload

**[standard]** `font-display: swap` is the documented best practice for
avoiding invisible text during font load (web.dev font guidance).
**[research]** Zero Google Fonts hotlinking is a direct research finding
(9/10 pro sites, zero hotlinks) — third-party font requests add DNS,
connection, and render-blocking costs the machine refuses to pay.
**[judgment]** Preloading more than one font just moves the bottleneck;
one preload for the single most critical weight is the discipline.

## G7 — CSS ≤ 50,000 bytes

**[measured]** v5's entire authored CSS was 13,121 bytes. 50 KB is roughly
4× headroom over a shipped, dense, professional-reading artifact —
**[judgment]** strict enough to forbid framework-scale CSS (a utility
framework's output is typically 10–100× this), generous enough to never
bind a hand-authored page.

## G8 — JS ≤ 30,000 bytes, justified, no frameworks

**[measured]** v5 needed 678 bytes of JS. These artifacts are documents,
not applications. **[judgment]** 30 KB is ~44× headroom — any page exceeding
it is doing something the brief didn't ask for. The justification rule
(each script's purpose in the ledger) exists because unjustified JS is how
analytics snippets, carousels, and "just in case" libraries sneak in. The
framework ban is **[judgment]**: a framework runtime for a static document
is pure overhead with no user-facing benefit; label it honestly as taste
enforced as law.

## G9 — No render-blocking scripts; non-blocking CSS

**[standard]** `defer`/`async` for scripts and non-blocking stylesheet
patterns are baseline documented best practice (web.dev). A synchronous
script in `<head>` halts parsing — the single cheapest defect to forbid.

## G10 — Lazy discipline; AVIF/WebP for photos

**[standard]** `loading="lazy"` for below-fold images and
`fetchpriority="high"` for the LCP image are documented best practice
(web.dev lazy-loading guidance). Format: published codec comparisons
report WebP ~25–34% smaller than JPEG at matched quality (Google) and
AVIF ~50% smaller (AOMedia/Netflix testing) — cited as their claims, not
mine. PNG-for-photos is forbidden because PNG is a lossless format
designed for sharp edges; using it on photographs is the most common
single-image overweight defect. **[judgment]** on the enforcement level:
checked by magic bytes, not file extension, because extensions lie.
