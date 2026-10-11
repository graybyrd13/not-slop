# CSS & JS

## CSS: weight discipline

Budget: **50,000 bytes** of authored CSS (inline `<style>` + external
sheets combined). The machine's v5 artifact — a dense, professional-
reading page — used 13,121 bytes. 50 KB is ~4× headroom: strict enough
to forbid framework-scale output, generous enough to never bind a
hand-authored page.

Rules:

1. **No `@import`.** It serializes stylesheet loading (each import waits
   for the last). Use `<link>` or inline.
2. **Dead code is a defect.** A selector that matches nothing is bytes
   spent on nothing. Before sign-off, every selector must match at least
   one element in the document. (Checkable: parse selectors, run them
   against the DOM — or, pragmatically, keep the CSS hand-authored and
   small enough to review by eye. At 13 KB you can read the whole thing;
   at 500 KB you can't, which is the point.)
3. **No utility-framework output.** The canonical AI tell (token-soup
   class attributes, `max-w-7xl` clusters) is also a weight tell:
   framework CSS ships the entire design system whether the page uses it
   or not. Hand-authored CSS for one page beats generated CSS for every
   page.
4. **Inline critical CSS for single-file artifacts.** These builds are
   one HTML file; the CSS lives in `<style>` in `<head>`. There is no
   render-blocking stylesheet problem when there is no external
   stylesheet. If an external sheet ever appears, it must load
   non-blocking.

## JS: budget, justification, no frameworks

Budget: **30,000 bytes** total (inline + external). v5 needed 678 bytes.
These artifacts are documents, not applications — 30 KB is ~44× headroom,
and anything exceeding it is doing something the brief didn't ask for.

Rules:

1. **Every script is justified in the build ledger.** One line per script:
   what it does and why the page needs it. Unjustified JS is how
   analytics snippets, carousels, and "just in case" libraries sneak in.
   No ledger line, no script.
2. **No render-blocking scripts.** External scripts in `<head>` carry
   `defer` or `async`, no exceptions. Inline scripts go at the end of
   `<body>`.
3. **No frameworks or runtimes for document artifacts.** No React, Vue,
   jQuery, or any library whose runtime exists to manage state the page
   doesn't have. This is enforced as law, not taste: a framework runtime
   for a static document is pure overhead with zero user-facing benefit.
   Vanilla JS — or better, no JS — is the default.
4. **Progressive enhancement.** If the JS fails to load, the page must
   still read as the intended document. JS may add behavior; it may not
   be load-bearing for content or layout.

## The audit

`audit.py` checks: total CSS bytes, total JS bytes, external scripts
without `defer`/`async` in `<head>`, presence of known framework
signatures (react, vue, jquery in src attributes or global markers),
and cross-references each script against the ledger justification
(manual step — the agent reads the ledger).
