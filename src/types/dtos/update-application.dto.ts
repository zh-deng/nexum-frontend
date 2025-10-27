import { WorkLocation, Priority, ApplicationStatus } from "../enums";
import { CreateCompanyDto } from "./create-company.dto";
import { UpdateCompanyDto } from "./update-company.dto";

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
  status?: ApplicationStatus;
  fileUrls: string[];
};
