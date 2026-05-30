// talentiq/src/services/profile.service.ts
import axiosClient from "@/apis/axios-client";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: number;
  userId: number;
  targetRole: string | null;
  experienceLevel: string | null;
  skills: string[];
  avatarUrl: string | null;
  activeCourses: number;
  completedCourses: number;
  totalHours: number;
  streakDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  profile: UserProfile | null;
}

export interface UpdateProfilePayload {
  name: string;
  targetRole?: string;
  experienceLevel?: string;
  skills?: string[];
  avatarUrl?: string;
}

export interface UpdateStatsPayload {
  activeCourses?: number;
  completedCourses?: number;
  totalHours?: number;
  streakDays?: number;
}

// ── API Calls ─────────────────────────────────────────────────────────────────

// GET /api/profile — ambil data profil user yang sedang login
export const getProfileService = async (): Promise<{ user: UserWithProfile }> => {
  return axiosClient.get("/profile");
};

// PUT /api/profile — update nama, targetRole, skills, dll
export const updateProfileService = async (
  data: UpdateProfilePayload
): Promise<{ message: string; user: UserWithProfile }> => {
  return axiosClient.put("/profile", data);
};

// PATCH /api/profile/stats — update stats kursus
export const updateStatsService = async (
  data: UpdateStatsPayload
): Promise<{ message: string; profile: UserProfile }> => {
  return axiosClient.patch("/profile/stats", data);
};