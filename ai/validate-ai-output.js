const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

function fail(msg) {
  console.error(`❌ AI output validation failed: ${msg}`);
  process.exit(1);
}

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    fail(`Invalid JSON in ${filePath}: ${e.message}`);
  }
}

function deepScanForBannedStrings(obj, bannedMatchers, pointer = '') {
  if (typeof obj === 'string') {
    for (const { name, match } of bannedMatchers) {
      if (match(obj)) fail(`Banned pattern "${name}" found at ${pointer}: "${obj}"`);
    }
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => deepScanForBannedStrings(v, bannedMatchers, `${pointer}/${i}`));
    return;
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      deepScanForBannedStrings(v, bannedMatchers, `${pointer}/${k}`);
    }
  }
}

function validateSelectors(data) {
  // Heuristics: reject unstable selector-like patterns if AI tries to sneak them in
  // (Even though schema doesn't include "selector", we still scan strings defensively.)
  const bannedMatchers = [
    {
        name: 'XPath',
        match: (s) => {
            const v = s.trim();
            // Common XPath patterns: starts with // or /, or contains xpath=
            if (v.toLowerCase().includes('xpath=')) return true;
            if (v.startsWith('//')) return true;
            if (v.startsWith('/')) return true; // e.g. /html/body...
            return false;
        },
    },
    { name: 'sleep()', match: (s) => s.toLowerCase().includes('sleep(') },
    { name: 'waitForTimeout', match: (s) => s.toLowerCase().includes('waitfortimeout') },
    { name: 'nth-child', match: (s) => s.toLowerCase().includes('nth-child') },
    { name: 'css deep chain', match: (s) => s.includes(' > ') && s.split('>').length >= 4 }
  ];

  deepScanForBannedStrings(data, bannedMatchers, '');
}

function validateNoUnknownTestIds(data) {
  // If Claude couldn't find a testId it should mark needsHuman:true and use UNKNOWN_TEST_ID
  for (const scenario of data.scenarios || []) {
    const hasUnknown = (scenario.steps || []).some((st) => st.testId === 'UNKNOWN_TEST_ID');
    if (hasUnknown && scenario.needsHuman !== true) {
      fail(`Scenario "${scenario.name}" contains UNKNOWN_TEST_ID but needsHuman is not true.`);
    }
  }
}

function validateSchema(data, schemaPath) {
  const ajv = new Ajv({ allErrors: true, strict: true, strictRequired: false });
  const schema = readJson(schemaPath);
  const validate = ajv.compile(schema);
  const ok = validate(data);
  if (!ok) {
    fail(`Schema errors:\n${JSON.stringify(validate.errors, null, 2)}`);
  }
}

function main() {
  const fileArg = process.argv[2];
  if (!fileArg) fail('Usage: node ai/validate-ai-output.js <path-to-ai-json>');

  const jsonPath = path.resolve(fileArg);
  const schemaPath = path.resolve('ai/steps.schema.json');

  const data = readJson(jsonPath);
  validateSchema(data, schemaPath);
  validateSelectors(data);
  validateNoUnknownTestIds(data);

  console.log('✅ AI output validation passed.');
}

main();