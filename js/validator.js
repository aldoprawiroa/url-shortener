export function normalizeUrl(value) {
  const input = value.trim();
  return /^https?:\/\//i.test(input) ? input : "https://" + input;
}

export function isValidUrl(value) {
  const input = value.trim();
  const explicitScheme = input.match(/^([a-z][a-z0-9+.-]*):/i);
  const hostAndPort = /^(?:localhost|(?:[a-z0-9-]+\.)+[a-z0-9-]+|\d{1,3}(?:\.\d{1,3}){3}):\d+(?:[/?#]|$)/i.test(input);
  if (!input || (explicitScheme && !/^https?$/i.test(explicitScheme[1]) && !hostAndPort)) return false;

  try {
    const url = new URL(normalizeUrl(value));
    return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function isValidAlias(value) {
  const alias = value.trim();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(alias) && alias.length >= 3 && alias.length <= 30;
}
