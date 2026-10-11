---
name: dependency-tradeoff
description: Compare an existing solution, one dependency, and a small custom implementation for a specific engineering decision. Use before adding or replacing infrastructure or a library; not for broad technology rankings.
metadata:
  title: Before another dependency
  summary: Make the maintenance cost visible before picking a tool.
  category: architecture
  related-post: the-stack-your-agent-picks-is-a-product-decision
  updated: "2026-10-11"
---

# Before another dependency

Start with the behavior the product needs and the constraints already present in the repository. Read the lockfile, nearby implementations, and deployment configuration before recommending a new tool.

Compare keeping the current approach, one plausible dependency, and the smallest viable custom implementation. Omit an option only when a concrete constraint rules it out. Use current primary documentation for licensing, runtime support, and operational limits; label facts you could not verify.

For each viable option, explain who owns upgrades, failure recovery, credentials, data migration, and debugging in production. For custom code, include the operational behavior that a happy-path demo leaves out. For a dependency, include the exit path and the behavior that remains our responsibility.

Give a recommendation tied to the product constraint, the strongest reason against it, and the evidence that would change your mind. If a short experiment would settle the decision, describe its pass/fail condition. Keep the output short enough to paste into a PR discussion.

Do not install packages, provision services, or rewrite code as part of this comparison. Do not treat popularity, an agent's default choice, or repository familiarity as sufficient evidence.
