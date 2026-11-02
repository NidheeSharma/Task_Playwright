
# AutomationExercise Playwright Framework

A Playwright + TypeScript automation framework covering **UI, API, and Hybrid Testing**, with AI-assisted test generation using Cursor and Claude Code.

[![Playwright](https://img.shields.io/badge/Playwright-Automation-2EAD33?logo=playwright)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)]

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
- AI-assisted test generation

## 2. Tech Stack

| Technology | Purpose |
|---|---|
| Playwright | Browser automation and test execution |
| TypeScript | Strong typing and maintainability |
| Node.js | Runtime environment |
| Faker.js | Dynamic test data generation |
| REST API | Backend testing |
| ESLint / Prettier | Code quality and formatting |
| Cursor / Claude Code | AI-assisted test generation |

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
├── .claude/                 # Claude Code skills
├── .cursor/                 # Cursor rules
│
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## 4. Test Coverage

The framework automates **8 manual test cases as 12 Playwright tests**.

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

Detailed test steps and expected results are available in `docs/manual-test-cases/`.

## 5. Installation and Setup

### Prerequisites

- Node.js 18 or newer
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

The framework supports:

- `dev`
- `qa` (default)
- `prod`

Configure the required environment variables in your local `.env` file.

### Validate TypeScript

```bash
npx tsc --noEmit
```

## 6. Running Tests

### Run All Chromium Tests

```bash
npx playwright test --project=chromium
```

### Run API Tests

```bash
npx playwright test tests/api --project=api
```

### Run Smoke Tests

```bash
npx playwright test --grep "@smoke"
```

### Run a Specific Test Case

```bash
npx playwright test -g "TC-004"
```

### Run in Headed Mode

```bash
npx playwright test --headed
```

### Run Playwright UI Mode

```bash
npx playwright test --ui
```

### Run in Debug Mode

```bash
npx playwright test --debug
```

### Repeat Tests

```bash
npx playwright test --repeat-each=3
```

## 7. Reporting and Debugging

The framework uses the Playwright HTML reporter.

Open the report:

```bash
npx playwright show-report
```

Failure evidence includes:

- Screenshots
- Videos
- Execution traces

View a trace:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

Sensitive information is redacted from API logs.

## 8. AI-Assisted Test Generation

The framework integrates Cursor and Claude Code through skill and rule files.

A single `@generate` request with manual test steps guides the AI agent to:

1. Create a manual test case.
2. Identify required Page Objects or API methods.
3. Generate the Playwright specification.
4. Follow existing framework conventions.
5. Run validation and update documentation.

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

Generated code is reviewed and validated before acceptance.

### AI Configuration

| File | Purpose |
|---|---|
| `.claude/skills/add-test-case.md` | Test generation workflow |
| `.claude/skills/automationexercise-framework-rules.md` | Framework coding standards |
| `.cursor/rules/add-test-case.mdc` | Cursor generation trigger |
| `CLAUDE.md` | Claude Code project instructions |

## 9. Design Principles

- Separation of UI, API, data, and test logic.
- Reusable Page Objects and fixtures.
- Unique test data for independent execution.
- API-based test data setup and cleanup.
- Explicit waits instead of fixed sleeps.
- Safe retries for read-only API requests.
- Manual test cases maintained as the source of truth.

## 10. Known Limitations

- AutomationExercise is a shared public practice website and may occasionally respond slowly or return HTTP 503.
- Chromium is the primary stable browser baseline.
- Firefox and WebKit require additional stability validation.
- Allure reporting and GitHub Actions integration are optional future enhancements.

---

## Project Objective

To build a maintainable Playwright automation framework combining UI, API, hybrid testing, and AI-assisted test generation.

**Author:** [Nidhee Sharma](https://github.com/NidheeSharma)
