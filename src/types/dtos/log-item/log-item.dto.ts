import { ApplicationStatus } from "../../enums";

export type LogItemDto = {
  id: string;
  status: ApplicationStatus;
  notes?: string;
  date?: string;
  applicationId: string;
  createdAt: string;
  updatedAt: string;
};
