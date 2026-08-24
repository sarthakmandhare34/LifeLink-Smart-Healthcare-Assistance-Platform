export const patientWorkflowChecks = [
  {
    id: 'registration',
    expectedOutcome: 'A valid patient registration reaches the patient dashboard.',
    markers: ["mutateAsync({ name: fullName.trim(), email, password })", 'navigate(PATIENT_DASHBOARD_PATH)'],
  },
  {
    id: 'login',
    expectedOutcome: 'A valid patient login reaches the patient dashboard.',
    markers: ['mutateAsync({ email, password })', 'navigate(PATIENT_DASHBOARD_PATH)'],
  },
  {
    id: 'dashboard',
    expectedOutcome: 'The dashboard loads patient data and can start an assessment.',
    markers: ['dashboardQuery.data?.profile', "navigate('/patient/assessment')"],
  },
] as const;

export type PatientWorkflowId = (typeof patientWorkflowChecks)[number]['id'];
export type PatientWorkflowSources = Record<PatientWorkflowId, string>;

export function verifyPatientWorkflowOutcomes(sources: PatientWorkflowSources) {
  return patientWorkflowChecks.map((check) => ({
    ...check,
    passed: check.markers.every((marker) => sources[check.id].includes(marker)),
  }));
}

export function allPatientWorkflowOutcomesPassed(results: ReadonlyArray<{ passed: boolean }>) {
  return results.every((result) => result.passed);
}
