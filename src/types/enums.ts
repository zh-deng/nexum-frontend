export enum Priority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  DECLINED_OFFER = "DECLINED_OFFER",
  DRAFT = "DRAFT",
  GHOSTED = "GHOSTED",
  HIRED = "HIRED",
  INTERVIEW = "INTERVIEW",
  OFFER = "OFFER",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export enum WorkLocation {
  ON_SITE = "ON_SITE",
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
  UNSURE = "UNSURE",
}

export enum SortType {
  DATE_NEW = "DATE_NEW",
  DATE_OLD = "DATE_OLD",
  ALPHABETICAL_TITLE = "ALPHABETICAL_TITLE",
  ALPHABETICAL_COMPANY = "ALPHABETICAL_COMPANY",
  PRIORITY = "PRIORITY",
}

export enum TimeFrameType {
  PAST_MONTH = "1M",
  PAST_3_MONTHS = "3M",
  PAST_6_MONTHS = "6M",
  PAST_12_MONTHS = "1Y",
  THIS_YEAR = "Ytd",
  ALL_TIME = "All",
}

export enum InterviewStatus {
  UPCOMING = "UPCOMING",
  DONE = "DONE",
}

export enum InterviewSortType {
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
}

export enum InterviewStatusFilter {
  UPCOMING = "UPCOMING",
  DONE = "DONE",
  ALL = "ALL",
}

export enum ReminderStatus {
  ACTIVE = "ACTIVE",
  STOPPED = "STOPPED",
  DONE = "DONE",
}

export enum ReminderSortType {
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
}

export enum ReminderStatusFilter {
  ACTIVE = "ACTIVE",
  STOPPED = "STOPPED",
  DONE = "DONE",
  ALL = "ALL",
}

export enum ChartStyle {
  PIE_CHART = "PIE_CHART",
  BAR_CHART = "BAR_CHART",
  SANKEY_CHART = "SANKEY_CHART",
}
