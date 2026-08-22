import { describe, expect, it } from "vitest";

describe("server Gemini credential", () => {
  it("authenticates against the Gemini model catalog without sending patient content", async () => {
    const key = process.env.GEMINI_API_KEY;
    expect(key).toBeTruthy();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key ?? "")}`);
    expect(response.ok).toBe(true);
  }, 20_000);

  it("accepts a schema-constrained server-side generation request without patient content", async () => {
    const key = process.env.GEMINI_API_KEY;
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": key ?? "",
      },
      body: JSON.stringify({
        model: "gemini-3.6-flash",
        input: "Return a JSON object with the exact status value ready.",
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: {
            type: "object",
            properties: { status: { type: "string", enum: ["ready"] } },
            required: ["status"],
            additionalProperties: false,
          },
        },
        generation_config: { thinking_level: "minimal" },
      }),
    });

    expect(response.ok).toBe(true);
    const payload = await response.json() as {
      steps?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
    };
    const output = payload.steps
      ?.filter((step) => step.type === "model_output")
      .flatMap((step) => step.content ?? [])
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("") ?? "{}";
    expect(JSON.parse(output)).toEqual({ status: "ready" });
  }, 20_000);
});
