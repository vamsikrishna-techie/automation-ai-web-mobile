import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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

type AiPlan = {
  app: 'web' | 'mobile';
  baseUrl: string;
  feature: string;
  scenarios: Scenario[];
};

function substituteEnv(value: string): string {
  const re = /^\$\{([A-Z0-9_]+)\}$/;
  const m = value.match(re);
  if (!m) return value;

  const key = m[1];
  const envVal = process.env[key];
  if (!envVal) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return envVal;
}

async function runScenario(page: any, scenario: Scenario) {
  if (scenario.needsHuman) {
    throw new Error(`Scenario "${scenario.name}" is marked needsHuman=true.`);
  }

  for (const step of scenario.steps) {
    switch (step.action) {
      case 'goto':
        await page.goto(step.url);
        break;

      case 'fill':
        await page.getByTestId(step.testId).fill(substituteEnv(step.value));
        break;

      case 'click':
        await page.getByTestId(step.testId).click();
        break;

      case 'assertUrlContains':
        await expect(page).toHaveURL(new RegExp(step.contains));
        break;

      case 'assertVisible':
        await expect(page.getByTestId(step.testId)).toBeVisible();
        break;

      case 'assertTextContains':
        await expect(page.getByTestId(step.testId)).toContainText(step.contains);
        break;
    }
  }
}

test('AI plan - Login Feature (runs JSON steps)', async ({ page }) => {
  execSync('node ai/validate-ai-output.js ai/example-output.json', {
    stdio: 'inherit',
  });

  const jsonPath = path.resolve('ai/example-output.json');
  const plan = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as AiPlan;

  const scenario = plan.scenarios.find((s) => s.name === 'Successful login');
  if (!scenario) throw new Error('Scenario not found: Successful login');

  await runScenario(page, scenario);
});