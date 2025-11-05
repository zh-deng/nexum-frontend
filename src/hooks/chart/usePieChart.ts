import { useSuspenseQuery } from "@tanstack/react-query";
import { getPieChartData } from "../../lib/api/chart";
import { TimeFrameType } from "../../types/enums";

export const usePieChart = (timeFrame: TimeFrameType) => {
  return useSuspenseQuery({
    queryKey: ["pie-chart", timeFrame],
    queryFn: () => getPieChartData(timeFrame),
  });
};
