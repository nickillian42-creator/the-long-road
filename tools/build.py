#!/usr/bin/env python3
"""Assemble src/ modules into the single-file index.html.

The game ships (GitHub Pages + preview) as one self-contained index.html.
Edit the modules under src/ and rebuild; never edit index.html directly.

Module order is load order. All modules share one global scope (plain
<script>, no ES modules), so cross-module calls work exactly as before.

Usage: python3 tools/build.py   (run from the repo root)
Output: index.html
"""
import pathlib

REPO = pathlib.Path(__file__).resolve().parent.parent
SRC = REPO / 'src'

JS_MODULES = [
    'core/globals.js',
    'core/ui.js',
    'core/state.js',
    'core/engine.js',
    'chapters/prologue.js',
    'chapters/chapter1.js',
    'data/items.js',
    'sim/combat.js',
    'sim/rng.js',
    'sim/difficulty.js',
    'sim/inventory.js',
    'sim/survival.js',
    'sim/scavenging.js',
    'sim/invui.js',
    'boot.js',
]

def main():
    parts = [(SRC / 'shell' / 'top.html').read_text()]
    for m in JS_MODULES:
        p = SRC / m
        if not p.exists():
            raise SystemExit(f'missing module: {m}')
        parts.append(p.read_text())
    parts.append((SRC / 'shell' / 'bottom.html').read_text())
    out = ''.join(parts)
    (REPO / 'index.html').write_text(out)
    print(f'wrote index.html ({len(out)} bytes) from {len(JS_MODULES)} modules')

if __name__ == '__main__':
    main()
