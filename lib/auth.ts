export function clearTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}
