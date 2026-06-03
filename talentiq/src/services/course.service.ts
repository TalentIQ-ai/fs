// src/services/course.service.ts
import axiosClient from "@/apis/axios-client";

export interface Course {
  id: number;
  course_id: string | null;
  course_name: string;
  description: string | null;
  platform: string | null;
  category: string | null;
  skills_taught: string | null;
  level: string | null;
  url: string | null;
}

export interface UserCourse {
  id: number;
  courseId: number;
  courseName: string;
  platform: string | null;
  category: string | null;
  level: string | null;
  url: string | null;
  progress: number;
  status: "active" | "completed";
  lastAccessed: string;
  skills: string[];
  recentCheckins: Array<{
    id: number;
    date: string;
    progress: number;
    note: string | null;
    hoursSpent: number;
  }>;
}

export interface RecommendedCourseResponse {
  courseId: number;
  score: number;
  reason: string;
  course: Course | null;
  matchedSkills?: string[];
}

export interface RecommendationResponse {
  targetRole: string;
  missingSkills: string[];
  recommendations: RecommendedCourseResponse[];
  totalCoursesSearched: number;
}

export interface DailyCheckinLog {
  id: number;
  date: string;
  progress: number;
  note: string | null;
  hoursSpent: number;
}

export interface CheckinHistoryResponse {
  userCourse: {
    id: number;
    courseName: string;
    currentProgress: number;
    status: string;
  };
  checkins: DailyCheckinLog[];
  totalCheckins: number;
}

export const getRecommendationsService = async (): Promise<RecommendationResponse> => {
  const response = await axiosClient.get("/courses/recommend");
  return response.data;
};

export const enrollCourseService = async (courseId: number): Promise<any> => {
  const response = await axiosClient.post("/courses/enroll", { courseId });
  return response.data;
};

export const getMyCoursesService = async (): Promise<UserCourse[]> => {
  const response = await axiosClient.get("/courses/my-courses");
  return response.data;
};

export const dailyCheckinService = async (payload: {
  userCourseId: number;
  progress: number;
  note?: string;
  hoursSpent?: number;
}): Promise<any> => {
  const response = await axiosClient.post("/courses/checkin", payload);
  return response.data;
};

export const getCheckinHistoryService = async (
  userCourseId: number
): Promise<CheckinHistoryResponse> => {
  const response = await axiosClient.get(`/courses/${userCourseId}/checkins`);
  return response.data;
};
