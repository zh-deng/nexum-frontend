import {
  WorkLocation,
  Priority,
  ApplicationStatus,
  SortType,
} from "../../enums";
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

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type PaginatedApplicationsResponse = {
  data: ApplicationDto[];
  pagination: Pagination;
};

export type GetApplicationsParams = {
  searchQuery?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: SortType;
};

export type ExtractJobInfoDto = {
  jobLink?: string;
  jobDescription?: string;
};
