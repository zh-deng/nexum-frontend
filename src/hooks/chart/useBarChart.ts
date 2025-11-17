import { useQuery } from "@tanstack/react-query";
import { getBarChartData } from "../../lib/api/chart";
import { TimeFrameType } from "../../types/enums";

export const useBarChart = (timeFrame: TimeFrameType) => {
  return useQuery({
    queryKey: ["bar-chart", timeFrame],
    queryFn: () => getBarChartData(timeFrame),
  });
};
