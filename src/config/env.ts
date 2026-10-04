/**
 * Server-side environment variable access.
 *
 * This module must ONLY be imported in server components, API routes,
 * or server actions — never in client components.
 *
 * Using a getter function ensures missing variables surface as clear
 * runtime errors rather than silent `undefined` values.
 */

function requiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Check your .env file and .env.example for reference.`
    );
  }
  return value;
}

/** Server-only environment helpers */
export const env = {
  get databaseUrl(): string {
    return requiredEnv("DATABASE_URL");
  },

  // Future phases will add auth, email, storage helpers here.
} as const;
