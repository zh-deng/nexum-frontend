import { CreateLogItemDto } from "../../types/dtos/log-item/create-log-item.dto";
import { LogItemDto } from "../../types/dtos/log-item/log-item.dto";
import { UpdateLogItemDto } from "../../types/dtos/log-item/update-log-item.dto";
import { API_BASE } from "../../utils/environment";
import { apiClient } from "../api-client";

export async function createLogItem(
  data: CreateLogItemDto,
): Promise<LogItemDto> {
  return apiClient<LogItemDto>(`/log-items`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLogItem(
  id: string,
  data: UpdateLogItemDto,
): Promise<LogItemDto> {
  return apiClient<LogItemDto>(`/log-items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteLogItem(id: string): Promise<LogItemDto> {
  return apiClient<LogItemDto>(`/log-items/${id}`, {
    method: "DELETE",
  });
}
