---
name: intake-workflow
description: When a manual test case is pasted or described, normalise it, generate framework code, review it against the checklist, and update docs. The user runs all tests manually. Always apply this skill in this repo.
---

# Intake workflow (paste a case → reviewed automation code)

Follow this whenever the user pastes or describes a manual test case (any format, even rough). Do not ask where files go. Process several cases **one at a time**.

Read and obey `.claude/skills/framework-rules.md` and `.claude/skills/manual-testcase-template.md`. After generation, apply `.claude/skills/review-checklist.md`.

## Steps (do all applicable generation and review steps)

1. **Normalise and save the case.** Use the template. Path: `docs/manual-test-cases/TC-NNN-<kebab-title>.md` where NNN is the next free number (`TC-001` if none exist). Set `Status: Ready`. If something is ambiguous, make a reasonable assumption, **state it**, and continue. Ask only if truly blocked (missing credential that cannot be generated, unknown product that the live site does not have).
2. **Classify** as UI, API, or Hybrid. Spec lives in `tests/ui/`, `tests/api/`, or `tests/hybrid/` respectively. One TC per spec file.
3. **Inventory** existing page objects, API methods, fixtures, factories, utils, and constants. List gaps before writing code.
4. **Verify on the live site** any locator, message text, URL path, or endpoint you do not already have in the repo. Use Playwright codegen, the browser tool, or a documented API call. **Never invent.**
5. **Close gaps** in pages, API clients, fixtures, data factories, and utils. Follow framework-rules. Do not put selectors or URLs in specs.
6. **Write the spec.** Import `test, expect` from `src/fixtures`. Title: `'Type | Description | TC-NNN'`. Tags via `{ tag: [...] }`. `test.step` per manual step group. `expect` per expected result. At least two meaningful assertions.
7. **Do not execute tests.** Never run `npx playwright test`, `npm test`, `npm run test`, or any command/script that starts the Playwright test runner. The user always runs tests manually. You may inspect package scripts and run lint/typecheck only when you have confirmed they are static-only and do not trigger tests; otherwise, provide those commands for the user to run.
8. **Review the generated code.** Apply `.claude/skills/review-checklist.md` as a static review. Check framework compliance, reuse, selectors, assertions, tags, test independence, typing, data handling, and documentation. Fix issues you can resolve without executing tests. Report anything that cannot be verified without a manual run.
9. **Update docs.** Set `Automated: Yes` when the spec has been generated and add the `Spec:` path. Keep `Status: Ready` until the user confirms a successful manual run; only then may it become `Automated`. Update the traceability row in `docs/manual-test-cases/README.md`. Append mistakes and fixes to `docs/ai-review-log.md`.
10. **Reply** with a short summary: files created/changed, assumptions, review findings, and the exact command for the user to run manually. State clearly that execution has not been performed and do not report test results unless the user has supplied them.

## Test execution policy

- The user is responsible for running every test manually.
- Never launch Playwright tests, including through npm scripts, shell commands, IDE tasks, or other indirect means.
- Never retry or rerun tests to investigate failures; ask the user to share the result or failure output.
- Do not mark a test as passed, green, or `Automated` based on generated code or static review.
- Always provide the exact manual run command for the generated spec.

## Out of scope

Do not start this workflow for unrelated questions (how to run tests, config tweaks) unless a case is being added or changed.
