/**
 * BJMCS Cyber Club — Site configuration
 *
 * Central place for club branding and site-wide constants.
 */

export const siteConfig = {
  /** Abbreviated display name (current official name) */
  name: "BJMCS Cyber Club",

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
  description: "Official platform of BJMCS Cyber Club",

  /** Public-facing base URL (set via environment in production) */
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;
