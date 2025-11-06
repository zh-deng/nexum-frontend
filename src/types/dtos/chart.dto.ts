type PieChartData = {
  appliedCount: number;
  interviewCount: number;
  ghostedCount: number;
  offerCount: number;
  hiredCount: number;
  declinedCount: number;
  rejectedCount: number;
  withdrawnCount: number;
};

type BarChartData = {
  period: string;
  APPLIED: number;
  INTERVIEW: number;
  OFFER: number;
  HIRED: number;
  DECLINED_OFFER: number;
  REJECTED: number;
  GHOSTED: number;
  WITHDRAWN: number;
  total: number;
}[];

type SankeyChartData = {
  nodes: {
    name: string;
    category?: string;
  }[];
  links: {
    source: string;
    target: string;
    value: number;
  }[];
};
