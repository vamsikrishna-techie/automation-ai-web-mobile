import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import { runScenario, type AiPlan } from '../ai/runner';

test('AI plan - Checkout Feature (runs JSON steps)', async ({ page }) => {
  // 1) Guardrail validation
  execSync('node ai/validate-ai-output.js ai/checkout-output.json', {
    stdio: 'inherit',
  });

  // 2) Load the JSON plan
  const jsonPath = path.resolve('ai/checkout-output.json');
  const plan = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as AiPlan;

  // 3) Pick scenario
  const scenario = plan.scenarios.find((s) => s.name === 'Successful checkout');
  if (!scenario) throw new Error('Scenario not found: Successful checkout');

  // 4) Execute scenario using shared runner
  await runScenario(page, scenario);
});