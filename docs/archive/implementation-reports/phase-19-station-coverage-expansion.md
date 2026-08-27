# Phase 19 — Controlled Station Coverage Expansion

## Objective

At the owner's request, the controlled Mumbai development directory now provides **two explicitly labeled mock listings for every one of the 100 normalized owner-supplied station entities**. Every Western, Central, and Harbour station association remains attached to its single shared-station entity. The directory remains a development-only reference and does not claim that these are real clinicians, appointments, availability, ratings, or recommendations.

## Data Foundation

Station reference positions were reconciled against the BMC Mumbai Suburban Network 2025 station KML, which is published as public-domain open data. The BMC source matched 92 station entities after non-ambiguous name normalization. The remaining eight entities were resolved using rate-limited OpenStreetMap geocoding, solely to place controlled development markers at station reference positions. No patient location or provider location was queried, stored, or transmitted. [1] [2]

| Measure                                    | Result                                                          |
| ------------------------------------------ | --------------------------------------------------------------- |
| Owner-supplied normalized station entities | 100                                                             |
| Controlled mock listings                   | 200                                                             |
| Listings per station                       | 2                                                               |
| Minimum specialty coverage per rail line   | 3 categories; actual generated coverage exceeds this minimum    |
| Shared station associations                | Preserved through `railLines` on both entries for every station |

## Files Updated

| File                                    | Change                                                                                                                                                                                                                            |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/mumbaiStationCoordinates.ts`    | Generated a complete typed station-coordinate module for all 100 normalized station entities.                                                                                                                                     |
| `backend/mockDoctorDirectory.ts`        | Replaced the 12 handcrafted listings with two explicit mock entries per station. Specialty pairs rotate across the controlled specialty set, while line associations and data-backed station reference coordinates remain intact. |
| `backend/mockDoctorDirectory.test.ts`   | Adds assertions for 200 entries, exactly two entries at every station, preserved shared-line filtering, data-backed coordinates, at least three specialty categories per rail line, and specialty-only free-text search.          |
| `/home/ubuntu/lifelink-reference-data/` | Holds the non-runtime BMC and open-map reference downloads outside the deployed project; only the derived typed coordinate module is part of the application bundle.                                                              |

## Verification

| Check                       | Result                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| Station coordinate audit    | Matched all 100 owner-supplied station entities; no unresolved station remained.                 |
| Controlled directory tests  | Passed. Assertions verify two entries for every station and line-aware shared-station filtering. |
| Corridor specialty coverage | Passed. Every Central, Harbour, and Western filter returns at least three specialty categories.  |
| Full validation             | All 15 test files and 36 tests passed; the production build passed.                              |
| Interactive map             | The owner confirmed the live map works after the managed proxy-loader correction.                |

## Safety Boundaries

All generated entries visibly retain their **Mock** and **Development mock** labels. They are controlled test listings only. The map continues to show station-reference markers for these mock entries and does not imply real clinician practice locations, current availability, distances, or recommendations.

## References

[1]: https://data.opencity.in/dataset/mumbai-suburban-network-2025 "Mumbai Suburban Network 2025 — BMC station KML"
[2]: https://nominatim.openstreetmap.org/ "OpenStreetMap Nominatim geocoding service"
