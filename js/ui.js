/**
 * ui.js — DOM Manipulation & UI Utilities
 * Slice v2.0 | ES Module
 *
 * Pure UI layer: no business logic, no state access.
 * Exports reusable functions consumed by main.js and dashboard.js.
 */

// ─── Toast Notification System ────────────────────────────────────────────────

/** Lazy-created container for toast stack. */
let _toastContainer = null;

function _getToastContainer() {
  if (!_toastContainer) {
    _toastContainer = document.createElement('div');
    _toastContainer.className = 'toast-container';
    _toastContainer.setAttribute('aria-live', 'polite');
    _toastContainer.setAttribute('aria-atomic', 'false');
    document.body.appendChild(_toastContainer);
  }
  return _toastContainer;
}

const _toastIcons = {
  success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
};

/**
 * Display a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration  milliseconds before auto-dismiss
 */
export function showToast(message, type = 'success', duration = 3000) {
  const container = _getToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="toast__icon">${_toastIcons[type] ?? _toastIcons.info}</span>
    <span class="toast__message">${message}</span>
  `;
  container.appendChild(toast);

  // Two rAF calls: first renders the element, second triggers the transition
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('toast--visible'));
  });

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}

// ─── Modal ────────────────────────────────────────────────────────────────────

/**
 * @param {HTMLElement} modalEl
 */
export function openModal(modalEl) {
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * @param {HTMLElement} modalEl
 */
export function closeModal(modalEl) {
  modalEl.classList.remove('active');
  document.body.style.overflow = '';
}

// ─── Result Card ──────────────────────────────────────────────────────────────

/**
 * Show the result card with CSS transition.
 * Uses two rAF calls to ensure display:block is painted before opacity transitions.
 * @param {HTMLElement} cardEl
 */
export function showResultCard(cardEl) {
  cardEl.style.display = 'block';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => cardEl.classList.add('active'));
  });
}

// ─── Button Loading State ─────────────────────────────────────────────────────

const _SPINNER_SVG = `<svg class="spinner-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;

/**
 * Put a button into loading state.
 * Stores original innerHTML on the element for resetButton() to restore.
 * @param {HTMLButtonElement} btn
 * @param {string} label
 */
export function setButtonLoading(btn, label = 'Processing...') {
  btn._originalHTML = btn.innerHTML;
  btn.innerHTML = `${_SPINNER_SVG} ${label}`;
  btn.disabled = true;
  btn.style.opacity = '0.8';
}

/**
 * Restore button to its pre-loading state.
 * @param {HTMLButtonElement} btn
 */
export function resetButton(btn) {
  btn.innerHTML = btn._originalHTML ?? '';
  btn.disabled = false;
  btn.style.opacity = '1';
  delete btn._originalHTML;
}

// ─── Input Validation Visual Feedback ────────────────────────────────────────

/** @param {HTMLInputElement} el */
export function setInputValid(el) {
  el.classList.add('is-valid');
  el.classList.remove('is-invalid');
}

/** @param {HTMLInputElement} el */
export function setInputInvalid(el) {
  el.classList.add('is-invalid');
  el.classList.remove('is-valid');
}

/** @param {HTMLInputElement} el */
export function clearInputState(el) {
  el.classList.remove('is-valid', 'is-invalid');
}

// ─── Password Visibility Toggle ───────────────────────────────────────────────

const _EYE_OPEN = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const _EYE_CLOSED = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

/**
 * Bind a show/hide password toggle button to its input.
 * @param {HTMLInputElement}  inputEl
 * @param {HTMLButtonElement} toggleBtn
 */
export function bindPasswordToggle(inputEl, toggleBtn) {
  if (!inputEl || !toggleBtn) return;
  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const willShow = inputEl.type === 'password';
    inputEl.type = willShow ? 'text' : 'password';
    toggleBtn.innerHTML = willShow ? _EYE_CLOSED : _EYE_OPEN;
    toggleBtn.setAttribute('aria-label', willShow ? 'Hide password' : 'Show password');
  });
}

// ─── QR Code ──────────────────────────────────────────────────────────────────

/**
 * Generate a QR code into a container element.
 * Depends on QRCode.js loaded as a CDN global.
 * @param {HTMLElement} containerEl
 * @param {string}      url
 */
export function renderQRCode(containerEl, url) {
  containerEl.innerHTML = '';
  // QRCode is a global exposed by qrcodejs CDN script
  new window.QRCode(containerEl, {
    text:          url,
    width:         100,
    height:        100,
    colorDark:     '#09090b',
    colorLight:    '#ffffff',
    correctLevel:  window.QRCode.CorrectLevel.H,
  });
}

// ─── Clipboard ────────────────────────────────────────────────────────────────

/**
 * Copy text to clipboard and show a toast.
 * Optionally gives visual feedback on a button element.
 * @param {string}           text
 * @param {HTMLElement|null} btn  — pass null to skip button feedback
 */
export async function copyToClipboard(text, btn = null) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');

    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
      btn.style.setProperty('color', 'var(--success)');
      btn.style.setProperty('border-color', 'var(--success)');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.removeProperty('color');
        btn.style.removeProperty('border-color');
      }, 2000);
    }
  } catch {
    showToast('Could not copy. Please copy manually.', 'error');
  }
}
