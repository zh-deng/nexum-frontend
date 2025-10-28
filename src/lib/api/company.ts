import { CompanyDto } from "../../types/dtos/company/company.dto";
import { API_BASE } from "../../utils/environment";

export async function getAllCompanies(): Promise<CompanyDto[]> {
  const res = await fetch(`${API_BASE}/companies`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Fetching companies failed");
  }

  return await res.json();
}
