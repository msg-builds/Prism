#!/usr/bin/env bash
# Restores Twenty's Enterprise-licensed files, which this repository does not
# contain (they are under Twenty's commercial licence, see LICENSE), from the
# pinned upstream commit, and checks each against enterprise-files.txt.
#
# Usage: self-host/restore-enterprise-files.sh [target-dir]
#   target-dir defaults to this checkout. PRISM_GIT_DIR points at the git
#   repository used to fetch upstream when the target is not a checkout.
#
# Restored files stay untracked: in a checkout they are added to
# .git/info/exclude, and CI fails if one is ever committed.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
MANIFEST="$HERE/enterprise-files.txt"
TARGET="$(cd "${1:-$HERE/..}" && pwd)"
UPSTREAM_URL="https://github.com/twentyhq/twenty"
UPSTREAM_COMMIT="$(sed -n 's/^# upstream [^ ]* \([0-9a-f]\{40\}\).*/\1/p' "$MANIFEST")"

GIT=(git -C "$TARGET")
[ -n "${PRISM_GIT_DIR:-}" ] && GIT=(git --git-dir="$PRISM_GIT_DIR")

if ! "${GIT[@]}" cat-file -e "${UPSTREAM_COMMIT}^{commit}" 2>/dev/null; then
  "${GIT[@]}" fetch --quiet --depth 1 --no-tags "$UPSTREAM_URL" "$UPSTREAM_COMMIT"
fi

mapfile -t PATHS < <(grep -v '^#' "$MANIFEST" | cut -d' ' -f2-)
"${GIT[@]}" archive --format=tar "$UPSTREAM_COMMIT" -- "${PATHS[@]}" | tar -x -C "$TARGET"

ACTUAL="$(cd "$TARGET" && printf '%s\n' "${PATHS[@]}" | git hash-object --stdin-paths)"
EXPECTED="$(grep -v '^#' "$MANIFEST" | cut -d' ' -f1)"
if [ "$ACTUAL" != "$EXPECTED" ]; then
  echo "Restored Enterprise files do not match enterprise-files.txt" >&2
  exit 1
fi

if [ -z "${PRISM_GIT_DIR:-}" ]; then
  EXCLUDE="$("${GIT[@]}" rev-parse --git-path info/exclude)"
  case "$EXCLUDE" in /*) ;; *) EXCLUDE="$TARGET/$EXCLUDE" ;; esac
  mkdir -p "$(dirname "$EXCLUDE")"
  if ! grep -q -x '# prism: enterprise files' "$EXCLUDE" 2>/dev/null; then
    { echo '# prism: enterprise files'; printf '/%s\n' "${PATHS[@]}"; } >> "$EXCLUDE"
  fi
fi

echo "Restored ${#PATHS[@]} Enterprise files from ${UPSTREAM_COMMIT:0:12}"
