document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const shortenForm = document.getElementById("shortenForm");
  const longUrlInput = document.getElementById("longUrl");
  const shortenBtn = document.getElementById("shortenBtn");
  const resultCard = document.getElementById("resultCard");
  const generatedUrl = document.getElementById("generatedUrl");
  const copyBtn = document.getElementById("copyBtn");

  // --- VALIDASI TAUTAN REAL-TIME (FRONTEND) ---
  const urlPattern =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;

  longUrlInput.addEventListener("input", () => {
    const val = longUrlInput.value.trim();
    if (val.length === 0) {
      longUrlInput.classList.remove("is-valid", "is-invalid");
    } else if (urlPattern.test(val)) {
      longUrlInput.classList.add("is-valid");
      longUrlInput.classList.remove("is-invalid");
    } else {
      longUrlInput.classList.add("is-invalid");
      longUrlInput.classList.remove("is-valid");
    }
  });

  longUrlInput.addEventListener("blur", () => {
    let val = longUrlInput.value.trim();
    if (val && !/^https?:\/\//i.test(val) && urlPattern.test(val)) {
      longUrlInput.value = "https://" + val;
    }
  });

  // --- FITUR MOCK SUBMIT & QR CODE GENERATOR ---
  shortenForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (longUrlInput.classList.contains("is-invalid")) {
      alert("Please enter a valid URL!");
      return;
    }

    const originalText = shortenBtn.innerHTML;
    shortenBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
            Processing...
        `;
    shortenBtn.style.opacity = "0.8";
    shortenBtn.disabled = true;

    if (!document.getElementById("spinnerStyle")) {
      const style = document.createElement("style");
      style.id = "spinnerStyle";
      style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      shortenBtn.innerHTML = originalText;
      shortenBtn.style.opacity = "1";
      shortenBtn.disabled = false;

      const customAlias = document.getElementById("customAlias").value.trim();
      const alias = customAlias || Math.random().toString(36).substring(2, 8);
      const finalShortUrl = `slice.link/${alias}`;
      generatedUrl.textContent = finalShortUrl;

      const qrContainer = document.getElementById("qrcode");
      qrContainer.innerHTML = "";
      new QRCode(qrContainer, {
        text: `https://${finalShortUrl}`,
        width: 100,
        height: 100,
        colorDark: "#09090b",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      resultCard.style.display = "block";
      requestAnimationFrame(() => {
        resultCard.classList.add("active");
      });

      if (window.innerWidth <= 768) {
        setTimeout(
          () =>
            resultCard.scrollIntoView({ behavior: "smooth", block: "start" }),
          100,
        );
      }
    }, 1200);
  });

  // --- COPY FUNCTIONALITY ---
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl.textContent);
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
      copyBtn.style.color = "var(--success)";
      copyBtn.style.borderColor = "var(--success)";

      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.color = "";
        copyBtn.style.borderColor = "";
      }, 2000);
    } catch (err) {
      alert("Failed to copy to clipboard.");
    }
  });

  // --- ADVANCED OPTIONS TOGGLE ---
  const toggleBtn = document.getElementById("toggleAdvanced");
  const advancedOptions = document.getElementById("advancedOptions");
  toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.toggle("active");
    advancedOptions.classList.toggle("show");
    toggleBtn.querySelector("span").textContent =
      advancedOptions.classList.contains("show")
        ? "Hide Advanced Options"
        : "Advanced Options";
  });

  // ==========================================
  // LOGIKA AUTENTIKASI: SIGN UP / SIGN IN
  // ==========================================
  const loginModal = document.getElementById("loginModal");
  document
    .getElementById("openLoginBtn")
    .addEventListener("click", () => loginModal.classList.add("active"));
  document
    .getElementById("closeModal")
    .addEventListener("click", () => loginModal.classList.remove("active"));
  loginModal.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.classList.remove("active");
  });

  let isSignUpMode = false;
  const switchBtn = document.getElementById("switchAuthMode");
  const authTitle = document.getElementById("authTitle");
  const authSubtitle = document.getElementById("authSubtitle");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  const emailGroup = document.getElementById("emailGroup");
  const usernameInput = document.getElementById("authUsername");
  const usernameHint = document.getElementById("usernameHint");
  const passInput = document.getElementById("authPassword");
  const passReq = document.getElementById("passwordRequirements");
  const toggleText = document.getElementById("toggleText");

  const usernameRegex = /^[a-z0-9_]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  switchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;

    authTitle.textContent = isSignUpMode
      ? "Create Slice Account"
      : "Sign In to Slice";
    authSubtitle.textContent = isSignUpMode
      ? "Register to unlock advanced link analytics."
      : "Enter your username to access your dashboard.";
    authSubmitBtn.textContent = isSignUpMode
      ? "Create Account"
      : "Access Dashboard";
    switchBtn.textContent = isSignUpMode ? "Sign In" : "Sign Up";
    toggleText.textContent = isSignUpMode
      ? "Already have an account?"
      : "Don't have an account?";

    emailGroup.style.display = isSignUpMode ? "flex" : "none";
    passReq.style.display = isSignUpMode ? "block" : "none";

    usernameInput.classList.remove("is-invalid", "is-valid");
    usernameHint.style.display = "none";
  });

  usernameInput.addEventListener("input", () => {
    const val = usernameInput.value;
    if (val.length === 0) {
      usernameInput.classList.remove("is-invalid", "is-valid");
      usernameHint.style.display = "none";
      return;
    }

    if (!usernameRegex.test(val)) {
      usernameInput.classList.add("is-invalid");
      usernameInput.classList.remove("is-valid");
      usernameHint.textContent =
        "Lowercase only, no spaces, no special characters.";
      usernameHint.style.color = "var(--danger)";
      usernameHint.style.display = "block";
    } else {
      usernameInput.classList.remove("is-invalid");
      usernameInput.classList.add("is-valid");
      usernameHint.textContent = "Username looks good!";
      usernameHint.style.color = "var(--success)";
      usernameHint.style.display = isSignUpMode ? "block" : "none";
    }
  });

  document.getElementById("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passInput.value;
    const takenUsernames = ["admin", "aldo", "faiz", "abdil", "ibrahim"];

    if (isSignUpMode) {
      if (!usernameRegex.test(username)) {
        alert("Please fix your username format.");
        return;
      }
      if (!passwordRegex.test(password)) {
        alert(
          "Password too weak! Min. 8 chars, 1 uppercase, 1 lowercase, 1 number.",
        );
        return;
      }
      if (takenUsernames.includes(username)) {
        usernameInput.classList.add("is-invalid");
        usernameHint.textContent = "Username already taken! Try another.";
        usernameHint.style.color = "var(--danger)";
        usernameHint.style.display = "block";
        return;
      }
      alert("Account created successfully! Welcome to Slice.");
    }

    authSubmitBtn.textContent = "Authenticating...";
    authSubmitBtn.style.opacity = "0.8";
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  }); // <--- INI ADALAH PENUTUP FUNGSI SUBMIT YANG SEBELUMNYA HILANG

  // ==========================================
  // LOGIKA TOGGLE PASSWORD (BUKA/TUTUP MATA)
  // ==========================================

  // 1. Toggle untuk Advanced Options
  const linkPassInput = document.getElementById("linkPassword");
  const toggleLinkPassBtn = document.getElementById("toggleLinkPassword");

  if (toggleLinkPassBtn && linkPassInput) {
    toggleLinkPassBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isPassword = linkPassInput.type === "password";
      linkPassInput.type = isPassword ? "text" : "password";

      toggleLinkPassBtn.innerHTML = isPassword
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    });
  }

  // 2. Toggle untuk Modal Sign In / Sign Up
  const authPassInput = document.getElementById("authPassword");
  const toggleAuthPassBtn = document.getElementById("toggleAuthPassword");

  if (toggleAuthPassBtn && authPassInput) {
    toggleAuthPassBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isPassword = authPassInput.type === "password";
      authPassInput.type = isPassword ? "text" : "password";

      toggleAuthPassBtn.innerHTML = isPassword
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    });
  }
});
