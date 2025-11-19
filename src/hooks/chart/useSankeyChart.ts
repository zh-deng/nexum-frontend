import { useQuery } from "@tanstack/react-query";
import { getSankeyChartData } from "../../lib/api/chart";
import { TimeFrameType } from "../../types/enums";

export const useSankesChart = (timeFrame: TimeFrameType) => {
  return useQuery({
    queryKey: ["sankey-chart", timeFrame],
    queryFn: () => getSankeyChartData(timeFrame),
  });
};
