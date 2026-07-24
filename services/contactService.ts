import { apiRequest } from "@/lib/apiClient";

export async function sendContactForm(data: {
  full_name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  return apiRequest("/server/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
