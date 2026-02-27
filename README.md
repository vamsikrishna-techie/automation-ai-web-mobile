# AI-First Automation Framework (Web -- Claude + Playwright)

## Overview

This project demonstrates a production-grade **AI-First Automation
Framework** where:

1.  Test scenarios are written in Markdown\
2.  Claude (LLM) generates structured JSON test steps\
3.  AI output is validated using strict guardrails\
4.  Playwright executes the validated test plan\
5.  Tests run automatically in CI via GitHub Actions

This architecture ensures safe, deterministic, and scalable AI-driven
test automation.

------------------------------------------------------------------------

## High-Level Architecture

    specs/*.md
        ↓
    Claude Prompt Template
        ↓
    Structured JSON Output
        ↓
    Schema + Guardrail Validation
        ↓
    Playwright Execution Engine
        ↓
    Browser Test Execution

------------------------------------------------------------------------

## Project Structure

    .github/workflows/    → CI pipeline
    ai/                   → Claude integration + guardrails
    specs/                → Markdown feature definitions
    web-tests/            → Playwright tests (manual + AI-driven)
    playwright.config.ts  → Playwright configuration

------------------------------------------------------------------------

## AI Integration

### Markdown-driven Test Specification

Example:

``` md
# Login Feature

Given user is on login page  
When user enters valid credentials  
Then user should see dashboard  
```

Claude converts this specification into structured JSON steps.

------------------------------------------------------------------------

### Claude Output Format

Example structured JSON:

``` json
{
  "app": "web",
  "feature": "Login Feature",
  "scenarios": [
    {
      "name": "Successful login",
      "needsHuman": false,
      "steps": [
        { "action": "goto", "url": "https://www.saucedemo.com/" },
        { "action": "fill", "testId": "username", "value": "${VALID_USERNAME}" },
        { "action": "fill", "testId": "password", "value": "${VALID_PASSWORD}" },
        { "action": "click", "testId": "login-button" },
        { "action": "assertVisible", "testId": "inventory-container" }
      ]
    }
  ]
}
```

------------------------------------------------------------------------

## AI Guardrails

Validation layers ensure safety and determinism.

### Schema Validation

Ensures correct JSON structure and required fields.

Run validation:

    node ai/validate-ai-output.js ai/example-output.json

------------------------------------------------------------------------

### Selector Safety

Rejects:

-   XPath selectors
-   Hard waits
-   Unstable selectors

Encourages:

    data-testid

------------------------------------------------------------------------

### Anti-Hallucination Rule

If selector unknown:

    UNKNOWN_TEST_ID
    needsHuman: true

------------------------------------------------------------------------

## Playwright Execution Engine

AI-generated JSON executed dynamically.

Files:

    web-tests/login.ai.spec.ts
    web-tests/checkout.ai.spec.ts

Locator strategy:

    page.getByTestId()

Trace enabled on failure.

------------------------------------------------------------------------

## Running Locally

Install:

    npm install
    npx playwright install

Run tests:

    npx playwright test

Run validation:

    node ai/validate-ai-output.js ai/example-output.json

------------------------------------------------------------------------

## CI Integration

GitHub Actions performs:

-   Install dependencies
-   Validate AI output
-   Run Playwright tests
-   Upload reports

Workflow:

    .github/workflows/playwright.yml

------------------------------------------------------------------------

## Flakiness Reduction

-   Stable selectors
-   No hard waits
-   Playwright auto-wait
-   Guardrail validation

------------------------------------------------------------------------

## Technology Stack

-   Playwright
-   Node.js
-   TypeScript
-   JSON Schema (AJV)
-   GitHub Actions

------------------------------------------------------------------------
