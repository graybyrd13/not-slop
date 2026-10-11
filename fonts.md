# Fonts

## The standing law

Self-host versioned woff2. Zero Google Fonts hotlinking. This is not a
preference — it is a research finding: 9/10 professional sites in the
project's website-track research self-host versioned woff2, and zero
hotlink Google Fonts. A third-party font request costs DNS + connection +
potential render-blocking on every visit, and hands a render-critical
asset to someone else's uptime. Self-hosting is also what makes the
100 KB budget *checkable*: the files are in the build, measured like
everything else.

## Budget

- **Total woff2 ≤ 100,000 bytes.** A subsetted latin woff2 runs 15–40 KB;
  two families × two weights lands at 60–100 KB.
- **≤ 2 families, ≤ 3 weights.** The research found the pros use *one*
  family with rationed weights. Two families is the ceiling, not the
  target.
- **≤ 1 `<link rel="preload" as="font">`.** Preloading more than one font
  just moves the bottleneck. Preload the single most critical weight or
  preload nothing.

## Subsetting

Serve only the glyphs the page uses. A full latin woff2 carries hundreds
of glyphs the page will never render.

```bash
# pyftsubset ships with fonttools: pip install fonttools brotli
pyftsubset "Font-Regular.woff2" \
  --output-file="Font-Regular.subset.woff2" \
  --flavor=woff2 \
  --unicodes="U+0000-00FF,U+2013-2014,U+2018-2019,U+201C-201D,U+2026"
```

The unicode range above covers Basic Latin + Latin-1 Supplement + the
common punctuation the page actually uses (en/em dashes, curly quotes,
ellipsis). Extend it only for glyphs present in the page's copy — check
the copy first, subset second. Declare the subset explicitly:

```css
@font-face {
  font-family: "Example";
  src: url("example-regular.subset.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
  unicode-range: U+0000-00FF, U+2013-2014, U+2018-2019, U+201C-201D, U+2026;
}
```

Version the file (`example-regular.v1.subset.woff2`) so updates don't
fight caches — this is the "versioned" in "versioned woff2."

## font-display

Every `@font-face` declares `font-display: swap` (or `optional` for
non-critical display faces). Never `block`, never `auto` (which behaves
as `block` in most browsers — invisible text while the font loads).
`swap` shows fallback text immediately and swaps when the font arrives:
the page is never blank, which is the entire point.

## The audit

`audit.py` checks: total woff2 bytes, family count, weight count,
`font-display` on every `@font-face`, zero `fonts.googleapis.com` /
`fonts.gstatic.com` references, preload count. All static, no browser
needed.

## When the page needs no webfont

System stacks are a valid choice and the cheapest one — v5 shipped zero
webfonts and passed every font gate trivially. A webfont must earn its
bytes: if the design works in a system stack, the 100 KB stays unspent.
"Could look nicer" is not earning it; "the thesis requires this voice"
is.
