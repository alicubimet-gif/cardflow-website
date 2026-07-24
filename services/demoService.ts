import { apiRequest } from "@/lib/apiClient";

export async function requestDemo(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}) {
  return apiRequest("/server/demo-request", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
