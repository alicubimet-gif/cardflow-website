import { apiRequest } from "@/lib/apiClient";

/**
 * Public studio self-registration (ZCards `/api/public/auth/register/`).
 * Accepts website form fields { name, email, phone, company }.
 * The server proxy maps them to { full_name, email, mobile, studio_name }.
 * Backend emails a magic-link verification — no password is set by the client.
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
 * Shared auth helpers for password reset / complete-profile / demo.
 * Login itself is not handled here — the website redirects to Studio.
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
