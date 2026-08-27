# Phase 52 — Clinician Credential Recovery

## Diagnosis

The credential table currently contains **zero provisioned clinician accounts**. The earlier account-creation action therefore did not persist any credentials, which is why there were no emails or passwords to retrieve.

## Recovery path

The current preview `/doctor/setup` page includes the owner-only account administration interface. It can create all clinician logins, list provisioned specialist emails after validating the owner code, and replace a password with a new one-time value. The live route was still serving the prior setup screen at verification time; the preview may be used while deployment propagation completes.
