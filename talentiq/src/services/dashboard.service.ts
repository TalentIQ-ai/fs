// talentiq/src/services/dashboard.service.ts
import axiosClient from "@/apis/axios-client";

export interface PrioritySkill {
  id: number;
  name: string;
  relevance: number;
  reason: string | null;
  color?: string;
  bg?: string;
}

export interface RoadmapStep {
  id: number;
  userId: number;
  title: string;
  status: string;
  duration: string;
  progress: number;
  order: number;
}

export interface ActiveCourse {
  id: number;
  title: string;
  platform: string;
  category: string;
  duration: string;
  rating: number;
  progress: number;
  lastAccessed: string;
}

export interface RecommendedCourse {
  id: number;
  title: string;
  platform: string;
  category: string;
  duration: string;
  rating: number;
  badge: string | null;
}

export interface DashboardSummary {
  user: {
    name: string;
    fullName: string;
  };
  lastUpdated: string;
  readinessScore: number;
  targetRole: string;
  ownedSkills: string[];
  neededSkills: string[];
  prioritySkills: PrioritySkill[];
  roadmap: RoadmapStep[];
  activeCourses: ActiveCourse[];
  recommendedCourses: RecommendedCourse[];
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  return axiosClient.get("/dashboard/summary");
};
