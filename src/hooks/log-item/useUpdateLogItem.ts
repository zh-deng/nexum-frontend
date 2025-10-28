import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLogItem } from "../../lib/api/log-items";
import { UpdateLogItemDto } from "../../types/dtos/log-item/update-log-item.dto";

export const useUpdateLogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLogItemDto }) =>
      updateLogItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
