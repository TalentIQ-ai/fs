// talentiq/src/services/auth.service.ts
import axiosClient from "@/apis/axios-client";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string; // ← ditambahkan agar match dengan form register
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

// ── Helper: simpan & hapus token ──────────────────────────────────────────────
export const saveToken = (token: string, user: AuthUser) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem("token");
};

// ── API Calls ─────────────────────────────────────────────────────────────────
export const registerUser = async (data: RegisterPayload): Promise<AuthResponse> => {
  return axiosClient.post("/auth/register", data);
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  return axiosClient.post("/auth/login", data);
};

// ← nama fungsi difix: forgotPasswordService (sesuai yang dipakai di halaman)
export const forgotPasswordService = async (email: string): Promise<{ message: string }> => {
  return axiosClient.post("/auth/forgot-password", { email });
};

export const resetPasswordService = async (data: {
  token: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ message: string }> => {
  return axiosClient.post("/auth/reset-password", data);
};

export const getProfile = async (): Promise<{ user: AuthUser }> => {
  return axiosClient.get("/auth/me");
};