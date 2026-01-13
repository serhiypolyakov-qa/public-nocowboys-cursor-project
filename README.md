# Web Autotests

Playwright test automation project with TypeScript and Page Object Model pattern.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

- Run all tests: `npm test`
- Run tests in headed mode: `npm run test:headed`
- Run tests with UI mode: `npm run test:ui`
- Debug tests: `npm run test:debug`
- View test report: `npm run test:report`

## Project Structure

```
web-autotests/
├── .cursor/
│   └── rules.md          # Cursor AI rules for selector and test guidelines
├── tests/
│   ├── e2e/              # End-to-end test files
│   ├── pages/            # Page Object Model classes
│   ├── fixtures/         # Test fixtures and custom test utilities
│   └── utils/            # Helper utilities and shared functions
├── playwright.config.ts  # Playwright configuration (TypeScript)
├── package.json          # Project dependencies
└── README.md             # This file
```

## Architecture

This project follows the **Page Object Model (POM)** pattern:

- **Tests** (`/tests/e2e`): Test specifications written in Playwright Test
- **Page Objects** (`/tests/pages`): Encapsulate page-specific logic and selectors
- **Fixtures** (`/tests/fixtures`): Custom test fixtures and extended test context
- **Utils** (`/tests/utils`): Reusable helper functions and utilities

## Technology Stack

- **Playwright Test**: Modern end-to-end testing framework
- **TypeScript**: Type-safe JavaScript
- **Page Object Model**: Design pattern for maintainable test code

## Selector Guidelines

For detailed selector rules and best practices, see `.cursor/rules.md`.

Key principles:
- Prefer `data-testid` attributes
- Use role-based selectors when appropriate
- Avoid XPath and positional selectors
- Never invent selectors - always use what's present in the HTML
