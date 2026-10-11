# Images

## Format discipline

Decision tree, in order:

1. **Photographic content → AVIF first, WebP fallback.** Published codec
   comparisons report WebP ~25–34% smaller than JPEG at matched quality
   (Google) and AVIF ~50% smaller (AOMedia/Netflix testing). Serve AVIF
   with a WebP fallback via `<picture>` when the build pipeline supports
   it; WebP alone is acceptable.
2. **Non-photographic content (line art, diagrams, UI) → PNG or SVG.**
   SVG for anything vector-drawn (it scales infinitely and is usually
   bytes, not kilobytes).
3. **Never PNG for photographs.** PNG is lossless and designed for sharp
   edges; a photographic PNG is routinely 3–10× the weight of an
   equivalent-quality WebP. This is the single most common image defect.
4. **Never JPEG when AVIF/WebP is available.** JPEG survives only as a
   fallback for ancient clients.

Verify format by magic bytes, never by extension. Quick reference:
`FF D8 FF` = JPEG, `89 50 4E 47` = PNG, `52 49 46 46 .... 57 45 42 50` =
WebP (`RIFF....WEBP`), AVIF is ISO-BMFF (`66 74 79 70` = `ftyp` in the
first bytes). `audit.py` checks this with PIL.

## The 2× slot rule

An image's intrinsic pixel width must not exceed 2× its rendered CSS width.

Why 2× and not 1×: `devicePixelRatio: 2` (retina) displays genuinely use
the extra pixels. Why not 3×: no mainstream display needs it, and the
byte cost is quadratic — doubling width quadruples pixels.

How to comply when preparing an asset:

```bash
# Know the slot: read the rendered width from the CSS (max-width of the
# container, or the explicit slot width). Then:
python3 -c "
from PIL import Image
im = Image.open('plate.png')
w, h = im.size
target = SLOT_WIDTH * 2
if w > target:
    im = im.resize((target, round(h * target / w)), Image.LANCZOS)
    im.save('plate.webp', 'WEBP', quality=82)
"
```

Quality starting points (tune by eye, never by superstition): WebP
quality 80–85, AVIF quality 60–70 (AVIF's scale differs; 60 ≈ WebP 80).
If the image still exceeds its role cap after resizing to the 2× slot,
lower quality before reaching for a larger cap — the cap is the law.

## Role budgets (decoded bytes)

- **Hero / LCP: 200,000.** The first-seen image. Spend here first and
  deliberately — this is the one image allowed to be heavy.
- **Secondary: 150,000.** Plates, exhibits, supporting photographs.
- **Thumbnail: 50,000.** Anything small.

Assign the role in the build ledger when the image is chosen, not after
the audit fails. The default when unassigned: the first content image is
the hero, everything else is secondary.

## Loading discipline

- The LCP image: `fetchpriority="high"`, never `loading="lazy"`, and
  preloaded only if it is also the single most critical asset on the page
  (usually it isn't — `fetchpriority` is enough).
- Every image below the fold: `loading="lazy"`. No exceptions. Lazy
  loading is free and the failure mode of forgetting it is silent
  overweight on every visit.
- Always include `width` and `height` attributes (or an aspect-ratio box)
  so lazy images don't shift layout — a CLS defect is a performance
  defect wearing a different hat.

## The base64 rule

Embedding (data URIs) is allowed only when **all** of these hold:

1. The single image is ≤ 100,000 bytes *encoded*.
2. All embedded images total ≤ 300,000 bytes *encoded*.
3. The document still passes G1 (total ≤ 1 MB).

Why the suspicion: base64 adds ~33% overhead, prevents progressive
decoding, and defeats caching — change one word of copy and the browser
re-downloads every embedded image. The one thing embedding buys is
single-file portability, which is genuinely valuable for these artifacts.
Under 100 KB that trade wins; over it, it loses on every axis. The v5
build embedded 1.55 MB (decoded) — 74% of its 2.05 MB document — which is
what this rule exists to forbid.

When images must be separate files: keep them next to the document,
reference with relative paths, and keep every loading/format/size rule
above. The audit measures them the same either way.

## Preparing assets: the checklist

1. Determine the rendered slot width from the CSS.
2. Resize to ≤ 2× the slot (LANCZOS).
3. Encode AVIF (or WebP), tune quality to land under the role cap.
4. Confirm format by magic bytes.
5. Decide embed vs. file by the base64 rule.
6. Set `loading` / `fetchpriority` / dimensions.
7. Run `audit.py`.
