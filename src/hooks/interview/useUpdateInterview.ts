import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateInterviewDto } from "../../types/dtos/interview/update-interview.dto";
import { updateInterview } from "../../lib/api/interview";

export const useUpdateInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInterviewDto }) =>
      updateInterview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
