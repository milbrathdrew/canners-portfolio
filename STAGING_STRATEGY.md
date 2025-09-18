# Staging Strategy for Commit Spam Reduction

## Current Issue
Every photo upload creates multiple commits in the main branch:
1. Image upload commit
2. Portfolio.json update commit
3. Optimized images commit (from GitHub Actions)

This creates "spam" in the main branch history.

## Proposed Solution: Staging Branch Workflow

### Option 1: Staging Branch with Periodic Merges
```
uploads → staging branch → batch merge to main (daily/weekly)
```

**Pros:**
- Clean main branch history
- Batched optimizations
- Better for production deployments

**Cons:**
- More complex workflow
- Delayed live updates
- Need dual deployments (staging + production)

### Option 2: Squash Commits on Upload
```
uploads → main branch → squash related commits automatically
```

**Pros:**
- Immediate live updates
- Simpler workflow
- Single commit per upload session

**Cons:**
- Still some commit noise
- Complex squashing logic

### Option 3: Dedicated Media Branch
```
uploads → media branch → GitHub Actions → deploy to main
```

**Pros:**
- Separate media workflow
- Clean main branch
- Automated deployments

**Cons:**
- Complex branch management
- Potential merge conflicts

## Approach: Direct Main Branch Uploads

**Status: ✅ ACTIVE** - Using `main` branch for all uploads (simplified approach)

### Simplified Direct Upload:

#### Workflow:
1. **Admin uploads** → `main` branch (direct to production)
2. **GitHub Actions** → optimize images automatically
3. **Deployments** → automatic via Cloudflare Pages

#### Benefits:
- 🎯 **Simple workflow** - no branch management complexity
- 🎯 **Immediate deployment** - changes go live automatically
- 🎯 **Single source of truth** - main branch is always current
- 🎯 **No merge conflicts** - eliminates staging branch issues

#### Implementation:
- ✅ Admin interface targets main branch
- ✅ GitHub Actions process main branch only
- ✅ Direct deployment to production
- ✅ Simplified user experience

This approach balances clean git history with immediate deployment needs.