export const AUTH_COOKIE = "maturita_auth";

export function getPassword(): string {
  return process.env.SITE_PASSWORD ?? "maturita2026";
}

export function getAuthToken(): string {
  return process.env.AUTH_TOKEN ?? "ok-" + getPassword();
}
