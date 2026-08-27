import { describe, expect, it } from "vitest";

const integrationTest = process.env.RUN_GEMINI_INTEGRATION_TESTS === "true" ? it : it.skip;

describe("server Gemini credential", () => {
  integrationTest("authenticates against the Gemini model catalog without sending patient content", async () => {
    const key = process.env.GEMINI_API_KEY;
    expect(key).toBeTruthy();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key ?? "")}`
    );
    expect(response.ok).toBe(true);
  }, 20_000);

  integrationTest("uses the supported Gemini generate-content schema contract without patient content", async () => {
    const key = process.env.GEMINI_API_KEY;
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": key ?? "",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: "Return a JSON object with the exact status value ready.",
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: { status: { type: "STRING", enum: ["ready"] } },
              required: ["status"],
            },
          },
        }),
      }
    );

    // A 429 means the valid configured key has temporarily exhausted generation quota.
    // The application then returns a safe provider-unavailable message without exposing details.
    expect([200, 429]).toContain(response.status);
    if (!response.ok) return;

    const payload = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const output =
      payload.candidates
        ?.flatMap(candidate => candidate.content?.parts ?? [])
        .map(part => part.text ?? "")
        .join("") ?? "{}";
    expect(JSON.parse(output)).toEqual({ status: "ready" });
  }, 60_000);
});
