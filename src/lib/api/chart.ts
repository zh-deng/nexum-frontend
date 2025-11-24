import {
  BarChartData,
  PieChartData,
  SankeyChartData,
} from "../../types/dtos/chart.dto";
import { TimeFrameType } from "../../types/enums";
import { getEnumKeyByValue } from "../../utils/helper";
import { apiClient } from "../api-client";

export async function getPieChartData(
  timeFrame: TimeFrameType,
): Promise<PieChartData> {
  const convertedTimeFrame = getEnumKeyByValue(TimeFrameType, timeFrame);

  return apiClient<PieChartData>(`/charts/pie/${convertedTimeFrame}`, {
    method: "GET",
  });
}

export async function getBarChartData(
  timeFrame: TimeFrameType,
): Promise<BarChartData> {
  const convertedTimeFrame = getEnumKeyByValue(TimeFrameType, timeFrame);

  return apiClient<BarChartData>(`/charts/bar/${convertedTimeFrame}`, {
    method: "GET",
  });
}

export async function getSankeyChartData(
  timeFrame: TimeFrameType,
): Promise<SankeyChartData> {
  const convertedTimeFrame = getEnumKeyByValue(TimeFrameType, timeFrame);

  return apiClient<SankeyChartData>(`/charts/sankey/${convertedTimeFrame}`, {
    method: "GET",
  });
}
