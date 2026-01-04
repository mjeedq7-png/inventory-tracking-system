---
description: Generate development progress report
---

# Recent Commits
!`git log --oneline -10 2>/dev/null || echo "no git history"`

# Current Branch
!`git branch --show-current`

# Changed Files Today
!`git diff --stat HEAD~5 2>/dev/null || echo "no recent changes"`

Generate a brief progress report including:
1. Features completed
2. Current work in progress
3. Blockers or issues
4. Next steps

Format in Arabic if preferred.