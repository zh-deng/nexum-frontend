import { useSuspenseQuery } from "@tanstack/react-query";
import { getAllApplications } from "../../lib/api/application";

export const useApplications = () => {
  return useSuspenseQuery({
    queryKey: ["applications"],
    queryFn: getAllApplications,
  });
};
