import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReminder } from "../../lib/api/reminder";

export const useDeleteReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
};
