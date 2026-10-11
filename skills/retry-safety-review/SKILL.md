---
name: retry-safety-review
description: Review one retrying operation for duplicate side effects, ambiguous timeouts, and unsafe retries. Use for a webhook handler, queue consumer, scheduled job, or agent tool call; not for a general code review.
metadata:
  title: Retry safety review
  summary: Find what happens when the same operation runs twice.
  category: reliability
  related-post: the-bug-is-in-the-harness-not-the-model
  updated: "2026-10-11"
---

# Retry safety review

Trace one operation from its entry point to its durable side effect. Identify who can retry it: the caller, HTTP client, queue, worker, or scheduler. Read the actual configuration; do not assume a library's defaults.

Walk through three cases against the code:

- The side effect succeeds but its acknowledgement is lost.
- Two deliveries with the same identity overlap.
- The process stops between the side effect and recording completion.

For each case, name the persisted state, the next attempt's behavior, and whether the result can be duplicated or lost. A check followed by a write is not atomic deduplication. A random key created on every attempt is not a stable operation identity. Consider retention: deduplication must outlast the possible redelivery window.

Return a small table of failure case, code evidence, and consequence. If there is an unsafe path, propose the smallest change and one test that reproduces the duplicate or lost result. Identify the transaction boundary explicitly; a database transaction cannot roll back a remote API call.

Do not add retries indiscriminately or claim exactly-once execution without evidence. If the remote service's idempotency contract is unknown, mark that dependency as unresolved. Review only; implement changes when requested.
