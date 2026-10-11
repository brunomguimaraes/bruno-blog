---
name: alert-to-runbook
description: Turn one production alert and supplied system context into a short, evidence-based runbook. Use when an alert lacks useful first checks; not for a complete incident response policy.
metadata:
  title: An alert worth waking up for
  summary: Turn one noisy alert into a usable first-response note.
  category: operations
  related-post: calm-oncall
  updated: "2026-10-11"
---

# An alert worth waking up for

Read the alert expression, its evaluation window, and the system context supplied by the user. Separate the observed symptom from the suspected cause. If customer impact is unknown, say so instead of inventing it.

Write a compact runbook that contains:

- What fired, which service or tenant is affected, and what evidence establishes impact.
- The first two read-only checks, using real dashboard links or commands from the repository. Explain what each result would distinguish.
- A recovery action only when the repository or supplied operational notes support it, including its risk and a verification step. Otherwise name the missing information and the known escalation route.

Flag an alert that routinely resolves before intervention. Suggest a specific signal or window to investigate, without changing thresholds or declaring a safe value from insufficient history. Keep placeholders visibly unresolved; never fabricate dashboard URLs, owners, or production commands.

End with the one place the runbook should be linked from the alert configuration. Creating the note does not authorize executing recovery commands or changing monitoring.
