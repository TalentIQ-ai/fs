import axiosClient from "@/apis/axios-client";
import axios from "axios";

export interface JobVacancy {
  id: number;
  role: string;
  companyName: string;
  accentColor: string;
  city: string;
  workMode: string;
  income: string;
  compatibility: number;
  matchedStacks: string[];
  missingStacks: string[];
  url?: string;
}

export interface PublicJob {
  id: number;
  title: string;
  company: string;
  location: string;
  workType: string;
  salary: string;
  tags: string[];
  logoInitials: string;
  logoColor: string;
  postedAt: string;
  url: string | null;
}

export interface PublicJobsResponse {
  data: PublicJob[];
  total: number;
  page: number;
  totalPages: number;
}

export const getPublicJobs = async (params: {
  keyword?: string;
  location?: string;
  workType?: string;
  page?: number;
  pageSize?: number;
}): Promise<PublicJobsResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.keyword)  query.append("keyword",  params.keyword);
    if (params.location) query.append("location", params.location);
    if (params.workType) query.append("workType", params.workType);
    if (params.page)     query.append("page",     String(params.page));
    if (params.pageSize) query.append("pageSize", String(params.pageSize));

    // Use plain axios (no auth header needed) to public endpoint
    const baseURL = import.meta.env.VITE_API_URL as string;
    const res = await axios.get(`${baseURL}/jobs/public?${query.toString()}`);
    return res.data as PublicJobsResponse;
  } catch (error) {
    console.error("Error fetching public jobs:", error);
    throw error;
  }
};

export const getJobs = async (category?: string, keyword?: string): Promise<JobVacancy[]> => {
  try {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (keyword) params.append("keyword", keyword);

    const res: any = await axiosClient.get(`/jobs?${params.toString()}`);
    return res.data || [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
