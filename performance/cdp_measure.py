#!/usr/bin/env python3
"""Gold-standard G2 check via Chrome DevTools Protocol.

Usage:
  pip install --user websocket-client   # one-time
  google-chrome-stable --headless --no-sandbox --disable-dev-shm-usage \
      --remote-debugging-port=9222 --remote-allow-origins=* --user-data-dir=/tmp/cdp-profile &
  python3 cdp_measure.py http://127.0.0.1:8123/artifact.html

Prints JSON: for every <img>, currentSrc, naturalWidth, renderedWidth.
The agent applies the G2 rule: naturalWidth <= 2 * renderedWidth.
"""
import json, sys, time, urllib.request

URL = sys.argv[1] if len(sys.argv) > 1 else sys.exit('usage: cdp_measure.py <url>')
PORT = 9222


def cdp(method, params=None, _id=[0]):
    _id[0] += 1
    ws.send(json.dumps({'id': _id[0], 'method': method, 'params': params or {}}))
    while True:
        msg = json.loads(ws.recv())
        if msg.get('id') == _id[0]:
            if 'error' in msg:
                raise RuntimeError(msg['error'])
            return msg.get('result', {})


import websocket  # pip install websocket-client
targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json/list'))
page = next(t for t in targets if t['type'] == 'page')
ws = websocket.create_connection(page['webSocketDebuggerUrl'], timeout=30)

cdp('Page.enable')
cdp('Runtime.enable')
cdp('Page.navigate', {'url': URL})
# wait for load
for _ in range(60):
    time.sleep(0.5)
    state = cdp('Runtime.evaluate', {'expression': 'document.readyState'})['result']['value']
    if state == 'complete':
        break
time.sleep(1.5)  # let images decode

expr = """[...document.images].map((e, i) => ({
  src: e.currentSrc.startsWith('data:') ? 'data-uri[' + i + ']' : e.currentSrc.split('/').pop().slice(0, 60),
  naturalWidth: e.naturalWidth,
  renderedWidth: Math.round(e.getBoundingClientRect().width)
}))"""
res = cdp('Runtime.evaluate', {'expression': expr, 'returnByValue': True})
rows = res['result']['value']
print(json.dumps(rows, indent=2))

fails = [r for r in rows if r['naturalWidth'] > 2 * r['renderedWidth'] and r['renderedWidth'] > 0]
print(f"\nG2: {'FAIL — ' + str([r['src'] for r in fails]) if fails else 'PASS — all images within 2x of rendered width'}")
