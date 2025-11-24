import { CompanyDto } from "../../types/dtos/company/company.dto";
import { apiClient } from "../api-client";

export async function getAllCompanies(): Promise<CompanyDto[]> {
  return apiClient<CompanyDto[]>("/companies", {
    method: "GET",
  });
}
