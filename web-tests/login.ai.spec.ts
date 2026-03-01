import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import { runScenario, AiPlan } from '../ai/runner';

test('AI plan - Login', async ({ page }) => {

  // validate guardrails
  execSync(
    'node ai/validate-ai-output.js ai/example-output.json',
    { stdio: 'inherit' }
  );

  // load plan
  const jsonPath = path.resolve('ai/example-output.json');
  const plan = JSON.parse(
    fs.readFileSync(jsonPath, 'utf-8')
  ) as AiPlan;

  // find scenario
  const scenario = plan.scenarios.find(
    s => s.name === 'Successful login'
  );

  if (!scenario)
    throw new Error('Scenario not found');

  // run scenario
  await runScenario(page, scenario);
});