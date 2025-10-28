import { CreateLogItemDto } from "../../types/dtos/log-item/create-log-item.dto";
import { LogItemDto } from "../../types/dtos/log-item/log-item.dto";
import { UpdateLogItemDto } from "../../types/dtos/log-item/update-log-item.dto";
import { API_BASE } from "../../utils/environment";

export async function createLogItem(
  data: CreateLogItemDto,
): Promise<LogItemDto> {
  const res = await fetch(`${API_BASE}/log-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Creating log item failed");
  }

  return await res.json();
}

export async function updateLogItem(
  id: string,
  data: UpdateLogItemDto,
): Promise<LogItemDto> {
  const res = await fetch(`${API_BASE}/log-items/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Updating log item failed");
  }

  return await res.json();
}

export async function deleteLogItem(id: string): Promise<LogItemDto> {
  const res = await fetch(`${API_BASE}/log-items/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Deleting log item failed");
  }

  return await res.json();
}
