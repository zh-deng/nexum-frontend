import { ApplicationDto } from "../../types/dtos/application/application.dto";
import { CreateApplicationDto } from "../../types/dtos/application/create-application.dto";
import { UpdateApplicationDto } from "../../types/dtos/application/update-application.dto";
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

export async function updateApplication(
  id: string,
  data: UpdateApplicationDto,
): Promise<ApplicationDto> {
  const res = await fetch(`${API_BASE}/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Updating application failed");
  }

  return await res.json();
}

export async function toggleFavorite(id: string): Promise<ApplicationDto> {
  const res = await fetch(`${API_BASE}/applications/${id}/favorite`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Updating favorite failed");
  }

  return await res.json();
}

export async function deleteApplication(id: string): Promise<ApplicationDto> {
  const res = await fetch(`${API_BASE}/applications/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Deleting application failed");
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
