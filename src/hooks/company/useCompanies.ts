import { useQuery } from "@tanstack/react-query";
import { getAllCompanies } from "../../lib/api/company";

export const useCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });
};
