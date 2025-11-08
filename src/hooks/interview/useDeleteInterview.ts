import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInterview } from "../../lib/api/interview";

export const useDeleteInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
