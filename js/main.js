import { isValidAlias, isValidUrl } from "./validator.js";

const form = document.querySelector("#aliasForm");
const destinationInput = document.querySelector("#destinationUrl");
const aliasInput = document.querySelector("#customAlias");
const formStatus = document.querySelector("#formStatus");
const previewEmpty = document.querySelector("#previewEmpty");
const previewResult = document.querySelector("#previewResult");
const previewAlias = document.querySelector("#previewAlias");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  destinationInput.removeAttribute("aria-invalid");
  aliasInput.removeAttribute("aria-invalid");
  formStatus.dataset.state = "";
  previewResult.hidden = true;
  previewEmpty.hidden = false;

  if (!isValidUrl(destinationInput.value)) {
    destinationInput.setAttribute("aria-invalid", "true");
    formStatus.dataset.state = "error";
    formStatus.textContent = "Enter a valid HTTP or HTTPS address.";
    destinationInput.focus();
    return;
  }

  if (!isValidAlias(aliasInput.value)) {
    aliasInput.setAttribute("aria-invalid", "true");
    formStatus.dataset.state = "error";
    formStatus.textContent = "Use 3 to 30 lowercase letters or numbers, with single hyphens between words.";
    aliasInput.focus();
    return;
  }

  previewAlias.textContent = "/" + aliasInput.value.trim();
  previewResult.hidden = false;
  previewEmpty.hidden = true;
  formStatus.textContent = "Alias preview ready. No link was created and the destination was not saved.";
});
