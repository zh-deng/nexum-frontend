// Helper to clean out optional fields before submitting to the api

import { LogItemDto } from "../types/dtos/log-item/log-item.dto";
import { ApplicationStatus, Priority } from "../types/enums";

// Recursively remove empty string fields from an object
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

// Format date to "MMM DD, YYYY" or "MMM DD, YYYY, HH:MM AM/PM" for US locale
export function formatDateUs(date: Date, includeTime: boolean = false) {
  return date.toLocaleString(
    "en-US",
    includeTime
      ? {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
  );
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

// Calculate days info string based on log items
export function calculateDays(logItems: LogItemDto[]): {
  additionalInfo: string;
  latestLogSince: string;
  additionalInfoDays: string;
  finished: boolean;
} {
  const finishedStatus = new Set([
    ApplicationStatus.OFFER,
    ApplicationStatus.HIRED,
    ApplicationStatus.DECLINED_OFFER,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ]);
  let additionalInfo = "";
  let additionalInfoDays = "";

  const appliedItem = logItems.find(
    (item) => item.status === ApplicationStatus.APPLIED,
  );

  const finishedItem = logItems.find((item) => finishedStatus.has(item.status));
  const finished = Boolean(finishedItem);

  const totalDays = appliedItem
    ? Math.floor(
        (Date.now() - new Date(appliedItem.date!).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const recentItem =
    logItems.length > 0
      ? [...logItems].sort(
          (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime(),
        )[0]
      : null;

  if (!recentItem) {
    return {
      additionalInfo: "",
      latestLogSince: "",
      additionalInfoDays: "",
      finished: false,
    };
  }

  if (finishedItem && appliedItem) {
    additionalInfo = "App-Duration";
    additionalInfoDays = `${Math.ceil((new Date(finishedItem.date!).getTime() - new Date(appliedItem.date!).getTime()) / (1000 * 60 * 60 * 24))}D`;
  } else if (finishedItem) {
    additionalInfo = "Ended";
  } else {
    additionalInfo =
      recentItem.status === ApplicationStatus.DRAFT ||
      recentItem.status === ApplicationStatus.APPLIED
        ? ""
        : `APPLIED`;
    additionalInfoDays = `${totalDays}D ago`;
  }

  const recentDays = Math.floor(
    (Date.now() - new Date(recentItem.date!).getTime()) / (1000 * 60 * 60 * 24),
  );

  const latestLogSince =
    recentItem.status === ApplicationStatus.DRAFT
      ? ""
      : recentDays < 0
        ? `in ${-recentDays}D`
        : `${recentDays}D ago`;

  return {
    additionalInfo,
    latestLogSince,
    additionalInfoDays,
    finished,
  };
}
// Get available status options based on existing log items
export function getStatusOptions(logItems: LogItemDto[] = []) {
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
  const result = filteredStatusOptions.filter((s) =>
    s === ApplicationStatus.INTERVIEW ? true : !logItemOptions.has(s),
  );

  return result;
}

// Get today's date in "YYYY-MM-DD" format
export const getTodayLocalDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Combine date string "YYYY-MM-DD" with current time if date is today, return ISO string
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

// Get enum key by its value
export function getEnumKeyByValue<T extends Record<string, string | number>>(
  enumObj: T,
  value: T[keyof T],
): keyof T | undefined {
  return Object.keys(enumObj).find(
    (key) => enumObj[key as keyof T] === value,
  ) as keyof T | undefined;
}

// Convert local ISO date-time string to UTC time string "HH:MM"
export function localTimeToUtc(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("de-DE", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Convert local ISO date string to UTC date string "YYYY-MM-DD"
export function localDateToUtc(isoString: string) {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 10);
}

// Convert UTC ISO date-time string to local date and time parts
export function convertUtcToLocalParts(isoUtc: string) {
  const d = new Date(isoUtc); // JS Date = same instant, interpreted in your local TZ
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return {
    localDate: `${year}-${month}-${day}`, // fits <input type="date">
    localTime: `${hours}:${minutes}`, // fits <input type="time">
  };
}

// Get local datetime string "YYYY-MM-DDTHH:MM" for input fields
export function getLocalDatetimeValue(isoString?: string) {
  const now = isoString ? new Date(isoString) : new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Humanize enum label, e.g. "HIGH_PRIORITY" -> "High Priority"
export function humanizeEnumLabel(key: string) {
  if (!key) return "";
  return key
    .toLowerCase()
    .split("_")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}

// Simple email validation
export function validateEmail(email: string): boolean {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return pattern.test(String(email).toLowerCase());
}
