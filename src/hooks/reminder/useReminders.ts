import { useQuery } from "@tanstack/react-query";
import { GetReminderParams } from "../../types/dtos/reminder/reminder.dto";
import { getAllReminders } from "../../lib/api/reminder";

export const useReminders = (params?: GetReminderParams) => {
  return useQuery({
    queryKey: ["reminders", params],
    queryFn: () => getAllReminders(params),
  });
};
