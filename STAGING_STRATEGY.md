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

## Recommended Approach: Option 2 (Squash Commits)

### Implementation Plan:
1. **Modify admin interface** to collect multiple uploads before committing
2. **Batch uploads** - allow multiple photos in single session
3. **Single commit** for entire upload session
4. **GitHub Actions** creates optimized images in same workflow
5. **Amend commit** to include optimized images (avoiding separate commit)

### Technical Changes:
- Add "staging area" in admin interface for multiple photos
- Modify GitHub Actions to amend original commit instead of creating new one
- Update commit messages to be more descriptive
- Add upload session tracking

### Benefits:
- 1 commit per upload session instead of 3+ commits per photo
- Maintains immediate live updates
- Cleaner git history
- Better for code reviews

## Implementation Priority:
1. **Phase 1:** Batch upload functionality (multiple photos per session)
2. **Phase 2:** Commit squashing logic
3. **Phase 3:** GitHub Actions integration to amend commits

This approach balances clean git history with immediate deployment needs.