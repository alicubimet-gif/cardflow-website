import axios from "axios";
import { getServerApiBase } from "./config";

export const apiClient = axios.create({
  baseURL: getServerApiBase(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send HttpOnly cookies to the proxy
});

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(endpoint, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    const error: any = new Error(data.message || "Something went wrong");
    error.code = data.code;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
