# AutomationExercise Playwright Framework

A Playwright + TypeScript automation framework covering **UI, API, and Hybrid Testing**, with AI-assisted test generation using Cursor.

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
- Allure reporting integration
- AI-assisted test generation using Cursor

## 2. Tech Stack

| Technology | Purpose |
|---|---|
| Playwright | Browser automation and test execution |
| TypeScript | Strong typing and maintainability |
| Node.js | Runtime environment |
| Faker.js | Dynamic test data generation |
| REST API | Backend testing |
| Prettier | Code quality and formatting |
| Cursor | AI-assisted test generation |

## 3. Framework Architecture

The framework follows a layered architecture to separate test logic, browser interactions, API operations, and test data.

### Code Flow

```text
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
          Browser       API Client
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

```text
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
├── .cursor/
│   └── rules/               # Cursor project rules
│
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## 4. Test Coverage

The project documents **8 manual test cases** covering UI, API, and hybrid workflows.

| Test ID | Scenario | Type |
|---|---|---|
| TC-001 | User registration and API verification | Hybrid |
| TC-002 | Valid/invalid login and logout | Hybrid |
| TC-003 | Product search and API comparison | Hybrid |
| TC-004 | Cart operations and price validation | UI |
| TC-005 | Checkout and order confirmation | Hybrid |
| TC-006 | Products API validation | API |
| TC-007 | Brands API validation | API |
| TC-008 | User API and account lifecycle | API |

Detailed test steps and expected results are maintained in `docs/manual-test-cases/`.

## 5. Requirement Traceability

| Requirement | Implementation Location |
|---|---|
| Page Object Model | `src/pages/` |
| Custom fixtures | `src/fixtures/` (pages, API, auth) |
| API client | `src/api/` |
| Test data factories | `src/data/` |
| Utilities | `src/utils/` |
| Environment configuration | `config/env.<ENV>.ts` |
| Browser configuration | `playwright.config.ts` projects |
| Test categorization | `@smoke`, `@regression` in specs |
| Manual test cases | `docs/manual-test-cases/` |
| AI review documentation | `docs/ai-review-log.md` |

## 6. Installation and Setup

### Prerequisites

- Node.js 20.19.0 or newer
- npm
- Git

### Clone Repository

```bash
git clone https://github.com/NidheeSharma/Task_Playwright.git
cd Task_Playwright
```

### Install Dependencies

```bash
npm install
npx playwright install
```

### Configure Environment

Copy the example file and adjust it locally (`.env` is git-ignored):

```bash
cp .env.example .env
```

| Variable | Purpose | Default |
|---|---|---|
| `ENV` | Selects `config/env.<ENV>.ts` (`dev`, `qa`, `prod`) | `qa` |
| `WORKERS` | Optional parallel worker override | 50% locally, 2 in CI |

Run against another environment:

```powershell
# Windows PowerShell
$env:ENV="dev"; npx playwright test --project=chromium
```

### Validate TypeScript

```bash
npx tsc --noEmit
```

## 7. Running Tests

Test execution is performed manually by the user. Cursor AI can generate and review automation code, but it must not launch the Playwright test runner.

### Browsers

Chromium is the primary validated browser baseline. Firefox and WebKit are configured, but their smoke-test stability has not been independently verified.

```bash
# Chromium
npx playwright test --project=chromium
```

### By Test Type and Tag

```bash
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

```bash
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

The framework supports two reporting solutions:

- **Playwright HTML Report:** Provides test execution summaries, failures, screenshots, videos, and traces.
- **Allure Report:** Provides detailed test execution reports, including test status, execution steps, attachments, and failure details.

### 8.1 Playwright HTML Report

The Playwright HTML reporter generates reports in `playwright-report/`.

Open the report using:

```bash
npx playwright show-report
```

Failure evidence includes:

- Screenshots
- Videos
- Execution traces configured with `trace: 'retain-on-failure'`

Open a trace:

```bash
npx playwright show-trace "test-results/<test-folder>/trace.zip"
```

### 8.2 Allure Report Integration

The framework integrates Allure with Playwright using the `allure-playwright` reporter.

Allure results are collected during test execution and stored in `allure-results/`.

The project uses the custom TypeScript script `run-tests.ts` to run tests and generate the Allure HTML report after execution. This allows the report-generation step to run after the test process finishes, including when tests fail, provided the script handles the test process exit code correctly.

#### Installation

Install the required development dependencies if they are not already present:

```bash
npm install --save-dev allure-playwright allure-commandline tsx
```

#### Playwright Reporter Configuration

The Allure reporter is configured in `playwright.config.ts`:

```typescript
['allure-playwright', { resultsDir: 'allure-results' }]
```

#### Test Execution and Automatic Report Generation

Use the project-specific script configured in `package.json` to invoke `run-tests.ts`. Check the actual script name in `package.json`; do not assume a command name that is not defined there.

If the script is invoked directly through `tsx`, the command may be:

```bash
npx tsx run-tests.ts
```

The runner should generate the Allure report after the Playwright process finishes and preserve the test process exit code.

#### Allure Report Commands

```bash
# Generate report manually
npm run allure:generate

# Open generated Allure report
npm run allure:open
```

**Important:** Do not open `allure-report/index.html` directly from File Explorer. Allure reports require a local HTTP server to load their resources correctly.

To open the report from File Explorer, use the provided `open-allure.bat` file.

### 8.3 Report Directory Structure

```text
Task_Playwright/
│
├── allure-results/       # Raw Allure test execution results
├── allure-report/        # Generated Allure HTML report
├── playwright-report/    # Playwright HTML report
├── test-results/         # Screenshots, videos and traces
│
└── run-tests.ts          # Test execution and automatic report generation
```

### 8.4 Reporting Benefits

- Automatic report generation after test execution.
- Report generation even when test cases fail, when handled by the custom runner.
- Detailed test execution status and failure information.
- Centralized screenshots, attachments, and execution evidence.
- Both Playwright HTML and Allure reporting support.
- Reports can be opened locally through a browser.

## 9. AI-Assisted Test Generation

The framework integrates Cursor through project-specific rules stored in `.cursor/rules/`.

These rules guide the AI agent through a standardized workflow for converting manual test cases into Playwright automation code.

The AI agent is responsible for understanding requirements, generating automation code, reviewing implementation quality, and updating documentation. **Test execution is always performed manually by the user.**

### Example Request

```text
@generate

Search for a product and add it to the cart.

1. Open the products page.
2. Search for "top".
3. Verify matching products are displayed.
4. Add the first product to the cart.
5. Verify the cart contains one item.
```

`@generate` is this project's naming convention for an automation request, not a built-in Cursor command.

### AI Configuration

| File | Purpose |
|---|---|
| `.cursor/rules/intake-workflow.mdc` | Workflow from manual case to generated automation code |
| `.cursor/rules/framework-rules.mdc` | Coding standards |
| `.cursor/rules/manual-testcase-template.mdc` | Manual test case template |
| `.cursor/rules/review-checklist.mdc` | Post-generation code review checklist |

### AI Test Generation Workflow

1. **Manual Test Case Intake:** Accepts a test case in plain English or another format.
2. **Test Case Standardization:** Converts the requirement into the project's manual test case template.
3. **Test Classification:** Identifies the test as UI, API, or Hybrid.
4. **Framework Analysis:** Checks existing Page Objects, API clients, fixtures, data factories, and utilities.
5. **Code Generation:** Creates or updates the required Playwright automation files.
6. **Code Review:** Applies the review checklist to verify framework compliance, locator quality, assertions, and test-data handling.
7. **Documentation Update:** Updates the manual test case, traceability information, and AI review log.
8. **Manual Execution Handoff:** Provides the exact command for the user to execute the generated test.

### Manual Review of AI Output

AI-generated test cases and implementation code are reviewed before acceptance.

The review process considers:

- Correctness of test steps and expected results.
- Compliance with existing Page Object Model and fixture conventions.
- Locator reliability and assertion quality.
- Test-data independence and cleanup.
- Static TypeScript validation where applicable.
- Compliance with framework rules and coding standards.

**Test Execution Policy:**

- AI must never execute Playwright tests.
- AI must not run commands that launch the Playwright test runner.
- The user executes all tests manually.
- AI provides the required execution commands.
- AI must not report tests as passed without user confirmation.

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
- AI-generated code reviewed against framework standards before manual execution.

## 11. Known Limitations

- AutomationExercise is a shared public practice website and may occasionally respond slowly or return HTTP 503.
- Chromium is the primary stable browser baseline.
- Firefox and WebKit require additional stability validation.
- GitHub Actions integration is an optional future enhancement.

---

## Project Objective

To build a maintainable Playwright automation framework combining UI, API, hybrid testing, and AI-assisted test generation.
