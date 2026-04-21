/**
 * validator.js — Input Validation Functions
 * Slice v2.0 | ES Module
 *
 * All patterns are tested for catastrophic backtracking (ReDoS) safety.
 * The original URL regex used nested quantifiers `([\\/\\w \\.-]*)*` which
 * could cause browser hang on crafted inputs. Replaced with a safe pattern.
 */

// ─── Patterns ────────────────────────────────────────────────────────────────

/**
 * Safe URL pattern.
 * - Protocol (http/https) optional
 * - Domain: word chars + hyphens, at least one dot-separated segment
 * - Path: optional, permissive set of URL-safe characters
 * No nested quantifiers → no ReDoS risk.
 */
const URL_PATTERN =
  /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w\-.~:/?#[\]@!$&'()*+,;=%]*)?$/i;

/**
 * Password: min 8 chars, ≥1 uppercase, ≥1 lowercase, ≥1 digit.
 */
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Username: lowercase letters, digits, underscore only.
 */
const USERNAME_PATTERN = /^[a-z0-9_]+$/;

// ─── Exported Functions ───────────────────────────────────────────────────────

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isValidUrl(value) {
  return URL_PATTERN.test(value.trim());
}

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isValidPassword(value) {
  return PASSWORD_PATTERN.test(value);
}

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isValidUsername(value) {
  return USERNAME_PATTERN.test(value);
}

/**
 * Prepends https:// if the URL has no protocol.
 * @param {string} value
 * @returns {string}
 */
export function normalizeUrl(value) {
  const trimmed = value.trim();
  if (trimmed && !/^https?:\/\//i.test(trimmed)) {
    return 'https://' + trimmed;
  }
  return trimmed;
}
