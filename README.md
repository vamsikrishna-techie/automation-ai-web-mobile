# AI-First Automation Framework (Web + Mobile)

This project demonstrates a **production-grade, AI-assisted automation framework** for both web and mobile platforms. It integrates Claude-generated test steps, Playwright web automation, and WebdriverIO + Appium mobile automation with cloud execution support via LambdaTest.

The goal of this framework is to showcase how AI-generated test cases can be safely executed using guardrails, schema validation, and stable selectors while maintaining deterministic, reliable automation.

---

# 🚀 Key Features

## AI-Driven Test Generation

* Markdown-based test specifications
* Claude prompt templates to generate structured JSON steps
* Deterministic output using strict prompt guardrails
* Schema validation and selector stability enforcement

## Web Automation (Playwright)

* Playwright-based test execution
* Data-test-id selector strategy for stability
* Guardrail-validated test steps
* Trace and reporting support

## Mobile Automation (WebdriverIO + Appium)

* Cross-platform mobile automation framework
* Android and iOS capability configuration
* Cloud execution ready (LambdaTest compatible)
* Screen Object Model implementation
* Environment-based configuration

## Cloud Integration Ready

* LambdaTest cloud execution configuration
* Environment variable based credential handling
* Parallel execution support
* CI workflow included

## CI/CD Integration

* GitHub Actions workflow for mobile tests
* Cloud execution configurable via repository secrets
* CI-ready framework structure

---

# 📁 Project Structure

```
automation-ai-web-mobile/
│
├── ai/
│   ├── prompt-template.md
│   ├── example-input.md
│   ├── example-output.json
│   ├── steps.schema.json
│   └── validate-ai-output.js
│
├── specs/
│   └── login.md
│
├── web-tests/
│   ├── login.ai.spec.ts
│   └── checkout.ai.spec.ts
│
├── mobile-tests/
│   ├── wdio.conf.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── test/
│       ├── specs/
│       │   └── sanity.e2e.ts
│       └── pageobjects/
│           ├── page.ts
│           ├── login.page.ts
│           └── secure.page.ts
│
├── docs/
│   └── architecture.md
│
└── .github/
    └── workflows/
        ├── playwright.yml
        └── mobile.yml
```

---

# 🌐 Web Automation Setup

## Install dependencies

```bash
cd web-tests
npm install
```

## Run Playwright tests

```bash
npx playwright test
```

---

# 📱 Mobile Automation Setup

Mobile automation uses WebdriverIO + Appium and is designed for LambdaTest cloud execution.

## Install dependencies

```bash
cd mobile-tests
npm install
```

## Configure environment variables

Create `.env` file based on `.env.example`:

```
LT_USERNAME=your_lambdatest_username
LT_ACCESS_KEY=your_lambdatest_access_key
LT_APP_ANDROID=lt://APPXXXXXX
LT_APP_IOS=lt://APPYYYYYY
```

## Run mobile tests

```bash
npm run wdio
```

---

# ☁️ LambdaTest Cloud Integration

Mobile tests are configured to run using LambdaTest Appium cloud hub:

```
mobile-hub.lambdatest.com
```

Configuration includes:

* Real device capability setup
* Android and iOS platform support
* Parallel execution ready
* CI-compatible configuration

Note:

Cloud execution requires LambdaTest App Automation entitlement. The framework remains fully functional locally and CI-ready regardless of cloud plan.

---

# 🤖 AI Guardrails and Validation

AI generated outputs are validated using:

* JSON schema validation
* XPath selector rejection
* Sleep / hard wait detection
* Deterministic output enforcement

Validation script:

```
ai/validate-ai-output.js
```

Schema definition:

```
ai/steps.schema.json
```

---

# ⚙️ CI/CD Workflows

GitHub Actions workflows included:

Web automation:

```
.github/workflows/playwright.yml
```

Mobile automation:

```
.github/workflows/mobile.yml
```

These workflows demonstrate cloud-ready execution using environment-based credentials.

---

# 🏛 Architecture Documentation

See:

```
docs/architecture.md
```

This document explains:

* Claude integration workflow
* Guardrail enforcement
* Determinism strategy
* Cloud execution model
* Flakiness reduction approach
* Cost and scalability considerations

---

# 🎯 Assignment Deliverables Covered

This project fulfills all required deliverables:

* Markdown-driven test specs
* Claude prompt template and structured output
* Guardrail validation layer
* Playwright web automation
* WebdriverIO + Appium mobile automation
* LambdaTest cloud execution configuration
* GitHub Actions CI workflow
* Architecture documentation

---

# 📌 Summary

This framework demonstrates a scalable, AI-assisted automation architecture that is:

* Cloud-ready
* CI/CD ready
* Deterministic and guardrail-protected
* Production-grade in structure and design

It provides a strong foundation for enterprise-level web and mobile test automation using modern AI-assisted workflows.

---
