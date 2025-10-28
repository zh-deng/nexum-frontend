import { WorkLocation, Priority, ApplicationStatus } from "../../enums";
import { CompanyDto } from "../company/company.dto";
import { LogItemDto } from "../log-item/log-item.dto";

export type ApplicationDto = {
  id: string;
  jobTitle: string;
  companyId: string;
  company: CompanyDto;
  jobLink?: string;
  jobDescription?: string;
  workLocation: WorkLocation;
  priority: Priority;
  notes?: string;
  favorited?: boolean;
  status: ApplicationStatus;
  fileUrls: string[];
  reminders: string[];
  interviews: string[];
  logItems: LogItemDto[];
  createdAt: string;
  updatedAt: string;
};
