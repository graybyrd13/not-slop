#!/usr/bin/env python3
"""Validate not-slop corpus frontmatter schemas (stdlib only).

Walks ``corpora/`` and ``techniques/`` (repo-root-relative; override with
optional argv paths), parses every YAML-frontmatter block, and validates the
required fields per the schema registered for each file:

* ``corpora/NOS_CORPUS.md``  -> id, pattern, tier, check (+ optional evidence)
* ``corpora/YES_CORPUS.md``  -> id, site, claim (+ optional genre)
* ``techniques/TECHNIQUES.md`` -> id, name, recipe, breaks_when, validation,
  thesis_test

Checks: required fields present and non-empty, no unknown fields, ``tier``
drawn from the corpus's tier set, ``id`` unique within each file.

Prints ``file:line`` errors; exits 0 when clean, 1 on any violation.

Usage:
    python scripts/validate_corpus.py [corpora_dir] [techniques_dir]
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

SCHEMAS = {
    "NOS_CORPUS.md": {
        "dir": "corpora",
        "required": ("id", "pattern", "tier", "check"),
        "optional": ("evidence",),
        # tier names derived from the corpus sections:
        # A slop-disgust, B pre-flight, C time-tells, D copy specificity,
        # E positive thesis triad
        "tiers": {"slop", "preflight", "time-tell", "copy", "thesis"},
    },
    "YES_CORPUS.md": {
        "dir": "corpora",
        "required": ("id", "site", "claim"),
        "optional": ("genre",),
    },
    "TECHNIQUES.md": {
        "dir": "techniques",
        "required": ("id", "name", "recipe", "breaks_when",
                     "validation", "thesis_test"),
        "optional": (),
    },
}

DASH_RE = re.compile(r"^---\s*$")
KEY_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*):(.*)$")


class FrontmatterError(Exception):
    """A malformed frontmatter block, already formatted as file:line: msg."""


def parse_scalar(raw, fname, lineno):
    raw = raw.strip()
    if not raw:
        return ""
    if raw[0] == '"':
        if len(raw) < 2 or not raw.endswith('"'):
            raise FrontmatterError(
                f"{fname}:{lineno}: unterminated double-quoted scalar")
        out = []
        i = 1
        while i < len(raw) - 1:
            c = raw[i]
            if c == "\\" and i + 1 < len(raw) - 1:
                nxt = raw[i + 1]
                out.append({"n": "\n", "t": "\t", '"': '"',
                            "\\": "\\"}.get(nxt, nxt))
                i += 2
            else:
                out.append(c)
                i += 1
        return "".join(out)
    if raw[0] == "'":
        if len(raw) < 2 or not raw.endswith("'"):
            raise FrontmatterError(
                f"{fname}:{lineno}: unterminated single-quoted scalar")
        return raw[1:-1].replace("''", "'")
    return raw


def parse_frontmatter(block, fname, base_lineno):
    """Parse a frontmatter block (YAML subset). Returns (dict, key->lineno).

    Supports plain / single-quoted / double-quoted scalars and ``|`` / ``>``
    block scalars with consistently indented continuation lines.
    """
    data = {}
    key_lines = {}
    lines = block.split("\n")
    i, n = 0, len(lines)
    while i < n:
        raw_line = lines[i]
        lineno = base_lineno + i
        if not raw_line.strip():
            i += 1
            continue
        if raw_line[0] in " \t":
            raise FrontmatterError(
                f"{fname}:{lineno}: unexpected indentation "
                f"(field keys must start at column 0)")
        m = KEY_RE.match(raw_line)
        if not m:
            raise FrontmatterError(
                f"{fname}:{lineno}: expected 'key: value', "
                f"got: {raw_line.strip()[:70]!r}")
        key, rest = m.group(1), m.group(2).strip()
        if key in data:
            raise FrontmatterError(
                f"{fname}:{lineno}: duplicate field {key!r} "
                f"(first at line {key_lines[key]})")
        if rest in ("|", ">"):
            i += 1
            chunk = []
            while i < n and (lines[i].startswith("  ") or not lines[i].strip()):
                ln = lines[i]
                chunk.append(ln[2:] if ln.startswith("  ") else "")
                i += 1
            text = "\n".join(chunk)
            if rest == ">":
                paras = [re.sub(r"\s+", " ", p)
                         for p in text.split("\n\n")]
                value = "\n\n".join(p.strip() for p in paras if p.strip())
            else:
                value = text.rstrip("\n") + "\n" if text.strip() else ""
            data[key] = value
            key_lines[key] = lineno
            continue
        if rest == "":
            raise FrontmatterError(
                f"{fname}:{lineno}: field {key!r} has no value "
                f"(use a quoted scalar or a | block)")
        data[key] = parse_scalar(rest, fname, lineno)
        key_lines[key] = lineno
        i += 1
    return data, key_lines


def looks_like_frontmatter(block):
    """Heuristic: does this --- ... --- span look like attempted frontmatter
    (vs. a markdown horizontal rule)?"""
    for ln in block.split("\n"):
        if re.match(r"^[A-Za-z_][A-Za-z0-9_]*:\s", ln.strip()):
            return True
    return False


def validate_file(path, schema):
    errors = []
    lines = path.read_text(encoding="utf-8").split("\n")
    seen_ids = {}
    count = 0
    allowed = set(schema["required"]) | set(schema["optional"])
    i, n = 0, len(lines)
    while i < n:
        if not DASH_RE.match(lines[i]):
            i += 1
            continue
        j = i + 1
        while j < n and not DASH_RE.match(lines[j]):
            j += 1
        if j >= n:
            rest = "\n".join(lines[i + 1:])
            if looks_like_frontmatter(rest):
                errors.append(f"{path}:{i + 1}: unclosed frontmatter block")
            # else: a lone horizontal rule at end of file; ignore
            i += 1
            continue
        block = "\n".join(lines[i + 1:j])
        base = i + 2  # 1-based lineno of the block's first content line
        if not block.strip():
            i = j + 1
            continue
        try:
            data, key_lines = parse_frontmatter(block, str(path), base)
        except FrontmatterError as e:
            if looks_like_frontmatter(block):
                errors.append(str(e))
                i = j + 1
            else:
                i += 1  # horizontal rule, not frontmatter; keep scanning
            continue
        count += 1
        for key in data:
            if key not in allowed:
                errors.append(
                    f"{path}:{key_lines[key]}: unknown field {key!r} "
                    f"(allowed: {sorted(allowed)})")
        eid = str(data.get("id", "")).strip()
        for req in schema["required"]:
            if req not in data or not str(data[req]).strip():
                ln = key_lines.get(req, base)
                errors.append(
                    f"{path}:{ln}: entry {eid or '?'}: "
                    f"missing or empty required field {req!r}")
        if eid:
            if eid in seen_ids:
                errors.append(
                    f"{path}:{key_lines['id']}: duplicate id {eid!r} "
                    f"(first at line {seen_ids[eid]})")
            else:
                seen_ids[eid] = key_lines["id"]
        if schema.get("tiers") and "tier" in data:
            if str(data["tier"]) not in schema["tiers"]:
                errors.append(
                    f"{path}:{key_lines['tier']}: unknown tier "
                    f"{data['tier']!r} (allowed: {sorted(schema['tiers'])})")
        i = j + 1
    return errors, count


def main(argv):
    corpora_dir = Path(argv[1]) if len(argv) > 1 else REPO_ROOT / "corpora"
    techniques_dir = (Path(argv[2]) if len(argv) > 2
                      else REPO_ROOT / "techniques")
    errors = []
    total = 0
    for basename, schema in SCHEMAS.items():
        top = corpora_dir if schema["dir"] == "corpora" else techniques_dir
        path = top / basename
        if not path.is_file():
            errors.append(f"{path}: registered corpus file is missing")
            continue
        file_errors, count = validate_file(path, schema)
        errors.extend(file_errors)
        total += count
    if errors:
        for e in errors:
            print(f"error: {e}", file=sys.stderr)
        print(f"corpus validation FAILED: "
              f"{len(errors)} error(s) across {total} entries",
              file=sys.stderr)
        return 1
    print(f"corpus validation OK: {total} entries valid")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
