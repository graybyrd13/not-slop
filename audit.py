#!/usr/bin/env python3
"""Static performance auditor for craft artifacts.

Implements gates G1, G3-G10 and a proxy G2 from GATE_SPEC.md using only
stdlib + PIL. Usage: python3 audit.py /path/to/artifact.html [--dir BASE]

Exit 0 = all gates pass. Exit 1 = any gate fails.

Proxy notes (printed inline):
- G2 proxy uses the largest CSS max-width as the slot upper bound.
- G3 roles default: first content image = hero, rest = secondary.
- G10 "below the fold" proxy: every image after the first must be lazy.
- G10c proxy: PNG > 100KB decoded is treated as photographic-in-wrong-format.
- G8 script justification is MANUAL: the script lists scripts; the agent
  verifies each against the build ledger.
"""
import re, sys, os, base64, io

CAP_TOTAL = 1_000_000
CAP_HERO = 200_000
CAP_SECONDARY = 150_000
CAP_THUMB = 50_000
CAP_EMBED_ONE = 100_000
CAP_EMBED_TOTAL = 300_000
CAP_FONTS = 100_000
CAP_CSS = 50_000
CAP_JS = 30_000

try:
    from PIL import Image as PILImage
    HAVE_PIL = True
except ImportError:
    HAVE_PIL = False

results = []  # (gate, ok, detail)

def check(gate, ok, detail):
    results.append((gate, ok, detail))

def main():
    path = sys.argv[1]
    base = sys.argv[2] if len(sys.argv) > 2 else os.path.dirname(os.path.abspath(path))
    raw = open(path, 'r', encoding='utf-8', errors='replace').read()
    total_bytes = len(raw.encode('utf-8'))

    # ---- data URIs ----
    data_uris = re.findall(r'data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)', raw)
    embed_imgs = []  # (mime, encoded_len, decoded_len, pil_info)
    for mime, b64 in data_uris:
        b64 = re.sub(r'\s', '', b64)
        enc = len(b64)
        try:
            dec = base64.b64decode(b64)
        except Exception:
            check('G4', False, f'undecodable data URI ({mime})')
            continue
        info = img_info(dec)
        if mime.startswith('image/'):
            embed_imgs.append((mime, enc, len(dec), info))

    # ---- external refs ----
    img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', raw, re.I)
    ext_imgs = [s for s in img_srcs if not s.startswith('data:')]
    script_srcs = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', raw, re.I)
    inline_scripts = re.findall(r'<script(?![^>]*src=)[^>]*>(.*?)</script>', raw, re.S | re.I)
    head_scripts = re.findall(r'<head.*?</head>', raw, re.S | re.I)
    head_sync = 0
    if head_scripts:
        for m in re.finditer(r'<script[^>]+src=["\'][^"\']+["\'][^>]*>', head_scripts[0], re.I):
            tag = m.group(0)
            if 'defer' not in tag.lower() and 'async' not in tag.lower():
                head_sync += 1
    style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', raw, re.S | re.I)
    css_text = '\n'.join(style_blocks)
    css_bytes = len(css_text.encode('utf-8'))
    js_bytes = sum(len(s.encode('utf-8')) for s in inline_scripts)
    font_faces = re.findall(r'@font-face\s*{([^}]*)}', css_text, re.I)
    families = set(re.findall(r'font-family\s*:\s*["\']?([^;"\']+)', css_text, re.I))
    weights = set(re.findall(r'font-weight\s*:\s*([^;}]+)', css_text, re.I))
    no_swap = sum(1 for ff in font_faces if 'font-display' not in ff.lower()
                  or ('swap' not in ff.lower() and 'optional' not in ff.lower()))
    google_fonts = len(re.findall(r'fonts\.googleapis\.com|fonts\.gstatic\.com', raw, re.I))
    preloads = len(re.findall(r'rel=["\']preload["\'][^>]*as=["\']font["\']|as=["\']font["\'][^>]*rel=["\']preload["\']', raw, re.I))
    max_widths = [int(x) for x in re.findall(r'max-width\s*:\s*(\d+)px', css_text, re.I)]
    slot_bound = max(max_widths) if max_widths else None

    # woff2 bytes: data-uri fonts + local files referenced in @font-face
    font_bytes = 0
    for mime, b64 in data_uris:
        if 'font' in mime or 'woff2' in mime:
            font_bytes += len(base64.b64decode(re.sub(r'\s', '', b64)))
    for url in re.findall(r'url\(["\']?([^"\')]+)["\']?\)', css_text):
        if url.endswith('.woff2') and not url.startswith('data:'):
            p = os.path.join(base, url)
            if os.path.exists(p):
                font_bytes += os.path.getsize(p)

    # ---- local/remote image measurement ----
    def local_img(path):
        p = os.path.join(base, path)
        if os.path.exists(p):
            with open(p, 'rb') as f:
                return f.read()
        return None

    # all images: (label, decoded_bytes, pil_info, is_embedded)
    images = []
    for i, (mime, enc, declen, info) in enumerate(embed_imgs):
        images.append((f'embed[{i}] {mime}', declen, info, True, enc))
    for s in ext_imgs:
        if s.startswith('http'):
            images.append((s, None, None, False, None))
        else:
            data = local_img(s)
            info = img_info(data) if data else None
            images.append((s, len(data) if data else None, info, False, None))

    # ---- G1 ----
    ext_bytes = 0
    unmeasured = []
    for label, declen, info, emb, enc in images:
        if declen is None:
            unmeasured.append(label)
    # (external file images already counted? No: total = doc + external files.
    #  embedded already inside doc bytes.)
    for label, declen, info, emb, enc in images:
        if not emb and declen:
            ext_bytes += declen
    grand = total_bytes + ext_bytes + font_bytes  # font files separate from doc
    check('G1', grand <= CAP_TOTAL,
          f'total {grand:,} bytes (doc {total_bytes:,}, ext imgs {ext_bytes:,}, fonts {font_bytes:,})'
          + (f'; UNMEASURED: {unmeasured}' if unmeasured else ''))

    # ---- G2 proxy ----
    if slot_bound:
        bad = [(l, w) for (l, d, info, e, x) in images
               for w in [info[1] if info else None]
               if w and w > 2 * slot_bound]
        check('G2-proxy', not bad,
              f'slot bound {slot_bound}px from CSS; ' +
              ('violations: ' + ', '.join(f'{l} ({w}px)' for l, w in bad) if bad else 'no image over 2x'))
    else:
        check('G2-proxy', True, 'no max-width found in CSS; run Tier-2 CDP check')

    # ---- G3 ----
    g3_ok, g3_det = True, []
    for i, (label, declen, info, emb, enc) in enumerate(images):
        if declen is None:
            g3_det.append(f'{label}: UNMEASURED'); continue
        cap = CAP_HERO if i == 0 else CAP_SECONDARY
        role = 'hero' if i == 0 else 'secondary'
        if declen > cap:
            g3_ok = False
        g3_det.append(f'{label}: {declen:,}b as {role} (cap {cap:,})')
    check('G3', g3_ok, '; '.join(g3_det) if g3_det else 'no images')

    # ---- G4 ----
    enc_total = sum(enc for _, _, _, _, enc in images if enc)
    one_bad = [l for (l, d, info, e, enc) in images if enc and enc > CAP_EMBED_ONE]
    check('G4', not one_bad and enc_total <= CAP_EMBED_TOTAL,
          f'total embedded {enc_total:,}b encoded' +
          (f'; over 100KB singles: {one_bad}' if one_bad else ''))

    # ---- G5 ----
    check('G5', font_bytes <= CAP_FONTS and len(families) <= 2 and len(weights) <= 3,
          f'woff2 {font_bytes:,}b, families {len(families)}, weights {len(weights)}')

    # ---- G6 ----
    check('G6', no_swap == 0 and google_fonts == 0 and preloads <= 1,
          f'@font-face without swap/optional: {no_swap}, google-fonts refs: {google_fonts}, font preloads: {preloads}')

    # ---- G7 ----
    check('G7', css_bytes <= CAP_CSS, f'CSS {css_bytes:,} bytes')

    # ---- G8 ----
    fw = [s for s in script_srcs if re.search(r'react|vue|jquery|svelte|angular', s, re.I)]
    fw += ['inline-react-marker'] if re.search(r'React\.createElement|__VUE__|jQuery', raw) else []
    check('G8', js_bytes <= CAP_JS and not fw,
          f'JS {js_bytes:,} bytes (cap {CAP_JS:,}), external scripts: {len(script_srcs)}, '
          f'framework markers: {fw if fw else "none"}; MANUAL: verify each script justified in ledger')

    # ---- G9 ----
    ext_css = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]*>', raw, re.I)
    blocking_css = [t for t in ext_css if 'media=' not in t.lower()]
    check('G9', head_sync == 0 and not blocking_css,
          f'sync head scripts: {head_sync}, blocking stylesheets: {len(blocking_css)}')

    # ---- G10 ----
    img_tags = re.findall(r'<img[^>]+>', raw, re.I)
    lazy_bad, lcp = [], None
    for i, tag in enumerate(img_tags):
        low = tag.lower()
        if i == 0:
            lcp = tag
            continue
        if 'loading="lazy"' not in low and "loading='lazy'" not in low:
            lazy_bad.append(f'img[{i}]')
    lcp_ok = True
    lcp_det = 'no images'
    if lcp:
        low = lcp.lower()
        has_fp = 'fetchpriority="high"' in low or "fetchpriority='high'" in low
        is_lazy = 'loading="lazy"' in low or "loading='lazy'" in low
        lcp_ok = has_fp and not is_lazy
        lcp_det = f'fetchpriority=high: {has_fp}, lazy: {is_lazy}'
    fmt_bad = []
    for label, declen, info, emb, enc in images:
        if info and declen:
            fmt, w, h = info
            if fmt == 'PNG' and declen > 100_000:
                fmt_bad.append(f'{label} (PNG {declen:,}b — photographic content in wrong format)')
    check('G10', not lazy_bad and lcp_ok and not fmt_bad,
          f'non-lazy below-fold: {lazy_bad if lazy_bad else "none"}; LCP: {lcp_det}; format: '
          + ('; '.join(fmt_bad) if fmt_bad else 'ok (proxy: PNG>100KB flagged)'))

    # ---- report ----
    failed = 0
    for gate, ok, detail in results:
        print(('PASS' if ok else 'FAIL'), gate, '-', detail)
        if not ok:
            failed += 1
    print(f'{len(results) - failed}/{len(results)} gates pass')
    if not HAVE_PIL:
        print('WARN: PIL not installed; image format/dimension checks skipped')
    sys.exit(1 if failed else 0)


def img_info(data):
    """Return (format, width, height) from magic bytes + PIL; None if unknown."""
    if not data or not HAVE_PIL:
        return None
    try:
        im = PILImage.open(io.BytesIO(data))
        return (im.format, im.width, im.height)
    except Exception:
        return None


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('usage: python3 audit.py /path/to/artifact.html [asset_dir]')
        sys.exit(2)
    main()
