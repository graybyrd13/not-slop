#!/bin/sh
# not-slop installer — one-command install of the not-slop skill.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/graybyrd13/not-slop/main/install.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/graybyrd13/not-slop/main/install.sh | bash -s -- --dir /custom/path
#
# Installs dist/not-slop from the not-slop repo into a skill directory
# (default: ~/.claude/skills/not-slop).
#
# POSIX sh. Requires: curl, tar. Creates parent dirs as needed.
# Existing target is overwritten (with notice).

set -eu

VERSION_FALLBACK="0.1.0"
TARBALL_URL="https://github.com/graybyrd13/not-slop/archive/refs/heads/main.tar.gz"
DIST_SUBPATH="dist/not-slop"
DEFAULT_DIR="$HOME/.claude/skills/not-slop"

usage() {
    cat <<'EOF'
Usage: install.sh [--dir <path>]

Installs the not-slop skill.

Options:
  --dir <path>   Install target directory (default: ~/.claude/skills/not-slop)
  -h, --help     Show this help

Examples:
  ./install.sh
  ./install.sh --dir /tmp/not-slop-test
EOF
}

TARGET=""
while [ $# -gt 0 ]; do
    case "$1" in
        --dir)
            [ $# -ge 2 ] || { echo "error: --dir requires a path argument" >&2; exit 1; }
            TARGET="$2"
            shift 2
            ;;
        --dir=*)
            TARGET="${1#--dir=}"
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "error: unknown option: $1" >&2
            usage >&2
            exit 1
            ;;
    esac
done

if [ -z "$TARGET" ]; then
    TARGET="$DEFAULT_DIR"
fi

# --- dependency checks -------------------------------------------------------
for cmd in curl tar; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "error: required command '$cmd' is not installed or not on PATH." >&2
        echo "Install $cmd and re-run this installer." >&2
        exit 1
    fi
done

# --- download ----------------------------------------------------------------
TMPDIR_WORK="$(mktemp -d 2>/dev/null || mktemp -d -t not-slop-install)"
cleanup() { rm -rf "$TMPDIR_WORK"; }
trap cleanup EXIT INT TERM

echo "Downloading not-slop (main)..."
if ! curl -fsSL "$TARBALL_URL" -o "$TMPDIR_WORK/not-slop.tar.gz"; then
    echo "error: download failed from $TARBALL_URL" >&2
    exit 1
fi

if ! tar -xzf "$TMPDIR_WORK/not-slop.tar.gz" -C "$TMPDIR_WORK"; then
    echo "error: failed to extract the downloaded tarball" >&2
    exit 1
fi

DIST_DIR=""
for candidate in "$TMPDIR_WORK"/*/dist/not-slop; do
    if [ -d "$candidate" ] && [ -f "$candidate/SKILL.md" ]; then
        DIST_DIR="$candidate"
        break
    fi
done
if [ -z "$DIST_DIR" ]; then
    echo "error: could not find '$DIST_SUBPATH' inside the downloaded tarball" >&2
    exit 1
fi

# --- version -----------------------------------------------------------------
VERSION="$VERSION_FALLBACK"
TOP_CHANGELOG="$(dirname "$DIST_DIR")/../CHANGELOG.md"
if [ -f "$TOP_CHANGELOG" ]; then
    # first "## [x.y.z]" heading in CHANGELOG.md
    VLINE="$(grep -m1 -E '^## \[[0-9]+\.[0-9]+\.[0-9]+\]' "$TOP_CHANGELOG" || true)"
    if [ -n "$VLINE" ]; then
        VERSION="$(printf '%s' "$VLINE" | sed -E 's/^## \[([0-9]+\.[0-9]+\.[0-9]+)\].*/\1/')"
    fi
fi

# --- install -----------------------------------------------------------------
if [ -e "$TARGET" ] && [ -n "$(ls -A "$TARGET" 2>/dev/null)" ]; then
    echo "Notice: target '$TARGET' already exists — overwriting."
fi
mkdir -p "$TARGET"

# copy (including dotfiles) into the target
cp -r "$DIST_DIR"/. "$TARGET"/

# --- summary -----------------------------------------------------------------
echo ""
echo "Installed not-slop v$VERSION"
echo "  Location : $TARGET"
echo "  Entry    : $TARGET/SKILL.md"
echo "  Contents : SKILL.md + corpora/ + techniques/ + machine/ + performance/"
echo "  Source   : $TARBALL_URL ($DIST_SUBPATH)"
echo ""
echo "Give $TARGET/SKILL.md to your agent when it builds anything a human will see."
