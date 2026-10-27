#!/usr/bin/env bash
# Builds the Prism image (server + worker + frontend) from a committed revision.
# Usage: self-host/build-image.sh [rev]   (run anywhere with git and docker;
# PRISM_GIT_DIR points at a bare clone when the cwd is not a checkout)
#
# The context is `git archive` of the revision, so uncommitted files and host
# build output never reach the image. Base images are pinned by digest in
# packages/twenty-docker/twenty/Dockerfile and dependencies by yarn.lock.
set -euo pipefail

REV="${1:-HEAD}"
GIT=(git)
[ -n "${PRISM_GIT_DIR:-}" ] && GIT=(git --git-dir="$PRISM_GIT_DIR")

SHA="$("${GIT[@]}" rev-parse --verify "$REV^{commit}")"
SHORT="${SHA:0:12}"
UPSTREAM_VERSION="2.51.0"
TAG="prism:${UPSTREAM_VERSION}-${SHORT}"
CREATED="$("${GIT[@]}" show -s --format=%cI "$SHA")"

if [ -z "${PRISM_GIT_DIR:-}" ] && [ "$REV" = "HEAD" ] && [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is dirty; the image is built from the commit, not these changes." >&2
fi

"${GIT[@]}" archive --format=tar "$SHA" | docker build \
  --target twenty \
  -f packages/twenty-docker/twenty/Dockerfile \
  --build-arg APP_VERSION="${UPSTREAM_VERSION}" \
  --label org.opencontainers.image.title=Prism \
  --label org.opencontainers.image.description="Prism CRM (modified Twenty ${UPSTREAM_VERSION}), server and frontend" \
  --label org.opencontainers.image.source=https://github.com/msg-builds/Prism \
  --label org.opencontainers.image.revision="$SHA" \
  --label org.opencontainers.image.created="$CREATED" \
  --label org.opencontainers.image.licenses=AGPL-3.0-only \
  -t "$TAG" \
  -

docker image inspect --format '{{.Id}}' "$TAG" | sed "s|^|${TAG} |"
