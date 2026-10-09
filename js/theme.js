const themeButton = document.querySelector("[data-theme-toggle]");
const root = document.documentElement;
let theme = root.dataset.theme === "dark" ? "dark" : "light";

try {
  const savedTheme = localStorage.getItem("slice-theme");
  if (savedTheme === "dark" || savedTheme === "light") theme = savedTheme;
} catch {
  // Theme switching still works when browser storage is unavailable.
}

function updateThemeButton() {
  root.dataset.theme = theme;
  themeButton.textContent = theme === "dark" ? "Use light theme" : "Use dark theme";
  themeButton.setAttribute("aria-pressed", String(theme === "dark"));
}

updateThemeButton();
themeButton.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  updateThemeButton();
  try {
    localStorage.setItem("slice-theme", theme);
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
});
