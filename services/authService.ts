import { apiClient, apiRequest } from "@/lib/apiClient";

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

export const authService = {
  register: async (data: any) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
  verifyOtp: async (data: { email: string; otp_code: string; purpose?: string }) => {
    const response = await apiClient.post("/auth/verify-otp", data);
    return response.data;
  },
  resendOtp: async (data: { email: string; purpose?: string }) => {
    const response = await apiClient.post("/auth/resend-otp", data);
    return response.data;
  },
  forgotPassword: async (data: any) => {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data;
  },
  resetPassword: async (data: any) => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },
  completeProfile: async (data: any) => {
    const response = await apiClient.post("/auth/complete-profile", data);
    return response.data;
  },
  submitContact: async (data: any) => {
    const response = await apiClient.post("/public/contact", data);
    return response.data;
  },
  submitEnquiry: async (data: any) => {
    const response = await apiClient.post("/public/demo-request", data);
    return response.data;
  },
  login: async (data: any) => {
    const response = await apiClient.post('/auth/login', data);
    // Tokens are set as HttpOnly cookies by the proxy — no localStorage storage
    return response.data;
  },
  googleLogin: async (token: string) => {
    const response = await apiClient.post('/auth/google', { credential: token });
    // Tokens are set as HttpOnly cookies by the proxy — no localStorage storage
    return response.data;
  },
  logout: async () => {
    if (typeof window !== 'undefined') {
      try {
        await apiClient.post('/auth/logout/');
      } catch (err) {}
      // Clear any stale data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
};
