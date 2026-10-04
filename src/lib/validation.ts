/**
 * Input validation foundation.
 *
 * Re-exports Zod so the rest of the codebase imports validation
 * utilities from a single internal module. This allows swapping
 * or extending the validation library in one place.
 */

export { z } from "zod";
export type { ZodSchema } from "zod";

/**
 * Parse data against a Zod schema, returning a discriminated result
 * instead of throwing. Useful for form validation and API input.
 */
export function validate<T>(
  schema: import("zod").ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "_root";
    if (!errors[key]) errors[key] = [];
    errors[key].push(issue.message);
  }
  return { success: false, errors };
}
