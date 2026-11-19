#!/usr/bin/env bash
# ==============================================================================
# Reborn - Git Push & Multi-Branch Workflow Helper
#
# Supports:
#   1. Conventional atomic commits on the active branch
#   2. Promoting and pushing across: development -> release -> production
#   3. Automatic remote origin tracking for https://github.com/ManamiMayoki/reborn.git
# ==============================================================================

set -e

REMOTE_URL="https://github.com/ManamiMayoki/reborn.git"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "=========================================================="
echo "  🧬 REBORN GIT & BRANCH WORKFLOW HELPER"
echo "  Target Remote: $REMOTE_URL"
echo "  Current Branch: $CURRENT_BRANCH"
echo "=========================================================="

# Ensure remote is correctly set
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "-> Adding remote origin: $REMOTE_URL"
  git remote add origin "$REMOTE_URL"
else
  git remote set-url origin "$REMOTE_URL"
fi

# Usage display if no args provided
if [ -z "$1" ]; then
  echo ""
  echo "Usage:"
  echo "  ./scripts/push-update.sh \"<commit message>\"                 # Commit & push current branch"
  echo "  ./scripts/push-update.sh --sync-all \"<release message>\"     # Promote development -> release & production"
  echo "  ./scripts/push-update.sh --push-all                         # Push all 3 branches (dev, release, prod)"
  echo ""
  echo "Examples:"
  echo "  ./scripts/push-update.sh \"feat(docking): add interactive 3D search cage and pose metrics\""
  echo "  ./scripts/push-update.sh --sync-all \"chore(release): promote v1.0.0 to release and production\""
  exit 1
fi

# Mode: Push all branches
if [ "$1" == "--push-all" ]; then
  echo "-> Pushing development branch..."
  git push -u origin development || true
  echo "-> Pushing release branch..."
  git push -u origin release || true
  echo "-> Pushing production branch..."
  git push -u origin production || true
  echo ""
  echo " Push-all attempt complete."
  exit 0
fi

# Mode: Sync and promote across all 3 branches
if [ "$1" == "--sync-all" ]; then
  MSG="${2:-chore: promote updates across development, release, and production}"
  
  echo "-> Staging and committing on $CURRENT_BRANCH..."
  git add -A
  if ! git diff-index --quiet HEAD --; then
    git commit -m "$MSG"
  fi

  echo "-> Syncing into 'release' branch..."
  git checkout release
  git merge development -m "merge: sync development into release branch"
  
  echo "-> Syncing into 'production' branch..."
  git checkout production
  git merge release -m "merge: sync release into production branch"

  echo "-> Returning to development branch..."
  git checkout development

  echo ""
  echo " Successfully synchronized code across development, release, and production!"
  echo "Run './scripts/push-update.sh --push-all' when ready to push all branches."
  exit 0
fi

# Standard Mode: Single commit & push
COMMIT_MSG="$1"

echo "-> Staging changes..."
git add -A

if git diff-index --quiet HEAD --; then
  echo "No changes detected to commit. Working tree clean."
else
  echo "-> Committing changes: \"$COMMIT_MSG\""
  git commit -m "$COMMIT_MSG"
fi

echo "-> Pushing to origin/$CURRENT_BRANCH..."
if git push -u origin "$CURRENT_BRANCH"; then
  echo ""
  echo " Successfully committed and pushed to origin/$CURRENT_BRANCH!"
else
  echo ""
  echo " Notice: If GitHub reports 'Repository not found' or authentication required,"
  echo " ensure that:"
  echo "   1. The repository https://github.com/ManamiMayoki/reborn exists on your GitHub account."
  echo "   2. You are authenticated (e.g. run 'gh auth login' or configure your Personal Access Token / SSH key)."
fi
echo "=========================================================="
