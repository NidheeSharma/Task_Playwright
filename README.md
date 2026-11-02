# AutomationExercise Playwright Framework

A Playwright + TypeScript automation framework covering **UI, API, and Hybrid Testing**, with AI-assisted test generation using Cursor and Claude Code.

[!\[Playwright\](https://img.shields.io/badge/Playwright-Automation-2EAD33?logo=playwright)](https://playwright.dev/) [!TypeScript]

**Application Under Test:** [AutomationExercise](https://www.automationexercise.com/)

---

## 1. Project Overview

This project implements a reusable test automation framework using Playwright and TypeScript.

### Testing Coverage

- **UI Testing:** Validates end-to-end browser workflows.
- **API Testing:** Validates REST API endpoints and responses.
- **Hybrid Testing:** Combines API and UI operations to validate business workflows.

### Key Features

- Page Object Model (POM)
- Custom Playwright fixtures
- Centralized API client with typed responses
- Reusable test data factory using Faker
- Multi-environment configuration
- Multi-browser project configuration
- Parallel test execution
- HTML reporting with failure evidence
- AI-assisted test generation using Cursor and Claude Code

## 2. Tech Stack

| Technology           | Purpose                               |
| -------------------- | ------------------------------------- |
| Playwright           | Browser automation and test execution |
| TypeScript           | Strong typing and maintainability     |
| Node.js              | Runtime environment                   |
| Faker.js             | Dynamic test data generation          |
| REST API             | Backend testing                       |
| ESLint / Prettier    | Code quality and formatting           |
| Cursor / Claude Code | AI-assisted test generation           |

## 3. Framework Architecture

The framework follows a layered architecture to separate test logic, browser interactions, API operations, and test data.

### Code Flow

text

```
             Manual Test Cases
                    |
                    v
             Playwright Specs
                    |
                    v
             Custom Fixtures
                    |
             +------+------+
             |             |
             v             v
         Page Objects   API Classes
             |             |
             v             v
          Browser      API Client
             |             |
             +------+------+
                    |
                    v
                Assertions
                    |
                    v
             Fixture Teardown

```

### Folder Structure

text

```
Task_Playwright/
│
├── config/                  # Environment configurations
├── docs/
│   ├── manual-test-cases/   # Manual cases and traceability
│   └── ai-review-log.md     # AI review observations
│
├── src/
│   ├── api/                 # API client and endpoint classes
│   ├── data/                # Test data factories and constants
│   ├── fixtures/            # Custom Playwright fixtures
│   ├── pages/               # Page Object Model classes
│   └── utils/               # Helpers, logger and validators
│
├── tests/
│   ├── api/                 # API test specifications
│   ├── hybrid/              # Combined UI and API tests
│   └── ui/                  # UI test specifications
│
├── .claude/                 # Claude Code skills
├── .cursor/                 # Cursor rules
│
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation

```

## 4. Test Coverage

The project documents **8 manual test cases** covering UI, API, and hybrid workflows.

| Test ID | Scenario                               | Type   |
| ------- | -------------------------------------- | ------ |
| TC-001  | User registration and API verification | Hybrid |
| TC-002  | Valid/invalid login and logout         | Hybrid |
| TC-003  | Product search and API comparison      | Hybrid |
| TC-004  | Cart operations and price validation   | UI     |
| TC-005  | Checkout and order confirmation        | Hybrid |
| TC-006  | Products API validation                | API    |
| TC-007  | Brands API validation                  | API    |
| TC-008  | User API and account lifecycle         | API    |

Detailed test steps and expected results are maintained in `docs/manual-test-cases/`.

## 5. Requirement Traceability

| Requirement               | Implementation Location            |
| ------------------------- | ---------------------------------- |
| Page Object Model         | `src/pages/`                       |
| Custom fixtures           | `src/fixtures/` (pages, API, auth) |
| API client                | `src/api/`                         |
| Test data factories       | `src/data/`                        |
| Utilities                 | `src/utils/`                       |
| Environment configuration | `config/env.<ENV>.ts`              |
| Browser configuration     | `playwright.config.ts` projects    |
| Test categorization       | `@smoke`, `@regression` in specs   |
| Manual test cases         | `docs/manual-test-cases/`          |
| AI review documentation   | `docs/ai-review-log.md`            |

## 6. Installation and Setup

### Prerequisites

- Node.js 20.19.0 or newer
- npm
- Git

### Clone Repository

bash

```
git clone https://github.com/NidheeSharma/Task_Playwright.git
cd Task_Playwright

```

### Install Dependencies

bash

```
npm install
npx playwright install

```

### Configure Environment

Copy the example file and adjust it locally (`.env` is git-ignored):

bash

```
cp .env.example .env

```

| Variable  | Purpose                                             | Default              |
| --------- | --------------------------------------------------- | -------------------- |
| `ENV`     | Selects `config/env.<ENV>.ts` (`dev`, `qa`, `prod`) | `qa`                 |
| `WORKERS` | Optional parallel worker override                   | 50% locally, 2 in CI |

Run against another environment:

bash

```
# macOS / Linux / Git Bash
ENV=dev npx playwright test --project=chromium

# Windows PowerShell
$env:ENV="dev"; npx playwright test --project=chromium

```

### Validate TypeScript

bash

```
npx tsc --noEmit

```

## 7. Running Tests

### Browsers

Chromium is the primary validated browser baseline. Firefox and WebKit are configured, but their smoke-test stability has not been independently verified.

bash

```
# Chromium
npx playwright test --project=chromium

# Firefox smoke tests
npx playwright test --project=firefox --grep "@smoke"

# WebKit smoke tests
npx playwright test --project=webkit --grep "@smoke"

```

### By Test Type and Tag

bash

```
# UI tests
npx playwright test tests/ui --project=chromium

# API tests
npx playwright test tests/api --project=api

# Hybrid tests
npx playwright test tests/hybrid --project=chromium

# Smoke tests
npx playwright test --grep "@smoke"

# Regression tests
npx playwright test --grep "@regression"

```

### Additional Execution Options

bash

```
# Run a specific test case
npx playwright test -g "TC-004"

# Run in headed mode
npx playwright test --headed

# Run Playwright UI mode
npx playwright test --ui

# Run in debug mode
npx playwright test --debug

# Repeat tests three times
npx playwright test --repeat-each=3

# List discovered tests without executing them
npx playwright test --list

```

## 8. Reporting and Debugging

The framework uses the Playwright HTML reporter. The report is written to `playwright-report/`.

bash

```
npx playwright show-report

```

Failure evidence includes:

- Screenshots
- Videos
- Execution traces configured with `trace: 'retain-on-failure'`

Open a trace:

bash

```
npx playwright show-trace test-results/<test-folder>/trace.zip

```

## 9. AI-Assisted Test Generation

The framework integrates Cursor and Claude Code through project-specific instructions, skills, and rules.

In Cursor or Claude Code, paste or describe a manual test case. The rules in `CLAUDE.md` and `.cursor/rules/` tell the agent to follow the intake workflow (case file, code, run, docs). `@generate` is just this project's naming convention for such a request, not a built-in command.

### Example Request

text

```
@generate

Search for a product and add it to the cart.

1. Open the products page.
2. Search for "top".
3. Verify matching products are displayed.
4. Add the first product to the cart.
5. Verify the cart contains one item.

```

### AI Configuration

| File                                         | Purpose                                  |
| -------------------------------------------- | ---------------------------------------- |
| `CLAUDE.md`                                  | Claude Code project instructions         |
| `.claude/skills/intake-workflow.md`          | Workflow from manual case to tested code |
| `.claude/skills/framework-rules.md`          | Coding standards                         |
| `.claude/skills/manual-testcase-template.md` | Manual test case template                |
| `.claude/skills/review-checklist.md`         | Post-generation review checklist         |
| `.cursor/rules/*.mdc`                        | Cursor mirrors of the same rules         |

### Manual Review of AI Output

AI-generated test cases and implementation code are reviewed before acceptance.

The review process considers:

- Correctness of test steps and expected results.
- Compliance with existing Page Object Model and fixture conventions.
- Locator reliability and assertion quality.
- Test-data independence and cleanup.
- TypeScript validation and successful test execution.

Review observations and improvement notes are maintained in `docs/ai-review-log.md`.

AI-generated code is treated as a starting point, not automatically accepted as production-ready test code.

## 10. Design Principles

- Separation of UI, API, data, and test logic.
- Reusable Page Objects and fixtures.
- Unique test data for independent execution.
- API-based test data setup and cleanup.
- Explicit waits instead of fixed sleeps.
- Safe retries for read-only API requests.
- Manual test cases maintained as the source of truth.
- AI-generated code reviewed and validated before acceptance.

## 11. Known Limitations

- AutomationExercise is a shared public practice website and may occasionally respond slowly or return HTTP 503.
- Chromium is the primary stable browser baseline.
- Firefox and WebKit require additional stability validation.
- GitHub Actions integration is an optional future enhancement.

---

## Project Objective

To build a maintainable Playwright automation framework combining UI, API, hybrid testing, and AI-assisted test generation.

**Author:** Nidhee Sharma