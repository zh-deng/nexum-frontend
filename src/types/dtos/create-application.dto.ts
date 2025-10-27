import { ApplicationStatus, Priority, WorkLocation } from "../enums";
import { CreateCompanyDto } from "./create-company.dto";
import { UpdateCompanyDto } from "./update-company.dto";

export type CreateApplicationDto = {
  jobTitle: string;
  company: CreateCompanyDto | UpdateCompanyDto;
  jobLink?: string;
  jobDescription?: string;
  workLocation?: WorkLocation;
  priority?: Priority;
  notes?: string;
  favorited?: boolean;
  status?: ApplicationStatus;
  logItemDate: string;
  fileUrls: string[];
};
