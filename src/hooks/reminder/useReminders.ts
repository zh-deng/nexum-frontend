import { useSuspenseQuery } from "@tanstack/react-query";
import { GetReminderParams } from "../../types/dtos/reminder/reminder.dto";
import { getAllReminders } from "../../lib/api/reminder";

export const useReminders = (params?: GetReminderParams) => {
  return useSuspenseQuery({
    queryKey: ["reminders", params],
    queryFn: () => getAllReminders(params),
  });
};
