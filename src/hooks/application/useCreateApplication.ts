import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApplication } from "../../lib/api/application";

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
