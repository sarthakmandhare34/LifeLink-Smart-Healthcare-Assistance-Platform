export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
  authPublicBaseUrl: process.env.AUTH_PUBLIC_BASE_URL ?? "",
  googleOAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
  googleOAuthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
  clinicianAdministrationCode:
    process.env.LIFELINK_CLINICIAN_ADMIN_CODE ??
    process.env.LIFELINK_DEMO_DOCTOR_ACCESS_CODE ??
    "",
};
