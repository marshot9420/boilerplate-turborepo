---
name: review-code
description: Review changed code for project convention, type safety, layering, and missing tests.
---

# Review Code

Review the current diff.

Check:

- Does it follow dependency direction?
- Is business logic in the right layer?
- Are DTOs mapped in domain?
- Are repositories returning DB models, not response DTOs?
- Are Server Actions thin?
- Are tests updated?
- Are Storybook stories needed?
- Are docs affected?
- Is there unnecessary abstraction?

Return concrete findings only.
