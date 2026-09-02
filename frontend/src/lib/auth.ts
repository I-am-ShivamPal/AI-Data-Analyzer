import { api } from "./api";

// ── Types mapping to FastAPI backend schemas ──

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface ForgotPasswordRequest {
  contact: string;
}

export interface ForgotPasswordResponse {
  message: string;
  challenge_id?: string;
}

export interface VerifyOTPRequest {
  challenge_id: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  reset_token: string;
}

export interface ResendOTPRequest {
  challenge_id: string;
}

export interface ResetPasswordRequest {
  reset_token: string;
  new_password: string;
  confirm_password: string;
}

// ── Auth Service Methods ──

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<UserResponse> {
    return api.post<UserResponse>("/api/auth/register", data);
  },

  /**
   * Authenticate and set HttpOnly session cookie
   */
  async login(data: LoginRequest): Promise<{ message: string }> {
    return api.post<{ message: string }>("/api/auth/login", data);
  },

  /**
   * Revoke session and clear cookie
   */
  async logout(): Promise<{ message: string }> {
    return api.post<{ message: string }>("/api/auth/logout", {});
  },

  /**
   * Get the currently authenticated user
   */
  async getCurrentUser(): Promise<UserResponse> {
    return api.get<UserResponse>("/api/auth/me");
  },

  /**
   * Initiate password reset flow
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return api.post<ForgotPasswordResponse>("/api/auth/forgot-password", data);
  },

  /**
   * Verify OTP to get reset authorization token
   */
  async verifyResetOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    return api.post<VerifyOTPResponse>("/api/auth/verify-reset-otp", data);
  },

  /**
   * Resend verification code
   */
  async resendResetOTP(data: ResendOTPRequest): Promise<{ message: string }> {
    return api.post<{ message: string }>("/api/auth/resend-reset-otp", data);
  },

  /**
   * Reset password using token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return api.post<{ message: string }>("/api/auth/reset-password", data);
  }
};
