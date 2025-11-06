import { InterviewDto } from "../../types/dtos/interview/interview.dto";
import { API_BASE } from "../../utils/environment";

export async function getAllInterviews(): Promise<InterviewDto[]> {
  const res = await fetch(`${API_BASE}/interviews`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Fetching interviews failed");
  }

  return await res.json();
}
