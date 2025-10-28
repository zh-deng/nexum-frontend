import { WorkLocation, Priority } from "../../enums";
import { CreateCompanyDto } from "../company/create-company.dto";
import { UpdateCompanyDto } from "../company/update-company.dto";

export type UpdateApplicationDto = {
  id: string;
  jobTitle: string;
  company: CreateCompanyDto | UpdateCompanyDto;
  jobLink?: string;
  jobDescription?: string;
  workLocation?: WorkLocation;
  priority?: Priority;
  notes?: string;
  favorited?: boolean;
  fileUrls: string[];
};
