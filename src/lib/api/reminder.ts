import { CreateReminderDto } from "../../types/dtos/reminder/create-reminder.dto";
import {
  GetReminderParams,
  ReminderDto,
} from "../../types/dtos/reminder/reminder.dto";
import { UpdateReminderDto } from "../../types/dtos/reminder/update-reminder.dto";
import { API_BASE } from "../../utils/environment";
import { apiClient } from "../api-client";

export async function createReminder(
  data: CreateReminderDto,
): Promise<ReminderDto> {
  return apiClient<ReminderDto>(`/reminders`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateReminder(
  id: string,
  data: UpdateReminderDto,
): Promise<ReminderDto> {
  return apiClient<ReminderDto>(`/reminders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteReminder(id: string): Promise<ReminderDto> {
  return apiClient<ReminderDto>(`/reminders/${id}`, {
    method: "DELETE",
  });
}

export async function getAllReminders(
  params?: GetReminderParams,
): Promise<ReminderDto[]> {
  const { sortBy, statusFilter } = params || {};

  const searchParams = new URLSearchParams();

  if (sortBy) {
    searchParams.append("sortBy", sortBy);
  }

  if (statusFilter) {
    searchParams.append("statusFilter", statusFilter);
  }

  return apiClient<ReminderDto[]>(`/reminders?${searchParams.toString()}`, {
    method: "GET",
  });
}
