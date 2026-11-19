#!/usr/bin/env bash
# ==============================================================================
# Reborn - Git Push Helper Script
# Stages, creates an atomic conventional commit, and pushes to current branch.
# Supports 3-branch workflow: development -> release -> production
# ==============================================================================

set -e

# Determine current active branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "=========================================================="
echo "  REBORN GIT WORKFLOW HELPER"
echo "  Active Branch: $CURRENT_BRANCH"
echo "=========================================================="

# Ensure commit message is provided
COMMIT_MSG="$1"

if [ -z "$COMMIT_MSG" ]; then
  echo ""
  echo "Usage: ./scripts/push-update.sh \"<commit message>\""
  echo ""
  echo "Examples:"
  echo "  ./scripts/push-update.sh \"feat(docking): add interactive 3D search cage and pose metrics\""
  echo "  ./scripts/push-update.sh \"fix(admet): refine Lipinski Rule of 5 violation calculator\""
  echo "  ./scripts/push-update.sh \"docs: update architecture diagram and 3-branch workflow guide\""
  exit 1
fi

# Stage all tracked and new changes
echo "-> Staging changes..."
git add -A

# Check if there is anything to commit
if git diff-index --quiet HEAD --; then
  echo "No changes detected to commit. Working tree clean."
  exit 0
fi

# Commit with provided message
echo "-> Committing changes with message: \"$COMMIT_MSG\""
git commit -m "$COMMIT_MSG"

# Push to origin current branch
echo "-> Pushing to origin/$CURRENT_BRANCH..."
git push origin "$CURRENT_BRANCH"

echo ""
echo " Successfully committed and pushed to origin/$CURRENT_BRANCH!"
echo "=========================================================="
