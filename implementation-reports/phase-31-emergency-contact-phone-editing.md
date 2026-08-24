# Phase 31 — Emergency Contact Phone Editing

## Issue Resolved

The Health Passport already displayed emergency contacts, but its edit workflow did not provide a way to add or correct a contact phone number. The patient can now add a contact or select **Edit** on an existing contact, then enter the contact name, relationship, and emergency contact number in visible fields.

## Persistent Contact Flow

| Step | Patient experience |
| --- | --- |
| Add | Select **Add contact** in Health Passport, enter name, relationship, and number, then select **Save contact**. |
| Edit | Select **Edit** beside an existing family or emergency contact, revise the number or other details, then save. |
| Validation | The number must be a plausible local or international phone number. Empty, too-short, and non-phone values are rejected before persistence. |
| SOS | The Emergency page reads the patient-owned saved contact number. It shows a confirmation before opening an SMS draft; it never sends the message automatically. |

## Privacy and Safety Boundaries

Phone numbers are stored in the existing patient-scoped emergency-contact table and are available only through the protected patient profile route. They are not put in browser storage, not shared with LifeLink automatically, and not included in the SOS message body. The user still reviews and sends the native SMS draft themselves.

## Validation

| Check | Result |
| --- | --- |
| Emergency-contact validation test | Passed for valid local/international numbers and invalid empty, short, or non-phone values. |
| Type checking | Passed. |
| Automated suite | Passed: 19 test files and 45 tests. |
| Production build | Passed. |
