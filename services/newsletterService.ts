import { apiRequest } from "@/lib/apiClient";

export async function subscribeToNewsletter(email: string) {
  return apiRequest<{ success: boolean; message: string }>("/server/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function unsubscribeFromNewsletter(token: string) {
  return apiRequest<{ success: boolean; message: string; email?: string }>(
    "/server/newsletter/unsubscribe",
    {
      method: "POST",
      body: JSON.stringify({ token }),
    },
  );
}
