import { ApplicationDto } from "../../types/dtos/application.dto";
import { CreateApplicationDto } from "../../types/dtos/create-application.dto";
import { API_BASE } from "../../utils/environment";

export async function createApplication(
  data: CreateApplicationDto,
): Promise<ApplicationDto> {
  const res = await fetch(`${API_BASE}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Creating application failed");
  }

  return await res.json();
}

export async function getAllApplications(): Promise<ApplicationDto[]> {
  const res = await fetch(`${API_BASE}/applications`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Fetching applications failed");
  }

  return await res.json();
}
