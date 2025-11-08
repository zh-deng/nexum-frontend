import {
  InterviewSortType,
  InterviewStatus,
  InterviewStatusFilter,
} from "../../enums";

export type InterviewDto = {
  id: string;
  date: string;
  notes: string;
  status: InterviewStatus;
  applicationId: string;
  application: {
    jobTitle: string;
    company: {
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
};

export type GetInterviewParams = {
  sortBy?: InterviewSortType;
  statusFilter?: InterviewStatusFilter;
};
