import { useSuspenseQuery } from "@tanstack/react-query";
import { getAllInterviews } from "../../lib/api/interview";

export const useInterviews = () => {
  return useSuspenseQuery({
    queryKey: ["interviews"],
    queryFn: () => getAllInterviews(),
  });
};
