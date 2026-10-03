#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
    echo 'Usage: ./Scripts/prepare-upstream-cn.sh <upstream-tag> [new-cn-branch]' >&2
    exit 2
fi
upstream_tag=$1
new_branch=${2:-cn-localization-$upstream_tag}
git check-ref-format "refs/tags/$upstream_tag"
git check-ref-format --branch "$new_branch" >/dev/null
if [ -n "$(git status --porcelain)" ]; then
    echo 'Commit or stash local changes before preparing an upstream update.' >&2
    exit 1
fi
if git show-ref --verify --quiet "refs/heads/$new_branch"; then
    echo 'The requested local branch already exists; choose a new branch name.' >&2
    exit 1
fi
upstream_url=https://github.com/abue-ammar/tinycast.git
if git remote get-url upstream >/dev/null 2>&1; then
    test "$(git remote get-url upstream)" = "$upstream_url" || {
        echo 'The upstream remote points elsewhere; check its URL before continuing.' >&2
        exit 1
    }
else
    git remote add upstream "$upstream_url"
fi
git fetch upstream "refs/tags/$upstream_tag"
upstream_commit=$(git rev-parse 'FETCH_HEAD^{commit}')
starting_commit=$(git rev-parse HEAD)
git switch -c "$new_branch"
merge_status=0
git merge --no-ff --no-commit "$upstream_commit" || merge_status=$?
if [ "$merge_status" -gt 1 ]; then exit "$merge_status"; fi

# The fork's manual-only build replaces upstream publishing, signing and announcement automation.
git restore --source="$starting_commit" --staged --worktree -- .github/workflows/release.yml
if [ -n "$(git diff --name-only --diff-filter=U)" ]; then
    echo 'Resolve the remaining source/translation conflicts, then continue the checklist in docs/localization-cn.md.'
    git diff --name-only --diff-filter=U
    exit 1
fi
if ! git rev-parse --verify MERGE_HEAD >/dev/null 2>&1; then
    echo 'This upstream tag is already contained in the Chinese branch; no merge is pending.'
    exit 0
fi
xcodegen generate
status=0
./Scripts/check-localization.sh || status=$?
node Scripts/check-settings-search.js || status=$?
{
    echo "Prepared $new_branch from upstream tag $upstream_tag ($upstream_commit)."
    echo 'Translate any missing keys; record the upstream tag/SHA and update the manual workflow version.'
    echo 'Review and commit the pending merge. Compilation remains manual and requires confirmation.'
}
exit "$status"
