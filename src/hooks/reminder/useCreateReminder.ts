import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReminder } from "../../lib/api/reminder";

export const useCreateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
};
