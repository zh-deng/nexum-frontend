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
  PAST_MONTH = "Past Month",
  PAST_3_MONTHS = "Past 3 Months",
  PAST_6_MONTHS = "Past 6 Months",
  PAST_12_MONTHS = "Past 12 Months",
  THIS_YEAR = "This Year",
  ALL_TIME = "All Time",
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
