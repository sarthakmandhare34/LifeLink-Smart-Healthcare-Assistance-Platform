import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { allPatientWorkflowOutcomesPassed, patientWorkflowChecks, verifyPatientWorkflowOutcomes } from './workflowVerification';

const sources = {
  registration: readFileSync(new URL('./Registration.tsx', import.meta.url), 'utf8'),
  login: readFileSync(new URL('./Login.tsx', import.meta.url), 'utf8'),
  dashboard: readFileSync(new URL('./Dashboard.tsx', import.meta.url), 'utf8'),
};

describe('patient workflow outcome verification', () => {
  it('loops through every defined patient workflow and confirms its expected source outcome', () => {
    const results = verifyPatientWorkflowOutcomes(sources);

    expect(results).toHaveLength(patientWorkflowChecks.length);
    for (const result of results) {
      expect(result.passed, result.expectedOutcome).toBe(true);
    }
    expect(allPatientWorkflowOutcomesPassed(results)).toBe(true);
  });
});
