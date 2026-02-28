# AI-First Automation Framework Architecture

## Overview

This framework demonstrates an AI-driven automation approach for web and mobile platforms using Claude, Playwright, and Appium with LambdaTest cloud integration.

Components:

- Claude generates deterministic JSON test steps from Markdown specs
- Playwright executes web tests using stable selectors
- WebdriverIO + Appium executes mobile tests
- LambdaTest provides scalable cloud execution
- Guardrails validate AI-generated output

---

## Architecture Flow

Markdown Spec
↓
Claude Prompt Template
↓
Structured JSON Output
↓
Guardrail Validation
↓
Test Execution

Web:
JSON → Playwright → Browser

Mobile:
JSON → WDIO + Appium → LambdaTest Cloud

---

## Claude Integration

Claude generates structured JSON steps using:

- Deterministic prompt template
- Temperature 0
- Strict selector rules

Guardrails enforce:

- No XPath
- No sleep()
- Prefer data-testid
- JSON schema validation

---

## Determinism Enforcement

Ensured via:

- Fixed prompt template
- Schema validation
- Stable selector rules
- No randomness in execution

---

## Flakiness Reduction Strategy

- Accessibility-first selectors
- data-testid usage
- Explicit waits instead of sleeps
- Cloud device consistency
- Retry only at runner level

---

## LambdaTest Cloud Integration

Mobile execution uses:

mobile-hub.lambdatest.com

Configured via:

wdio.conf.ts

Credentials provided via environment variables:

LT_USERNAME
LT_ACCESS_KEY

CI workflow defined in:

.github/workflows/mobile.yml

NOTE: Requires LambdaTest App Automation entitlement to execute tests.

---

## Cost Control Strategy

- Parallel execution configurable
- Minimal test sessions
- Environment variable driven config
- CI-triggered execution only