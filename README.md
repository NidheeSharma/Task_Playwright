AutomationExercise Playwright Framework

An enterprise-style end-to-end test automation framework for AutomationExercise, built with Playwright and TypeScript. It covers UI, REST API, and hybrid testing, with AI-assisted test generation using Cursor and Claude Code skill files.

Contents
Overview
Tech Stack and Dependencies
Setup
Folder Structure
How It Works (Code Flow)
Key Components
Test Coverage
Running Tests
Reports and Debugging
Adding a New Test with AI
Design Decisions
Known Limitations
1. Overview

The target is a public practice e-commerce website with registration, login, products, search, cart, checkout, and a documented REST API.

The framework supports:

UI Testing: Browser workflows using the Page Object Model.
API Testing: Endpoint validation with typed responses and schema checks.
Hybrid Testing: Combining API and UI operations to validate complete workflows.

Key features: Reusable fixtures, unique test data, centralized locators and API endpoints, parallel execution, test tagging, and detailed reporting.

2. Tech Stack and Dependencies
Package	Purpose
@playwright/test	Test runner, browser automation, API testing
typescript	Strict typing
@faker-js/faker	Unique test data
dotenv	Environment variables
eslint, prettier	Code quality and formatting
@types/node	Node.js typings

Requirement: Node.js 18 or newer.

3. Setup

Clone the repository and install dependencies:

bash
git clone <your-repo-url>
cd Task_Playwright

npm install
npx playwright install
cp .env.example .env
npx tsc --noEmit


For Windows PowerShell:

powershell
Copy-Item .env.example .env


The framework supports three environments:

dev
qa (default)
prod

Environment configurations are maintained in the config/ directory.

4. Folder Structure
text
.
├── .claude/skills/          # AI skill files (Claude Code)
├── .cursor/rules/           # AI rules (Cursor)
├── config/                  # Environment configurations
├── docs/
│   ├── manual-test-cases/   # Manual cases and traceability
│   └── ai-review-log.md     # AI review observations
├── src/
│   ├── api/                 # API client and endpoint classes
│   ├── data/                # Test data factory and constants
│   ├── fixtures/            # Custom Playwright fixtures
│   ├── pages/               # Page Object Model classes
│   └── utils/               # Helpers, logger, validators
├── tests/
│   ├── api/                 # API test specifications
│   ├── hybrid/              # UI + API test specifications
│   └── ui/                  # UI test specifications
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
├── CLAUDE.md                # Claude Code instructions
└── package.json

5. How It Works (Code Flow)

The framework follows a layered architecture using Page Objects, custom fixtures, and a centralized API client.

text
Manual Test Case
       |
       v
Playwright Test Spec
       |
       v
Custom Fixtures
       |
       +----------------------+
       |                      |
       v                      v
   Page Objects           API Classes
       |                      |
       v                      v
    Browser               API Client
       |                      |
       +----------+-----------+
                  |
                  v
              Assertions
                  |
                  v
           Fixture Teardown


A typical hybrid test uses the API to create a user account, verifies login through the UI, and deletes the account during fixture teardown.

6. Key Components
Page Objects: Maintain UI locators and browser interactions. Locators are centralized instead of being written in test specifications.
ApiClient: Handles HTTP requests, response parsing, and common API operations.
UserApi / ProductApi: Provide typed methods for individual API endpoints.
Fixtures: Manage browser setup, Page Objects, API dependencies, and account cleanup.
Data Factory: Uses buildUser(), buildPayment(), and uniqueEmail() to generate unique test data.
Utilities: Provide parsePrice(), normalizeText(), validateShape(), and a logger that redacts sensitive information.

API handling: The application sometimes returns HTTP 200 while providing the actual operation status in responseCode. Therefore, tests validate both values. Read-only API requests support safe retries for temporary server errors.

Test tags: @smoke, @regression, @ui, @api, @hybrid, and @negative.

7. Test Coverage

The framework contains 8 manual test cases automated as 12 Playwright tests.

ID	Flow	Type	Specification
TC-001	Registration and API verification	Hybrid	tests/hybrid/register-verify.spec.ts
TC-002	Valid/invalid login and logout	Hybrid	tests/hybrid/login.spec.ts
TC-003	Product search and API comparison	Hybrid	tests/hybrid/search-vs-api.spec.ts
TC-004	Cart price, quantity, total, and removal	UI	tests/ui/cart.spec.ts
TC-005	Checkout and order confirmation	Hybrid	tests/hybrid/checkout.spec.ts
TC-006	Products API and negative scenarios	API	tests/api/products.api.spec.ts
TC-007	Brands API validation	API	tests/api/products.api.spec.ts
TC-008	Account lifecycle and login verification	API	tests/api/users.api.spec.ts

Detailed test steps and expected results are maintained in docs/manual-test-cases/.

8. Running Tests

Run all Chromium tests:

bash
npx playwright test --project=chromium


Run API tests (if an api project is configured):

bash
npx playwright test tests/api --project=api


Run smoke tests:

bash
npx playwright test --grep "@smoke" --project=chromium


Exclude negative tests:

bash
npx playwright test --grep-invert "@negative"


Run a specific test case:

bash
npx playwright test -g "TC-004"


Run in headed mode:

bash
npx playwright test tests/hybrid/login.spec.ts --headed


Open Playwright UI mode:

bash
npx playwright test --ui


Run in debug mode:

bash
npx playwright test --debug


Run repeated tests for stability checking:

bash
npx playwright test --repeat-each=3


Choose an environment:

macOS/Linux:

bash
ENV=qa npx playwright test


Windows PowerShell:

powershell
$env:ENV="qa"
npx playwright test

9. Reports and Debugging

The framework uses the Playwright HTML reporter.

Open the HTML report:

bash
npx playwright show-report


Open a test trace:

bash
npx playwright show-trace test-results/<test-folder>/trace.zip


On failure, screenshots, videos, and traces are retained according to the Playwright configuration. API logs redact sensitive information.

10. Adding a New Test with AI

The repository contains skill and rule files for Cursor and Claude Code. These define framework conventions and guide AI agents in generating tests from manual steps.

Example request:

text
@generate

Search a product and add it to the cart.

1. Open the products page.
2. Search for "top".
3. Verify only products containing "top" are shown.
4. Add the first result to the cart.
5. Verify the cart contains one item.


The AI agent follows the framework rules to generate:

Manual test case documentation.
Required Page Object, API, or data changes.
Playwright test specification.
Related documentation updates.

Generated code is reviewed and validated before acceptance.

AI skill files:

.claude/skills/add-test-case.md – Test generation workflow.
.claude/skills/automationexercise-framework-rules.md – Framework coding rules.
.cursor/rules/add-test-case.mdc – Cursor generation trigger.
CLAUDE.md – Claude Code project instructions.

AI review observations are maintained in docs/ai-review-log.md.

11. Design Decisions
Manual cases as the source of truth: Each automated specification maps to a documented test case.
Separation of concerns: UI locators, API endpoints, test data, and test logic are maintained separately.
Hybrid testing: API operations prepare or verify data while UI tests validate user-facing behaviour.
Safe cleanup: Accounts created through API fixtures are deleted during teardown.
Controlled retries: Create and delete requests are never retried.
Parallel-safe execution: Unique test data and reduced worker count help avoid conflicts.
Explicit synchronization: Playwright waits and assertions are preferred over fixed sleeps.
12. Known Limitations
AutomationExercise is a shared public practice website and may occasionally respond slowly or return HTTP 503.
Chromium is the primary stable browser baseline. Firefox and WebKit projects are configured but require additional stability validation.
Ads and unnecessary third-party resources are blocked during test execution.
Allure reporting and GitHub Actions integration are optional future enhancements.

Project Goal: Provide a reusable Playwright automation framework that combines UI, API, hybrid testing, and AI-assisted test generation.