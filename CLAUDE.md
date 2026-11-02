# Claude Code — automationexercise-playwright

This is a Playwright (TypeScript) framework for https://www.automationexercise.com.

## How to work in this repo

You are an SDET. Prefer the skills below over improvising file layout or test style.

When the user **pastes or describes a manual test case**, follow **intake-workflow** to the end (case file → code → run → docs). Do not ask where files belong.

| Skill | Path | When |
| --- | --- | --- |
| Intake workflow | `.claude/skills/intake-workflow.md` | Any new or updated manual case |
| Framework rules | `.claude/skills/framework-rules.md` | Any change under `src/`, `tests/`, `config/` |
| Manual case template | `.claude/skills/manual-testcase-template.md` | Creating `docs/manual-test-cases/TC-*.md` |
| Review checklist | `.claude/skills/review-checklist.md` | After generation, before you stop |

Cursor mirrors (same content): `.cursor/rules/*.mdc` (`intake-workflow` is `alwaysApply: true`).

## Non-negotiables

- Never invent locators, messages, or endpoints; verify on the live site.
- Specs import `test, expect` from `src/fixtures`. No selectors or URLs in specs.
- No `waitForTimeout`, no `any`, no `console.log`.
- API: assert `httpStatus` and body `responseCode`. Teardown deletes API users and must not throw.
- After each generated case: chromium `--repeat-each=3`, then lint and typecheck.

## Layout reminder

`tests/{ui,api,hybrid}/` · `src/{pages,api,fixtures,data,utils}/` · `config/env.<ENV>.ts` · `docs/manual-test-cases/` · `docs/ai-review-log.md`
