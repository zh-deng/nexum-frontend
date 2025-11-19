import {
  ReminderSortType,
  ReminderStatus,
  ReminderStatusFilter,
} from "../../enums";

export type ReminderDto = {
  id: string;
  alarmDate: string;
  message: string;
  status: ReminderStatus;
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

export type GetReminderParams = {
  sortBy?: ReminderSortType;
  statusFilter?: ReminderStatusFilter;
};
