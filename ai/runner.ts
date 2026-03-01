import { expect, Page } from '@playwright/test';

// TYPES
export type Step =
  | { action: 'goto'; url: string }
  | { action: 'fill'; testId: string; value: string }
  | { action: 'click'; testId: string }
  | { action: 'assertUrlContains'; contains: string }
  | { action: 'assertVisible'; testId: string }
  | { action: 'assertTextContains'; testId: string; contains: string };

export type Scenario = {
  name: string;
  needsHuman: boolean;
  steps: Step[];
};

export type AiPlan = {
  app: 'web' | 'mobile';
  baseUrl: string;
  feature: string;
  scenarios: Scenario[];
};

// ENV substitution
export function substituteEnv(value: string): string {
  const re = /^\$\{([A-Z0-9_]+)\}$/;
  const m = value.match(re);
  if (!m) return value;

  const key = m[1];
  const envVal = process.env[key];
  if (!envVal) throw new Error(`Missing env var: ${key}`);
  return envVal;
}

// SCENARIO RUNNER
export async function runScenario(page: Page, scenario: Scenario) {
  if (scenario.needsHuman) {
    throw new Error(`Scenario "${scenario.name}" needs human review`);
  }

  for (const step of scenario.steps) {
    switch (step.action) {
      case 'goto':
        await page.goto(step.url);
        break;

      case 'fill':
        await page.getByTestId(step.testId).fill(
          substituteEnv(step.value)
        );
        break;

      case 'click':
        await page.getByTestId(step.testId).click();
        break;

      case 'assertUrlContains':
        await expect(page).toHaveURL(new RegExp(step.contains));
        break;

      case 'assertVisible':
        await expect(
          page.getByTestId(step.testId)
        ).toBeVisible();
        break;

      case 'assertTextContains':
        await expect(
          page.getByTestId(step.testId)
        ).toContainText(step.contains);
        break;
    }
  }
}