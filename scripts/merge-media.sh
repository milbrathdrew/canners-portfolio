#!/bin/bash
# Merge Media Branch to Main
# This script merges photo updates from media branch to main for deployment

set -e

echo "🔄 Merging media branch content to main..."
echo "=========================================="

# Ensure we're on main branch
git checkout main

# Get latest changes
git pull origin main

# Check if media branch has new commits
MEDIA_COMMITS=$(git log main..origin/media --oneline 2>/dev/null | wc -l)

if [ "$MEDIA_COMMITS" -eq 0 ]; then
    echo "✅ No new commits in media branch to merge"
    exit 0
fi

echo "📸 Found $MEDIA_COMMITS new commits in media branch"

# Merge media branch with a clean commit message
git merge origin/media --no-ff -m "📸 Merge photo updates from media branch

- Added $MEDIA_COMMITS new photo commits
- Includes optimized images and portfolio updates
- Maintains clean main branch history

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push the merge to main
git push origin main

echo ""
echo "✅ Successfully merged media branch to main!"
echo "🚀 Changes will deploy automatically via Cloudflare Pages"
echo ""
echo "📊 Summary:"
echo "   - Merged: $MEDIA_COMMITS commits from media branch"
echo "   - Target: main branch (production)"
echo "   - Status: Deployed"
echo ""