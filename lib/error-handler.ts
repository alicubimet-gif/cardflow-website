function cleanErrorMessage(msg: string): string {
  if (!msg || typeof msg !== "string") return "Something went wrong. Please try again.";
  const m = msg.toLowerCase();

  // Authentication Errors mapping
  if (m.includes("incorrect old password")) {
    return "Incorrect old password.";
  }
  if (m.includes("incorrect password") || m.includes("invalid password") || m.includes("invalid email/phone or password") || m.includes("incorrect email or password")) {
    return "Incorrect email or password.";
  }
  if (m.includes("no account found") || m.includes("user not found") || m.includes("no active user found") || m.includes("account_not_found")) {
    return "No account found with this email address.";
  }
  if (m.includes("already exists") || m.includes("already registered") || m.includes("already taken") || m.includes("has already been taken")) {
    if (m.includes("email")) {
      return "An account already exists with this email. Please sign in or use another email address.";
    }
  }
  if (m.includes("otp has expired") || m.includes("verification code has expired") || m.includes("otp_expired")) {
    return "Your verification code has expired. Please request a new code.";
  }
  if (m.includes("invalid otp") || m.includes("incorrect otp") || m.includes("invalid verification code")) {
    return "The verification code you entered is incorrect.";
  }
  if (m.includes("session has expired") || m.includes("session_expired") || m.includes("expired token")) {
    return "Your session has expired. Please sign in again.";
  }
  if (m.includes("google login failed") || m.includes("google sign in") || m.includes("google token") || m.includes("google email verification")) {
    return "Unable to complete Google sign in. Please try again.";
  }

  // Payment Errors
  if (m.includes("payment failed") || m.includes("unable to complete payment")) {
    return "Unable to complete payment.";
  }
  if (m.includes("payment cancelled") || m.includes("cancelled")) {
    return "Your payment was cancelled.";
  }
  if (m.includes("verification failed") || m.includes("webhook")) {
    return "Payment verification failed.";
  }

  // Pricing
  if (m.includes("pricing") || m.includes("packages") || m.includes("pricing plans")) {
    return "Unable to load pricing plans. Please try again later.";
  }

  // Network / Server checks
  if (m.includes("network error") || m.includes("internet connection") || m.includes("network connection") || m.includes("err_network")) {
    return "No Internet Connection. Please check your network connection.";
  }
  if (m.includes("timeout") || m.includes("timed out") || m.includes("econnaborted")) {
    return "Request Timeout. Please refresh and try again.";
  }
  if (m.includes("unavailable") || m.includes("server unavailable") || m.includes("503") || m.includes("502")) {
    return "Server Unavailable. Please try again in a few minutes.";
  }

  // Remove traceback or technical details leakage
  if (m.includes("traceback") || m.includes("exception") || m.includes("validationerror") || m.includes("errordetail") || m.includes("sql") || m.includes("database") || m.includes("internal server error") || m.includes("axioserror")) {
    return "Something went wrong. Please try again.";
  }

  return msg;
}

function cleanValidationMessage(field: string, msg: string): string {
  const f = field.toLowerCase();
  const m = msg.toLowerCase();

  // Name Required
  if (f === "name" && (m.includes("required") || m.includes("blank") || m.includes("empty"))) {
    return "Please enter your full name.";
  }
  // Email Required & Invalid Email
  if (f === "email") {
    if (m.includes("required") || m.includes("blank") || m.includes("empty")) {
      return "Please enter your email address.";
    }
    if (m.includes("invalid") || m.includes("valid email")) {
      return "Please enter a valid email address.";
    }
  }
  // Phone Required
  if (f === "phone" && (m.includes("required") || m.includes("blank") || m.includes("empty"))) {
    return "Please enter your phone number.";
  }
  // Password Required
  if (f === "password" && (m.includes("required") || m.includes("blank") || m.includes("empty"))) {
    return "Please enter your password.";
  }
  // Confirm Password
  if ((f.includes("confirm") || f.includes("match")) && m.includes("match")) {
    return "Passwords do not match.";
  }
  
  // Weak Password complexity
  if (f === "password" && (m.includes("character") || m.includes("uppercase") || m.includes("lowercase") || m.includes("digit") || m.includes("special") || m.includes("complexity"))) {
    return "Password must contain:\n\n• 8+ characters\n• Uppercase letter\n• Lowercase letter\n• Number\n• Special character";
  }

  // Already exists
  if (m.includes("already exists") || m.includes("already registered") || m.includes("taken") || m.includes("has already been taken")) {
    if (f === "email" || m.includes("email")) {
      return "An account already exists with this email. Please sign in or use another email address.";
    }
  }

  return msg;
}

export function getErrorMessage(error: any): string {
  if (!error) return "Something went wrong. Please try again.";

  if (error.friendlyMessage) return cleanErrorMessage(error.friendlyMessage);
  if (error.message && error.message !== "Something went wrong" && typeof error.message === "string" && !error.message.includes("[object")) {
    return cleanErrorMessage(error.message);
  }

  let rawMessage = "";
  let status = 0;

  if (error.response) {
    status = error.response.status;
    const data = error.response.data;
    if (data && typeof data === "object") {
      if (data.message) rawMessage = data.message;
      else if (data.detail) rawMessage = data.detail;
      else if (data.error) rawMessage = data.error;
    }
  } else if (error.data) {
    status = error.status || 0;
    const data = error.data;
    if (data && typeof data === "object") {
      if (data.message) rawMessage = data.message;
      else if (data.detail) rawMessage = data.detail;
      else if (data.error) rawMessage = data.error;
    }
  }

  if (!rawMessage && error.message && typeof error.message === "string") {
    rawMessage = error.message;
  }

  if (rawMessage) {
    return cleanErrorMessage(rawMessage);
  }

  // Fallbacks based on HTTP status code
  if (status) {
    switch (status) {
      case 400:
        return "Please correct the highlighted fields.";
      case 401:
        return "Incorrect email or password.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "Requested data was not found.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  return "Something went wrong. Please try again.";
}

export function formatValidationErrors(error: any): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!error) return errors;

  let rawErrors: any = null;
  if (error.fieldErrors) {
    rawErrors = error.fieldErrors;
  } else if (error.response?.data?.errors) {
    rawErrors = error.response.data.errors;
  } else if (error.response?.data?.detail) {
    rawErrors = { non_field_errors: [error.response.data.detail] };
  } else if (error.response?.data && typeof error.response.data === "object") {
    rawErrors = error.response.data;
  } else if (error.data && typeof error.data === "object") {
    rawErrors = error.data;
  }

  if (rawErrors && typeof rawErrors === "object") {
    for (const [field, value] of Object.entries(rawErrors)) {
      if (field === "success" || field === "message" || field === "code") continue;
      const valStr = Array.isArray(value) ? value[0] : String(value);
      errors[field] = cleanValidationMessage(field, valStr);
    }
  }

  return errors;
}
