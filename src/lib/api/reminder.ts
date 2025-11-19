import { CreateReminderDto } from "../../types/dtos/reminder/create-reminder.dto";
import {
  GetReminderParams,
  ReminderDto,
} from "../../types/dtos/reminder/reminder.dto";
import { UpdateReminderDto } from "../../types/dtos/reminder/update-reminder.dto";
import { API_BASE } from "../../utils/environment";

export async function createReminder(
  data: CreateReminderDto,
): Promise<ReminderDto> {
  const res = await fetch(`${API_BASE}/reminders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Creating reminder failed");
  }

  return await res.json();
}

export async function updateReminder(
  id: string,
  data: UpdateReminderDto,
): Promise<ReminderDto> {
  const res = await fetch(`${API_BASE}/reminders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Updating reminder failed");
  }

  return await res.json();
}

export async function deleteReminder(id: string): Promise<ReminderDto> {
  const res = await fetch(`${API_BASE}/reminders/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Deleting reminder failed");
  }

  return await res.json();
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

  const res = await fetch(`${API_BASE}/reminders?${searchParams.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Fetching reminders failed");
  }

  return await res.json();
}
