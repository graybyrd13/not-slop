# Performance Gate Spec

The skill-side outline. A checking agent enforces every gate from this file
alone; it pulls the topic files (`images.md`, `fonts.md`, `css-js.md`) only
for technique depth on *how* to check or fix. The rationale behind every
number lives in `budgets.md`.

All sizes are in bytes. "Decoded" means after base64 decoding for data URIs.

---

## G1 — TOTAL-WEIGHT

The document plus every subresource it loads must fit in **1,000,000 bytes**.

- **CHECK:** Sum the UTF-8 bytes of the HTML document, the decoded bytes of
  every data URI, and the transfer/file bytes of every external subresource
  (`<img src>`, `<script src>`, `<link rel=stylesheet>`, font files,
  CSS `url()` references). `audit.py` computes this.
- **FAIL:** Total > 1,000,000 bytes. No exceptions, no waivers.

## G2 — IMAGE-SLOT

No raster image may be served at more than **2×** its rendered display width.

- **CHECK (gold):** In headless Chrome via `cdp_measure.py`, read each
  `<img>`'s `naturalWidth` and its rendered `getBoundingClientRect().width`.
  Fail any image where `naturalWidth > 2 × renderedWidth`.
- **CHECK (static proxy):** With `audit.py`, take the largest `max-width`
  declared in the page CSS as the slot upper bound; fail any image whose
  intrinsic width exceeds 2× that bound. The proxy is a pre-check only —
  the gold check governs.
- **FAIL:** Any image over the 2× line.

## G3 — IMAGE-ROLE CAPS

Per-image decoded-size caps by role:

| Role        | Cap        | Typical use                          |
|-------------|------------|--------------------------------------|
| Hero / LCP  | 200,000    | The single largest, first-seen image |
| Secondary   | 150,000    | Plates, exhibits, supporting photos  |
| Thumbnail   | 50,000     | Small previews, icons-as-images      |

- **CHECK:** Decode each data URI / read each image file; compare against the
  role the builder assigned in the ledger (default: first content image =
  hero, the rest = secondary).
- **FAIL:** Any image over its role cap.

## G4 — EMBED DISCIPLINE

Base64 embedding is for portability of small assets, not for smuggling
megabytes into the document.

- **CHECK:** For each `data:image/...` URI, measure the *encoded* length.
  Sum all encoded image bytes.
- **FAIL:** Any single embedded image > 100,000 bytes encoded, **or** total
  embedded images > 300,000 bytes encoded. Above that, images must be
  separate files.

## G5 — FONT WEIGHT BUDGET

- **CHECK:** Sum the bytes of all served woff2 files. Count distinct
  `font-family` names and distinct weights across `@font-face` rules.
- **FAIL:** Total woff2 > 100,000 bytes, **or** more than 2 families,
  **or** more than 3 weights.

## G6 — FONT DISCIPLINE

- **CHECK:** (a) Every `@font-face` declares `font-display: swap` (or
  optional). (b) Zero references to `fonts.googleapis.com` /
  `fonts.gstatic.com` anywhere in the document. (c) At most one
  `<link rel="preload" as="font">`.
- **FAIL:** Any violation of (a), (b), or (c).

## G7 — CSS WEIGHT

Authored CSS must fit in **50,000 bytes**.

- **CHECK:** Sum the UTF-8 bytes of all inline `<style>` blocks plus all
  external stylesheets.
- **FAIL:** Total > 50,000 bytes.

## G8 — JS WEIGHT AND JUSTIFICATION

- **CHECK:** Sum the UTF-8 bytes of all inline and external scripts.
  Read the build ledger: every `<script>` must have a one-line stated
  purpose. No JavaScript framework or runtime (React, Vue, jQuery, etc.)
  may be loaded for a document-type artifact.
- **FAIL:** Total JS > 30,000 bytes, **or** any script without a ledger
  justification, **or** any framework present.

## G9 — RENDER-BLOCKING

- **CHECK:** (a) No `<script src>` in `<head>` without `defer` or `async`.
  (b) Every stylesheet is either inline in the document or loaded
  non-blocking (`media="print"` swap pattern or equivalent).
- **FAIL:** Any violation of (a) or (b).

## G10 — IMAGE HYGIENE

- **CHECK:** (a) Every `<img>` below the fold carries `loading="lazy"`.
  (b) The LCP image carries `fetchpriority="high"` and does **not** carry
  `loading="lazy"`. (c) Every photographic image is AVIF or WebP —
  verified by file magic bytes, not extension. PNG is permitted only for
  non-photographic content (line art, UI).
- **FAIL:** Any violation of (a), (b), or (c).

---

## Enforcement order

Run `audit.py` first (covers G1, G3–G10 and proxy G2). If the proxy G2
flags anything — or if the artifact is near any cap — run the CDP
gold-standard check for G2 before signing off. A gate failure is a
build defect: route to the builder with the gate name and the measured
value, same as any other defect.
