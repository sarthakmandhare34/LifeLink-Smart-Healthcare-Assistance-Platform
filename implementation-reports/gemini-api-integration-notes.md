# Gemini API Integration Notes

The direct Gemini API key was validated against the provider model catalog. The provider reported that `gemini-2.5-flash` is unavailable to new users and directed the integration to `gemini-3.6-flash`.

Google’s current guidance recommends the **Interactions API** for current models and structured outputs. The request should use `POST https://generativelanguage.googleapis.com/v1beta/interactions`, an `x-goog-api-key` header, a model identifier, an `input`, and a `response_format` object with JSON MIME type and schema. Gemini 3.6 Flash supports `thinking_level: "minimal"`, which is appropriate for concise structured decision-support output.

Sources: [Structured output documentation](https://ai.google.dev/gemini-api/docs/structured-output), [Gemini thinking documentation](https://ai.google.dev/gemini-api/docs/thinking), and [Gemini 3 guide](https://ai.google.dev/gemini-api/docs/gemini-3).
