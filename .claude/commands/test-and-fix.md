---
description: Run tests and fix any failures
---

# Run Tests
!`npm test 2>&1 || echo "Tests completed"`

# TypeScript Check
!`npm run typecheck 2>&1 || echo "Type check completed"`

# Lint
!`npm run lint 2>&1 || echo "Lint completed"`

Based on the results above:
1. Identify any failing tests or errors
2. Fix each issue
3. Re-run tests to verify fixes
4. Report final status

Only mark as complete when ALL checks pass.