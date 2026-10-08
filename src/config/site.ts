/**
 * BGMCS Cyber Club — Site configuration
 *
 * Central place for club branding and site-wide constants.
 */

function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  /** Abbreviated display name (current official name) */
  name: "BGMCS Cyber Club",

  /**
   * Full official English name.
   * Will be provided in a future phase — do NOT guess.
   */
  fullName: null as string | null,

  /**
   * Official Amharic name.
   * Will be provided in a future phase — do NOT guess or translate.
   */
  amharicName: null as string | null,

  /** Short description used in metadata */
  description: "Official platform of BGMCS Cyber Club",

  /** Public-facing base URL (set via environment in production) */
  url: getAppBaseUrl(),
} as const;
