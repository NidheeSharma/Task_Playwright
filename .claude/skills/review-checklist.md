---
name: review-checklist
description: Human/agent review checklist after generating a test from a manual case. Use after intake-workflow generation.
---

# Review checklist (after generation)

Complete this static review before handing the generated code to the user. Fix issues you can resolve without executing tests; do not tick a box that is not true.

## Case and traceability

- [ ] `docs/manual-test-cases/TC-NNN-*.md` exists; `Automated: Yes` means the spec was generated, and `Status: Ready` remains until the user confirms a successful manual run
- [ ] README traceability row added
- [ ] Title, tags, and TC id match the spec

## Live site (not invented)

- [ ] Every new locator, message, path, and endpoint was verified on automationexercise.com
- [ ] `data-qa` used via `getByTestId` where present
- [ ] Ads handled (`dismissAds`) on click-heavy UI flows
- [ ] API asserts `httpStatus` **and** `responseCode`; form-urlencoded

## Spec quality

- [ ] `import { test, expect } from '../../src/fixtures'` (path adjusted)
- [ ] No selectors, URLs, `waitForTimeout`, `any`, or `console.log` in the spec
- [ ] `test.step` per manual step group; 2+ meaningful assertions
- [ ] Parallel-safe unique data; API user deleted in teardown that cannot throw

## Static review and handoff

- [ ] Review the generated code against the framework rules; fix issues that can be identified without running tests
- [ ] Check that assertions reflect the expected results and have not been weakened
- [ ] Check that no unsupported `test.fixme` was added to hide an unverified failure
- [ ] Inspect package scripts before considering lint/typecheck; run them only if confirmed to be static-only and not to launch tests. Otherwise, give the user the commands to run
- [ ] Agent mistakes appended to `docs/ai-review-log.md`
- [ ] Exact manual test command provided to the user
- [ ] Clearly state that tests have not been executed by the AI

## Manual execution policy

- The user executes all tests manually.
- Never run `npx playwright test`, `npm test`, `npm run test`, or any equivalent command that launches the Playwright test runner.
- Do not retry, rerun, or claim a test passed/failed/green unless the user shares the result.
- After the user confirms a successful manual run, the case status may be changed from `Ready` to `Automated`.
