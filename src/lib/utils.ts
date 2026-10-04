/**
 * Shared utility: className merger
 *
 * Combines Tailwind classes safely using clsx. A lightweight alternative
 * to tailwind-merge that avoids an extra dependency for Phase 1.
 */

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}
