import { ApplicationStatus, Priority, WorkLocation } from "../enums";

export type ApplicationDto = {
  id: string;
  jobTitle: string;
  companyId: string;
  company: {
    id: string;
    name: string;
    website?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    industry?: string;
    companySize?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    notes?: string;
    logoUrl?: string;
  };
  jobLink?: string;
  jobDescription?: string;
  workLocation: WorkLocation;
  priority: Priority;
  notes?: string;
  status: ApplicationStatus;
  fileUrls: string[];
  reminders: string[];
  interviews: string[];
  logItems: string[];
  createdAt: string;
  updatedAt: string;
};
