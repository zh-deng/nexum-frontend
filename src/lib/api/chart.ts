import {
  BarChartData,
  PieChartData,
  SankeyChartData,
} from "../../types/dtos/chart.dto";
import { TimeFrameType } from "../../types/enums";
import { API_BASE } from "../../utils/environment";
import { getEnumKeyByValue } from "../../utils/helper";

export async function getPieChartData(
  timeFrame: TimeFrameType,
): Promise<PieChartData> {
  const convertedTimeFrame = getEnumKeyByValue(TimeFrameType, timeFrame);

  const res = await fetch(`${API_BASE}/charts/pie/${convertedTimeFrame}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Fetching pie chart data failed");
  }

  return await res.json();
}

export async function getBarChartData(
  timeFrame: TimeFrameType,
): Promise<BarChartData> {
  const convertedTimeFrame = getEnumKeyByValue(TimeFrameType, timeFrame);

  const res = await fetch(`${API_BASE}/charts/bar/${convertedTimeFrame}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Fetching bar chart data failed");
  }

  return await res.json();
}

export async function getSankeyChartData(
  timeFrame: TimeFrameType,
): Promise<SankeyChartData> {
  const convertedTimeFrame = getEnumKeyByValue(TimeFrameType, timeFrame);

  const res = await fetch(`${API_BASE}/charts/sankey/${convertedTimeFrame}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Fetching sankey chart data failed");
  }

  return await res.json();
}
