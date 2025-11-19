import { useQuery } from "@tanstack/react-query";
import { getAllApplications } from "../../lib/api/application";
import { GetApplicationsParams } from "../../types/dtos/application/application.dto";

export const useApplications = (params?: GetApplicationsParams) => {
  return useQuery({
    queryKey: ["applications", params],
    queryFn: () => getAllApplications(params),
  });
};
