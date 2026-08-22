import { describe, expect, it } from "vitest";
import { publishPatientEvent, subscribeToPatientEvents } from "./patientEventBus";
import { parseLastEventId } from "./patientRealtime";

describe("patient realtime isolation", () => {
  it("only delivers an event to the matching patient channel", () => {
    const firstPatientEvents: number[] = [];
    const secondPatientEvents: number[] = [];
    const stopFirst = subscribeToPatientEvents(1, (event) => firstPatientEvents.push(event.id));
    const stopSecond = subscribeToPatientEvents(2, (event) => secondPatientEvents.push(event.id));

    publishPatientEvent({ id: 55, userId: 1, type: "MEDICINE_UPDATED", entityId: "7", createdAt: new Date() });

    stopFirst();
    stopSecond();
    expect(firstPatientEvents).toEqual([55]);
    expect(secondPatientEvents).toEqual([]);
  });

  it("accepts only positive integral event resume identifiers", () => {
    expect(parseLastEventId("42")).toBe(42);
    expect(parseLastEventId("0")).toBeUndefined();
    expect(parseLastEventId("not-an-id")).toBeUndefined();
  });
});
