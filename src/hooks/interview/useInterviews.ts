import { useQuery } from "@tanstack/react-query";
import { getAllInterviews } from "../../lib/api/interview";
import { GetInterviewParams } from "../../types/dtos/interview/interview.dto";

export const useInterviews = (params?: GetInterviewParams) => {
  return useQuery({
    queryKey: ["interviews", params],
    queryFn: () => getAllInterviews(params),
  });
};
