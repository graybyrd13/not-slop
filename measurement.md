# Measurement

How a checking agent audits a build. Two tiers: the static audit runs
always; the CDP rendered audit is the gold standard for the 2× slot rule.

## Tier 1 — Static audit (always)

Run `audit.py` against the artifact:

```bash
python3 audit.py /path/to/artifact.html
```

It implements gates G1, G3–G10 and a proxy G2 using only stdlib + PIL:

- Totals the document bytes, decodes every data URI, and reports each
  embedded asset's size and MIME type.
- Lists every external subresource (`<img src>`, `<script src>`,
  `<link>`, CSS `url()`).
- Reads image headers via PIL: format (by magic bytes), intrinsic
  dimensions — for data URIs and local files alike.
- Extracts `max-width` declarations from the CSS and uses the largest as
  the slot-width upper bound for the proxy G2 check.
- Checks `loading`, `fetchpriority`, `width`/`height` on every `<img>`.
- Checks `font-display` on every `@font-face`, counts families/weights,
  sums woff2 bytes, flags any `fonts.googleapis.com`/`gstatic` reference
  and counts font preloads.
- Checks every `<script src>` in `<head>` for `defer`/`async`, sums JS,
  flags framework signatures.

Output is one PASS/FAIL line per gate with the measured value. A FAIL is
a build defect and routes to the builder with the gate name and the
number — same as any other defect.

The static audit is sufficient to sign off when it passes cleanly *and*
no image is near the 2× proxy bound. If the proxy flags anything, or any
image is within 20% of the bound, run Tier 2.

## Tier 2 — CDP rendered audit (gold standard for G2)

Rendered widths come from layout, not from CSS text. Procedure:

```bash
# 1. One-time setup
pip install --user websocket-client

# 2. Serve the artifact directory (CDP needs http, not file://)
cd /path/to/artifact/dir && python3 -m http.server 8123 &

# 3. Launch Chrome with remote debugging (remote-allow-origins is required
#    on current Chrome builds, otherwise the websocket handshake gets 403)
google-chrome-stable --headless --no-sandbox --disable-dev-shm-usage \
  --remote-debugging-port=9222 --remote-allow-origins=* --user-data-dir=/tmp/cdp-profile &

# 4. Measure
python3 cdp_measure.py http://127.0.0.1:8123/artifact.html
```

`cdp_measure.py` opens a DevTools target, evaluates JavaScript over the
live DOM, and prints JSON: for every `<img>`, its `currentSrc`,
`naturalWidth`, and rendered `getBoundingClientRect().width`. The agent
then applies the G2 rule (`naturalWidth ≤ 2 × renderedWidth`) directly.
This is the governing check — if Tier 2 disagrees with the Tier 1 proxy,
Tier 2 wins.

## What the audit does not do

It does not measure Core Web Vitals in the field (no real-user data
exists for these artifacts). It does not simulate throttled networks —
the budgets are derived from time-based methodology instead (see
`budgets.md`), which is the professional substitute. If lab timing is
ever needed, Chrome's DevTools throttling presets ("Fast 3G") plus the
LCP ≤ 2.5 s bar are the reference, but the byte budgets are the gate.
