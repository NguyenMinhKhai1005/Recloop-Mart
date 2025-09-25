export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7235";
export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload) {
  const res = await fetch(`${API_BASE_URL}/api/Auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function verifyEmail(payload: VerifyEmailPayload) {
  const res = await fetch(`${API_BASE_URL}/api/Auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("OTP verification failed");
  return res.json();
}

export async function resendOtp(payload: ResendOtpPayload) {
  const res = await fetch(`${API_BASE_URL}/api/Auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Resend OTP failed");
  return res.json();
}

export async function login(payload: LoginPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      data = {};
    }

    if (!res.ok) {
      // Trả về object chứa status và message lỗi
      throw { status: res.status, message: data?.message || "Login failed" };
    }

    return data;
  } catch (error) {
    // If it's a network error (fetch failed)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw {
        status: 0,
        message:
          "Cannot connect to server. Please check if the API server is running.",
      };
    }

    // If it's our custom error object, re-throw it
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }

    // For any other error
    throw {
      status: 500,
      message: error instanceof Error ? error.message : "Unknown login error",
    };
  }
}
