import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateReminderDto } from "../../types/dtos/reminder/update-reminder.dto";
import { updateReminder } from "../../lib/api/reminder";

export const useUpdateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReminderDto }) =>
      updateReminder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
};
