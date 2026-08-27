# Phase 26 — Interchange-Focused Directory and SOS Actions

## Specialist Finder Refinement

The controlled development directory has been regrouped around four connected Mumbai interchange areas: **Dadar, Kurla, Bandra, and Wadala Road**. This replaces widely spread example locations with a smaller, easier-to-scan set while preserving all twelve controlled specialty examples and Central, Harbour, and Western coverage.

| Corridor | Primary directory entries | Connected-area coverage |
| --- | ---: | --- |
| Central | 4 | Dadar and Kurla |
| Western | 4 | Dadar and Bandra |
| Harbour | 4 | Kurla, Bandra, and Wadala Road |

The directory remains explicitly mock-only. The locations are station reference points for development markers, not real clinician locations or availability. Shared rail associations remain intact: Dadar is retained across Central and Western filters, while Kurla is retained across Central and Harbour filters.

## SOS Action Redesign

The former simulated emergency dispatch screen has been replaced with actions that are always initiated and finalized by the user.

| Action | What LifeLink does | What LifeLink does not do |
| --- | --- | --- |
| Emergency-contact message | Shows an in-app confirmation, then opens the device SMS composer with a short SOS draft for a patient-recorded emergency contact. | Does not open or send an SMS without confirmation, add location, or add health details. |
| Ambulance/emergency response | Shows an explicit confirmation, then opens the device dialer with `112`. | Does not place a call, contact responders, or transmit patient/location data. |

The `112` choice is based on the Ministry of Home Affairs description of the Emergency Response Support System as the nationwide unified emergency response system. [1]

> The SOS controls are product tools, not medical advice. In an emergency, the user decides whether to call and should seek urgent professional help immediately.

## Validation

| Check | Result |
| --- | --- |
| Directory size and specialty coverage | Passed: 12 explicit mock entries and at least three specialties per corridor. |
| Interchange associations | Passed: shared Dadar and Kurla filtering remains correct. |
| Emergency action safety tests | Passed: SMS draft excludes location and clinical details; both visible actions have confirmation steps; call number is `112`. |
| Full automated validation | Passed: 16 test files and 39 tests. |
| Production build | Passed. |

## Reference

[1]: https://www.mha.gov.in/en/commoncontent/emergency-response-support-system-erss "Ministry of Home Affairs — Emergency Response Support System (ERSS)"
