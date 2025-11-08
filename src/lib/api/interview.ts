import {
  GetInterviewParams,
  InterviewDto,
} from "../../types/dtos/interview/interview.dto";
import { UpdateInterviewDto } from "../../types/dtos/interview/update-interview.dto";
import { API_BASE } from "../../utils/environment";

export async function updateInterview(
  id: string,
  data: UpdateInterviewDto,
): Promise<InterviewDto> {
  const res = await fetch(`${API_BASE}/interviews/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Updating interview failed");
  }

  return await res.json();
}

export async function deleteInterview(id: string): Promise<InterviewDto> {
  const res = await fetch(`${API_BASE}/interviews/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Deleting interview failed");
  }

  return await res.json();
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

  const res = await fetch(`${API_BASE}/interviews?${searchParams.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Fetching interviews failed");
  }

  return await res.json();
}
