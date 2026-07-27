import { apiRequest } from "@/lib/apiClient";

/**
 * New magic-link subscriber registration.
 * Accepts { name, email, phone, company }.
 * Backend creates user + company, generates a secure one-time token,
 * and emails a "Verify & Open Studio" link.
 * No password is ever created by or sent to the client.
 */
export const registerSubscriber = async (data: {
  name: string;
  email: string;
  phone: string;
  company: string;
}): Promise<any> => {
  return apiRequest("/server/auth/register-subscriber", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const verifyOtp = async (data: { email: string; otp: string }): Promise<any> => {
  return apiRequest("/server/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const resendOtp = async (data: { email: string }): Promise<any> => {
  return apiRequest("/server/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Shared auth service for password reset, complete-profile, and demo requests.
 * These are public flows that do not require an authenticated session.
 */
export const authService = {
  forgotPassword: async (data: any) => {
    return apiRequest("/server/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  resetPassword: async (data: any) => {
    return apiRequest("/server/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  completeProfile: async (data: any) => {
    return apiRequest("/server/auth/complete-profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  submitEnquiry: async (data: any) => {
    return apiRequest("/server/demo-request", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
