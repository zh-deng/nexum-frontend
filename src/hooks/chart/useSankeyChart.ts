import { useSuspenseQuery } from "@tanstack/react-query";
import { getSankeyChartData } from "../../lib/api/chart";
import { TimeFrameType } from "../../types/enums";

export const useSankesChart = (timeFrame: TimeFrameType) => {
  return useSuspenseQuery({
    queryKey: ["sankey-chart", timeFrame],
    queryFn: () => getSankeyChartData(timeFrame),
  });
};
