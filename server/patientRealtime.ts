import type { Express, Request, Response } from "express";
import { getPatientEventsSince } from "./db";
import { type RealtimePatientEvent, subscribeToPatientEvents } from "./patientEventBus";
import { sdk } from "./_core/sdk";

const HEARTBEAT_MS = 25_000;

export function parseLastEventId(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function writeEvent(res: Response, event: RealtimePatientEvent) {
  res.write(`id: ${event.id}\nevent: patient-event\ndata: ${JSON.stringify({
    id: event.id,
    type: event.type,
    entityId: event.entityId,
    createdAt: event.createdAt.toISOString(),
  })}\n\n`);
}

export function registerPatientRealtimeRoute(app: Express) {
  app.get("/api/patient-events", async (req: Request, res: Response) => {
    let user;
    try {
      user = await sdk.authenticateRequest(req);
    } catch {
      res.status(401).json({ error: "Authentication is required." });
      return;
    }

    if (!user) {
      res.status(401).json({ error: "Authentication is required." });
      return;
    }

    res.status(200).set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.flushHeaders();
    res.write("retry: 3000\n\n");

    try {
      const lastEventId = parseLastEventId(req.header("last-event-id") ?? req.query.lastEventId);
      const backlog = await getPatientEventsSince(user.id, lastEventId);
      backlog.forEach((event) => writeEvent(res, event));
    } catch (error) {
      console.error("[Realtime] Unable to load patient event backlog", error);
      res.write("event: stream-error\ndata: {\"message\":\"Unable to load updates.\"}\n\n");
    }

    const unsubscribe = subscribeToPatientEvents(user.id, (event) => writeEvent(res, event));
    const heartbeat = setInterval(() => res.write(": keepalive\n\n"), HEARTBEAT_MS);
    const cleanup = () => {
      clearInterval(heartbeat);
      unsubscribe();
    };

    req.on("close", cleanup);
    req.on("aborted", cleanup);
  });
}
