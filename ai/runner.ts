import type { Page, Expect } from '@playwright/test';

type Step =
  | { action: 'goto'; url: string }
  | { action: 'fill'; testId: string; value: string }
  | { action: 'click'; testId: string }
  | { action: 'assertUrlContains'; contains: string }
  | { action: 'assertVisible'; testId: string }
  | { action: 'assertTextContains'; testId: string; contains: string };

type Scenario = {
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

// Replace placeholders like ${VALID_USERNAME} with env vars
function substituteEnv(value: string): string {
  const re = /^\$\{([A-Z0-9_]+)\}$/;
  const m = value.match(re);
  if (!m) return value;

  const key = m[1];
  const envVal = process.env[key];
  if (!envVal) {
    throw new Error(`Missing required env var: ${key} (used in AI step value)`);
  }
  return envVal;
}

export async function runScenarioFromAiPlan(
  page: Page,
  expect: Expect,
  scenario: Scenario
) {
  if (scenario.needsHuman) {
    throw new Error(
      `Scenario "${scenario.name}" is marked needsHuman=true (UNKNOWN_TEST_ID or incomplete selectors).`
    );
  }

  for (const step of scenario.steps) {
    switch (step.action) {
      case 'goto':
        await page.goto(step.url);
        break;

      case 'fill': {
        const v = substituteEnv(step.value);
        await page.getByTestId(step.testId).fill(v);
        break;
      }

      case 'click':
        await page.getByTestId(step.testId).click();
        break;

      case 'assertUrlContains':
        await expect(page).toHaveURL(new RegExp(step.contains));
        break;

      case 'assertVisible':
        await expect(page.getByTestId(step.testId)).toBeVisible();
        break;

      case 'assertTextContains': {
        const loc = page.getByTestId(step.testId);
        await expect(loc).toContainText(step.contains);
        break;
      }

      default: {
        const _exhaustive: never = step;
        throw new Error(`Unsupported step: ${JSON.stringify(_exhaustive)}`);
      }
    }
  }
}