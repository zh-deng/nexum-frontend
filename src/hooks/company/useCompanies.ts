import { useSuspenseQuery } from "@tanstack/react-query";
import { getAllCompanies } from "../../lib/api/company";

export const useCompanies = () => {
  return useSuspenseQuery({
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });
};
