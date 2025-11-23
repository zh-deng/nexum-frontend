import {
  GetInterviewParams,
  InterviewDto,
} from "../../types/dtos/interview/interview.dto";
import { UpdateInterviewDto } from "../../types/dtos/interview/update-interview.dto";
import { apiClient } from "../api-client";

export async function updateInterview(
  id: string,
  data: UpdateInterviewDto,
): Promise<InterviewDto> {
  return apiClient<InterviewDto>(`/interviews/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteInterview(id: string): Promise<InterviewDto> {
  return apiClient<InterviewDto>(`/interviews/${id}`, {
    method: "DELETE",
  });
}

export async function getAllInterviews(
  params?: GetInterviewParams,
): Promise<InterviewDto[]> {
  const { sortBy, statusFilter } = params || {};

  const searchParams = new URLSearchParams();

  if (sortBy) {
    searchParams.append("sortBy", sortBy);
  }

  if (statusFilter) {
    searchParams.append("statusFilter", statusFilter);
  }

  return apiClient<InterviewDto[]>(`/interviews?${searchParams.toString()}`, {
    method: "GET",
  });
}
