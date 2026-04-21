/**
 * main.js — Orchestrator for index.html
 * Slice v2.0 | ES Module
 *
 * Wires together ui, validator, and state modules.
 * Contains zero business logic — only event binding and coordination.
 */

import {
  showToast,
  openModal,
  closeModal,
  showResultCard,
  setButtonLoading,
  resetButton,
  setInputValid,
  setInputInvalid,
  clearInputState,
  bindPasswordToggle,
  renderQRCode,
  copyToClipboard,
} from './ui.js';

import {
  isValidUrl,
  isValidPassword,
  isValidUsername,
  normalizeUrl,
} from './validator.js';

import {
  addLink,
  isUsernameTaken,
  generateAlias,
} from './state.js';

document.addEventListener('DOMContentLoaded', () => {

  // ─── Element References ──────────────────────────────────────────────────

  const shortenForm     = document.getElementById('shortenForm');
  const longUrlInput    = document.getElementById('longUrl');
  const shortenBtn      = document.getElementById('shortenBtn');
  const resultCard      = document.getElementById('resultCard');
  const generatedUrl    = document.getElementById('generatedUrl');
  const copyBtn         = document.getElementById('copyBtn');
  const toggleAdvanced  = document.getElementById('toggleAdvanced');
  const advancedOptions = document.getElementById('advancedOptions');
  const loginModal      = document.getElementById('loginModal');
  const openLoginBtn    = document.getElementById('openLoginBtn');
  const closeModalBtn   = document.getElementById('closeModal');
  const customAlias     = document.getElementById('customAlias');
  const linkPassword    = document.getElementById('linkPassword');
  const expiryDate      = document.getElementById('expiryDate');
  const selfDestruct    = document.getElementById('selfDestruct');
  const qrCodeEl        = document.getElementById('qrcode');

  // Auth elements
  const authForm         = document.getElementById('authForm');
  const authUsername     = document.getElementById('authUsername');
  const usernameHint     = document.getElementById('usernameHint');
  const authPassword     = document.getElementById('authPassword');
  const authSubmitBtn    = document.getElementById('authSubmitBtn');
  const switchAuthMode   = document.getElementById('switchAuthMode');
  const toggleText       = document.getElementById('toggleText');
  const authTitle        = document.getElementById('authTitle');
  const authSubtitle     = document.getElementById('authSubtitle');
  const emailGroup       = document.getElementById('emailGroup');
  const passRequirements = document.getElementById('passwordRequirements');

  // ─── Password Toggles ────────────────────────────────────────────────────

  bindPasswordToggle(linkPassword, document.getElementById('toggleLinkPassword'));
  bindPasswordToggle(authPassword, document.getElementById('toggleAuthPassword'));

  // ─── URL Input: Real-time Validation ─────────────────────────────────────

  longUrlInput.addEventListener('input', () => {
    const val = longUrlInput.value.trim();
    if (!val) { clearInputState(longUrlInput); return; }
    isValidUrl(val) ? setInputValid(longUrlInput) : setInputInvalid(longUrlInput);
  });

  longUrlInput.addEventListener('blur', () => {
    const val = longUrlInput.value.trim();
    if (val && isValidUrl(val)) {
      longUrlInput.value = normalizeUrl(val);
      setInputValid(longUrlInput);
    }
  });

  // ─── Shortener: Submit ────────────────────────────────────────────────────

  shortenForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const urlValue = longUrlInput.value.trim();
    if (!urlValue || longUrlInput.classList.contains('is-invalid')) {
      showToast('Please enter a valid URL first.', 'error');
      longUrlInput.focus();
      return;
    }

    setButtonLoading(shortenBtn, 'Processing...');

    // Simulated API delay — replace with fetch() when backend is ready
    setTimeout(() => {
      const alias        = customAlias.value.trim() || generateAlias();
      const finalShortUrl = `slice.link/${alias}`;

      generatedUrl.textContent = finalShortUrl;
      generatedUrl.href        = `https://${finalShortUrl}`;

      renderQRCode(qrCodeEl, `https://${finalShortUrl}`);

      addLink({
        alias,
        originalUrl:  urlValue,
        password:     linkPassword.value  || null,
        expiryDate:   expiryDate.value    || null,
        selfDestruct: selfDestruct.checked,
      });

      resetButton(shortenBtn);
      showResultCard(resultCard);
      showToast('Link shortened successfully!', 'success');

      if (window.innerWidth <= 768) {
        setTimeout(() =>
          resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
        , 100);
      }
    }, 1200);
  });

  // ─── Copy Button ──────────────────────────────────────────────────────────

  copyBtn.addEventListener('click', () => {
    copyToClipboard(generatedUrl.textContent, copyBtn);
  });

  // ─── Advanced Options Accordion ───────────────────────────────────────────

  toggleAdvanced.addEventListener('click', () => {
    const isOpen = advancedOptions.classList.toggle('show');
    toggleAdvanced.classList.toggle('active', isOpen);
    toggleAdvanced.querySelector('span').textContent = isOpen
      ? 'Hide Advanced Options'
      : 'Advanced Options';
  });

  // ─── Auth Modal ───────────────────────────────────────────────────────────

  openLoginBtn.addEventListener('click', () => openModal(loginModal));
  closeModalBtn.addEventListener('click', () => closeModal(loginModal));
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal(loginModal);
  });

  // ─── Auth: Toggle Sign In / Sign Up Mode ──────────────────────────────────

  let isSignUpMode = false;

  switchAuthMode.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;

    authTitle.textContent      = isSignUpMode ? 'Create Slice Account'                      : 'Sign In to Slice';
    authSubtitle.textContent   = isSignUpMode ? 'Register to unlock advanced link analytics.' : 'Enter your credentials to access your dashboard.';
    authSubmitBtn.textContent  = isSignUpMode ? 'Create Account'                             : 'Access Dashboard';
    switchAuthMode.textContent = isSignUpMode ? 'Sign In'                                   : 'Sign Up';
    toggleText.textContent     = isSignUpMode ? 'Already have an account?'                  : "Don't have an account?";

    emailGroup.classList.toggle('hidden', !isSignUpMode);
    passRequirements.classList.toggle('hidden', !isSignUpMode);

    clearInputState(authUsername);
    usernameHint.classList.add('hidden');
  });

  // ─── Auth: Username Real-time Validation ──────────────────────────────────

  authUsername.addEventListener('input', () => {
    const val = authUsername.value;

    if (!val) {
      clearInputState(authUsername);
      usernameHint.classList.add('hidden');
      return;
    }

    if (!isValidUsername(val)) {
      setInputInvalid(authUsername);
      usernameHint.textContent = 'Lowercase only, no spaces, no special characters.';
      usernameHint.className   = 'field-hint field-hint--error';
    } else {
      setInputValid(authUsername);
      usernameHint.textContent = 'Username looks good!';
      usernameHint.className   = 'field-hint field-hint--success';
      // Only show "looks good" hint in signup mode
      usernameHint.classList.toggle('hidden', !isSignUpMode);
    }
  });

  // ─── Auth: Form Submit ────────────────────────────────────────────────────

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = authUsername.value;
    const password = authPassword.value;

    if (!isValidUsername(username)) {
      showToast('Please fix your username format.', 'error');
      authUsername.focus();
      return;
    }

    if (isSignUpMode) {
      if (!isValidPassword(password)) {
        showToast('Password too weak. Need 8+ chars, 1 uppercase, 1 lowercase, 1 number.', 'error');
        authPassword.focus();
        return;
      }
      if (isUsernameTaken(username)) {
        setInputInvalid(authUsername);
        usernameHint.textContent = 'Username already taken! Try another.';
        usernameHint.className   = 'field-hint field-hint--error';
        return;
      }
    }

    authSubmitBtn.textContent = 'Authenticating...';
    authSubmitBtn.disabled    = true;
    authSubmitBtn.style.opacity = '0.8';

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
  });

  // ─── Share Buttons (Event Delegation) ────────────────────────────────────

  resultCard.addEventListener('click', (e) => {
    const url = generatedUrl.textContent;
    if (!url) return;

    if (e.target.closest('.x-twitter')) {
      window.open(
        `https://x.com/intent/tweet?url=https://${encodeURIComponent(url)}&text=Check+this+out!`,
        '_blank', 'noopener,noreferrer'
      );
    }
    if (e.target.closest('.whatsapp')) {
      window.open(
        `https://wa.me/?text=Check+this+out%3A+https%3A%2F%2F${encodeURIComponent(url)}`,
        '_blank', 'noopener,noreferrer'
      );
    }
  });

});
