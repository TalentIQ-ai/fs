import axiosClient from "@/apis/axios-client";

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
}

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
