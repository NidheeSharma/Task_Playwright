---
name: manual-testcase-template
description: Template and field rules for docs/manual-test-cases/TC-NNN-*.md. Use when creating or updating a manual case.
---

# Manual test case template

Save as `docs/manual-test-cases/TC-NNN-<kebab-title>.md`. Copy the block below. Fill every field; use `N/A` only when a section truly does not apply.

```markdown
# TC-NNN Title in Title Case

| Field | Value |
| --- | --- |
| ID | TC-NNN |
| Status | Ready |
| Type | UI \| API \| Hybrid |
| Priority | P1 \| P2 \| P3 |
| Tags | @regression @ui @smoke |
| Automated | No |
| Spec | |
| Site | https://www.automationexercise.com |

## Preconditions
- …

## Test data
| Name | Value / source |
| --- | --- |
| user | factory.createUser() |

## Steps
1. …
2. …

## Expected results
1. …
2. …

## Cleanup
- Delete API-created accounts; leave shared catalogue untouched.

## Automation notes
- Classification rationale:
- Live-site checks:
- Assumptions:
```

## Field rules

- **Status:** Draft → Ready → Automated (after green run) or Blocked.
- **Type:** UI = browser only; API = `/api` only; Hybrid = both in one TC.
- **Tags:** must match spec `{ tag: [...] }`.
- **Automated / Spec:** set together when the spec exists (`tests/<type>/tc-NNN-<kebab>.spec.ts`).
- **Steps** and **Expected results** are 1:1 numbered. Each expected result becomes an `expect` (or a tight group of expects) inside a `test.step`.
- **Cleanup:** API delete in fixture teardown, not a manual “log out and hope”.
