import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLogItem } from "../../lib/api/log-items";

export const useCreateLogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLogItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
