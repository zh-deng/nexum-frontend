import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "../../lib/api/application";

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
};
