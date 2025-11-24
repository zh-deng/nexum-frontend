import {
  ApplicationDto,
  GetApplicationsParams,
  PaginatedApplicationsResponse,
} from "../../types/dtos/application/application.dto";
import { CreateApplicationDto } from "../../types/dtos/application/create-application.dto";
import { UpdateApplicationDto } from "../../types/dtos/application/update-application.dto";
import { apiClient } from "../api-client";

export async function createApplication(
  data: CreateApplicationDto,
): Promise<ApplicationDto> {
  return apiClient<ApplicationDto>("/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateApplication(
  id: string,
  data: UpdateApplicationDto,
): Promise<ApplicationDto> {
  return apiClient<ApplicationDto>(`/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function toggleFavorite(id: string): Promise<ApplicationDto> {
  return apiClient<ApplicationDto>(`/applications/${id}/toggle-favorite`, {
    method: "PATCH",
  });
}

export async function deleteApplication(id: string): Promise<ApplicationDto> {
  return apiClient<ApplicationDto>(`/applications/${id}`, {
    method: "DELETE",
  });
}

export async function getAllApplications(
  params?: GetApplicationsParams,
): Promise<PaginatedApplicationsResponse> {
  const { page = 1, limit = 20, searchQuery, status, sortBy } = params || {};

  const searchParams = new URLSearchParams();

  // Always add page and limit (with defaults)
  searchParams.append("page", page.toString());
  searchParams.append("limit", limit.toString());

  if (searchQuery?.trim()) {
    searchParams.append("q", searchQuery);
  }
  if (status) {
    searchParams.append("status", status);
  }

  if (sortBy) {
    searchParams.append("sortBy", sortBy);
  }

  return apiClient<PaginatedApplicationsResponse>(
    `/applications?${searchParams.toString()}`,
    {
      method: "GET",
    },
  );
}
