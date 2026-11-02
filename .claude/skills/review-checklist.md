---
name: review-checklist
description: Human/agent review checklist after generating a test from a manual case. Use after intake-workflow generation.
---

# Review checklist (after generation)

Run this before telling the user the case is done. Fix failures; do not tick a box that is not true.

## Case and traceability

- [ ] `docs/manual-test-cases/TC-NNN-*.md` exists, Status/Automated/Spec are correct
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

## Execution

- [ ] `npx playwright test <spec> --project=chromium --repeat-each=3` passed
- [ ] Failures fixed at root cause (assertions not weakened)
- [ ] `npm run lint` and `npm run typecheck` passed
- [ ] Flakes quarantined with `test.fixme` + reason, or not present
- [ ] Agent mistakes appended to `docs/ai-review-log.md`
