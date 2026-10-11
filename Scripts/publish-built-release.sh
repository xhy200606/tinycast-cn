#!/bin/bash
set -euo pipefail
: "${BUILD_VERSION:?}" "${BUILD_ARCHITECTURE:?}" "${GITHUB_REPOSITORY:?}"
[[ "$BUILD_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
case "$BUILD_ARCHITECTURE" in
  arm64) expected_archs=arm64 ;;
  universal) expected_archs='arm64 x86_64' ;;
  *) exit 1 ;;
esac
info="dist/BUILD-INFO-${BUILD_ARCHITECTURE}.txt"
grep -Fx "Repository: $GITHUB_REPOSITORY" "$info"
grep -Fx "Version: $BUILD_VERSION" "$info"
grep -Fx "Architectures: $expected_archs" "$info"
source_sha=$(sed -n 's/^Source: //p' "$info")
[[ "$source_sha" =~ ^[a-f0-9]{40}$ ]]
test "$source_sha" = "${SOURCE_SHA:?}"
shasum -a 256 -c "dist/SHA256SUMS-${BUILD_ARCHITECTURE}.txt"
tag="v${BUILD_VERSION}"
if gh release view "$tag" --repo "$GITHUB_REPOSITORY" >/dev/null 2>&1; then
  published_sha=$(gh api "repos/$GITHUB_REPOSITORY/commits/$tag" --jq .sha)
  test "$published_sha" = "$source_sha" || {
    echo '::error::This release belongs to another source commit.'
    exit 1
  }
else
  target_args=(--target "$source_sha")
  if gh api "repos/$GITHUB_REPOSITORY/git/ref/tags/$tag" >/dev/null 2>&1; then
    tagged_sha=$(gh api "repos/$GITHUB_REPOSITORY/commits/$tag" --jq .sha)
    test "$tagged_sha" = "$source_sha"
    target_args=()
  fi
  notes=$(mktemp)
  trap 'rm -f "$notes"' EXIT
  {
    echo "同步上游 Tinycast v${BUILD_VERSION}，保留简体中文界面与拼音搜索。"
    echo "源码：https://github.com/${GITHUB_REPOSITORY}/commit/${source_sha}"
    echo '检查更新指向本仓库；安装包使用 ad-hoc 签名，需手动下载安装。'
    echo '<!-- tinycast:install -->'
    echo '下载与你的 Mac 架构匹配的 DMG，将 Tinycast.app 拖入应用程序文件夹。'
  } > "$notes"
  gh release create "$tag" --repo "$GITHUB_REPOSITORY" "${target_args[@]}" \
    --draft --title "Tinycast ${BUILD_VERSION} · 简体中文版" --notes-file "$notes"
fi
gh release upload "$tag" dist/* --repo "$GITHUB_REPOSITORY" --clobber
gh release edit "$tag" --repo "$GITHUB_REPOSITORY" --draft=false --latest
