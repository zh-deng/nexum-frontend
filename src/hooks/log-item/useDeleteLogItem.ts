import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLogItem } from "../../lib/api/log-items";

export const useDeleteLogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLogItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
};
