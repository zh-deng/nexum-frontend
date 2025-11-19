import { ReminderStatus } from "../../enums";

export type UpdateReminderDto = {
  alarmDate: string;
  status: ReminderStatus;
  message?: string;
};
