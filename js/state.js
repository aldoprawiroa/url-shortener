/**
 * state.js — In-Memory Link State Management
 * Slice v2.0 | ES Module
 *
 * Manages all shortened link data for the current session.
 * In production, this layer would interface with a backend API.
 * Hardcoded mock data is documented explicitly as prototype limitation.
 */

// ─── Link Store ───────────────────────────────────────────────────────────────

/** @type {Array<LinkRecord>} */
const _links = [];

/**
 * @typedef {Object} LinkRecord
 * @property {string}      alias
 * @property {string}      originalUrl
 * @property {string|null} password
 * @property {string|null} expiryDate    — ISO date string
 * @property {boolean}     selfDestruct
 * @property {number}      clicks
 * @property {Date}        createdAt
 */

/**
 * Add a new shortened link to state.
 * @param {{ alias: string, originalUrl: string, password?: string, expiryDate?: string, selfDestruct?: boolean }} opts
 * @returns {LinkRecord}
 */
export function addLink({ alias, originalUrl, password, expiryDate, selfDestruct }) {
  const record = {
    alias,
    originalUrl,
    password:    password    || null,
    expiryDate:  expiryDate  || null,
    selfDestruct: selfDestruct || false,
    clicks:      0,
    createdAt:   new Date(),
  };
  _links.unshift(record); // newest first
  return record;
}

/**
 * Remove a link by alias.
 * @param {string} alias
 * @returns {boolean} true if removed
 */
export function removeLink(alias) {
  const idx = _links.findIndex(l => l.alias === alias);
  if (idx !== -1) {
    _links.splice(idx, 1);
    return true;
  }
  return false;
}

/**
 * Get a shallow copy of all links (prevents external mutation).
 * @returns {LinkRecord[]}
 */
export function getLinks() {
  return [..._links];
}

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

/**
 * PROTOTYPE LIMITATION: Taken usernames are hardcoded client-side.
 * In production, this check MUST be performed server-side.
 */
const _takenUsernames = new Set(['admin', 'aldo', 'faiz', 'abdil', 'ibrahim']);

/**
 * @param {string} username
 * @returns {boolean}
 */
export function isUsernameTaken(username) {
  return _takenUsernames.has(username.toLowerCase());
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Generate a random 6-character alphanumeric alias.
 * @returns {string}
 */
export function generateAlias() {
  return Math.random().toString(36).substring(2, 8);
}
