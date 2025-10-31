// Helper to clean out optional fields before submitting to the api

import { LogItemDto } from "../types/dtos/log-item/log-item.dto";
import { ApplicationStatus, Priority } from "../types/enums";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeEmptyStrings(obj: any): any {
  if (Array.isArray(obj)) {
    return obj; // Return arrays unchanged
  }

  if (typeof obj !== "object" || obj === null) {
    return obj; // Return primitives and null unchanged
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleaned: any = {};

  for (const key in obj) {
    const value = obj[key];

    // Only remove empty strings, keep everything else
    if (value !== "") {
      cleaned[key] =
        typeof value === "object" && value !== null
          ? removeEmptyStrings(value)
          : value;
    }
  }

  return cleaned;
}

export function formatDateUs(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const PriorityLabel: Record<Priority, string> = {
  [Priority.HIGH]: "HIGH",
  [Priority.MEDIUM]: "MEDIUM",
  [Priority.LOW]: "LOW",
};

export const PriorityValue: Record<string, Priority> = {
  HIGH: Priority.HIGH,
  MEDIUM: Priority.MEDIUM,
  LOW: Priority.LOW,
};

export function getPriorityLabel(value: number): string {
  return PriorityLabel[value as Priority] || "MEDIUM";
}

export function getPriorityValue(label: string): number {
  return PriorityValue[label] || Priority.MEDIUM;
}

export function calculateDays(logItems: LogItemDto[]) {
  const finishedStatus = new Set([
    ApplicationStatus.OFFER,
    ApplicationStatus.HIRED,
    ApplicationStatus.DECLINED_OFFER,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ]);

  // const logItemOptions = new Set<ApplicationStatus>(
  // 	logItems.map((item) => item.status)
  // );

  const appliedItem = logItems.find(
    (item) => item.status === ApplicationStatus.APPLIED,
  );

  // const finishedItem = [...finishedStatus].find((s) => logItemOptions.has(s));
  const finishedItem = logItems.find((item) => finishedStatus.has(item.status));

  if (finishedItem && appliedItem) {
    return `Ended ${Math.ceil((new Date(finishedItem.date!).getTime() - new Date(appliedItem.date!).getTime()) / (1000 * 60 * 60 * 24))}D`;
  } else if (finishedItem) {
    return "Ended";
  }

  const totalDays = appliedItem
    ? Math.floor(
        (Date.now() - new Date(appliedItem.date!).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;
  console.log(logItems);
  const recentItem =
    logItems.length > 0
      ? [...logItems].sort(
          (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime(),
        )[0]
      : null;

  if (!recentItem) return "nope";

  if (recentItem.status === ApplicationStatus.APPLIED) {
    return `${totalDays} D`;
  } else if (recentItem.status === ApplicationStatus.DRAFT) {
    return null;
  } else {
    const recentDays = Math.floor(
      (Date.now() - new Date(recentItem.date!).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    return `${recentDays}D ${totalDays ? ` / ${totalDays}D` : ""}`;
  }
}

export function getStatusOptions(logItems: LogItemDto[]) {
  const statusOptions = [
    ApplicationStatus.DRAFT,
    ApplicationStatus.APPLIED,
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.OFFER,
    ApplicationStatus.HIRED,
    ApplicationStatus.DECLINED_OFFER,
    ApplicationStatus.REJECTED,
    ApplicationStatus.GHOSTED,
    ApplicationStatus.WITHDRAWN,
  ];

  const finishedStatus = new Set([
    ApplicationStatus.OFFER,
    ApplicationStatus.HIRED,
    ApplicationStatus.DECLINED_OFFER,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ]);

  const logItemOptions = new Set<ApplicationStatus>(
    logItems.map((item) => item.status),
  );

  // check if contains any finished status
  const hasFinishedInLogs = [...finishedStatus].some((s) =>
    logItemOptions.has(s),
  );

  // remove all finished status if contains one finished status
  const filteredStatusOptions = hasFinishedInLogs
    ? statusOptions.filter((s) => !finishedStatus.has(s))
    : statusOptions;

  // remove status which already have logs
  const result = filteredStatusOptions.filter((s) => !logItemOptions.has(s));

  return result;
}

export const getTodayLocalDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const combineDateWithTime = (dateString: string): string => {
  const [year, month, day] = dateString.split("-").map(Number);
  const isToday = dateString === getTodayLocalDate();
  const now = new Date();

  return new Date(
    year,
    month - 1,
    day,
    isToday ? now.getHours() : 0,
    isToday ? now.getMinutes() : 0,
    isToday ? now.getSeconds() : 0,
    isToday ? now.getMilliseconds() : 0,
  ).toISOString();
};
