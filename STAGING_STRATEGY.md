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

## Implemented Approach: Option 3 (Dedicated Media Branch)

**Status: ✅ IMPLEMENTING** - Using `media` branch for all photo uploads

### Media Branch Implementation:

#### Workflow:
1. **Admin uploads** → `media` branch (all photo commits)
2. **GitHub Actions** → optimize images in `media` branch
3. **Periodic merges** → `media` branch → `main` branch (clean history)
4. **Deployments** → `main` branch only (production)

#### Technical Changes:
- ✅ Created `media` branch for all photo operations
- 🔄 Modify admin interface to target `media` branch
- 🔄 Update GitHub Actions to work with `media` branch
- 🔄 Add merge workflow from `media` to `main`
- 🔄 Configure Cloudflare Pages to deploy from `main` only

#### Benefits:
- 🎯 **Clean main branch** - no photo upload noise
- 🎯 **Isolated media workflow** - all photo operations in `media`
- 🎯 **Controlled deployments** - merge to `main` when ready
- 🎯 **Better git history** - main branch for features, media for content

#### Implementation Phases:
1. **Phase 1: ✅ Branch Setup** - Create and configure `media` branch
2. **Phase 2: 🔄 Admin Targeting** - Update admin to use `media` branch
3. **Phase 3: 🔄 Actions Update** - Configure GitHub Actions for `media`
4. **Phase 4: 🔄 Merge Workflow** - Implement periodic `media` → `main` merges

This approach balances clean git history with immediate deployment needs.