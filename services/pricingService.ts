import { apiRequest } from "@/lib/apiClient";

export async function getPublicPricing() {
  return apiRequest("/server/pricing");
}
