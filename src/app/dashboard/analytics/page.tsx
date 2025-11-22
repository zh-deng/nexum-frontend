"use client";

import { Box, Flex, RadioCards, Text } from "@radix-ui/themes";
import PieChart from "../../../components/PieChart/PieChart";
import "./analytics.scss";
import { useState } from "react";
import BarChart from "../../../components/BarChart/BarChart";
import SankeyChart from "../../../components/SankeyChart/SankeyChart";
import { usePieChart } from "../../../hooks/chart/usePieChart";
import Dropdown from "../../../components/Dropdown/Dropdown";
import { ChartStyle, TimeFrameType } from "../../../types/enums";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { useBarChart } from "../../../hooks/chart/useBarChart";
import { useSankesChart } from "../../../hooks/chart/useSankeyChart";
import QueryState from "../../../components/QueryState/QueryState";

const AnalyticsPage = () => {
  const chartFallback = <Text weight={"bold"}>No Data Yet</Text>;

  const [chartStyle, setChartStyle] = useState<ChartStyle>(
    ChartStyle.PIE_CHART,
  );
  const [timeFrame, setTimeFrame] = useState<TimeFrameType>(
    TimeFrameType.PAST_MONTH,
  );

  const timeFrameOptions = Object.values(TimeFrameType).filter(
    (option) => option !== timeFrame,
  );

  const { isSm, isMd, isLg } = useBreakpoint();
  const {
    data: pieChartData,
    isPending: piePending,
    error: pieError,
  } = usePieChart(timeFrame);
  const {
    data: barChartData,
    isPending: barPending,
    error: barError,
  } = useBarChart(timeFrame);
  const {
    data: sankeyChartData,
    isPending: sankeyPending,
    error: sankeyError,
  } = useSankesChart(timeFrame);

  // Prepare chart configurations
  const charts = {
    [ChartStyle.PIE_CHART]: {
      data: pieChartData,
      isPending: piePending,
      error: pieError,
      isEmpty:
        !pieChartData || Object.values(pieChartData).every((n) => n === 0),
      element: (
        <PieChart
          pieChartData={pieChartData!}
          width={isLg ? 600 : isSm ? 500 : 300}
          height={isLg ? 500 : isSm ? 400 : 250}
        />
      ),
    },
    [ChartStyle.BAR_CHART]: {
      data: barChartData,
      isPending: barPending,
      error: barError,
      isEmpty: !barChartData || barChartData[0].total === 0,
      element: (
        <BarChart
          barChartData={barChartData!}
          width={isLg ? 800 : isMd ? 650 : isSm ? 450 : 300}
          height={isLg ? 500 : isSm ? 400 : 250}
        />
      ),
    },
    [ChartStyle.SANKEY_CHART]: {
      data: sankeyChartData,
      isPending: sankeyPending,
      error: sankeyError,
      isEmpty:
        !sankeyChartData ||
        (sankeyChartData.nodes.length === 0 &&
          sankeyChartData.links.length === 0),
      element: <SankeyChart sankeyChartData={sankeyChartData!} />,
    },
  };

  const config = charts[chartStyle];
  const { isPending, error } = config;
  const chart = config.isEmpty ? chartFallback : config.element;

  return (
    <QueryState isPending={isPending} error={error}>
      <div className="analytics-page">
        <div className="chart-selector">
          <Box maxWidth={"480px"} width={"100%"}>
            <RadioCards.Root
              defaultValue={ChartStyle.PIE_CHART}
              columns={{ initial: "1", sm: "3" }}
              size={"1"}
              onValueChange={(value) => setChartStyle(value as ChartStyle)}
            >
              <RadioCards.Item value={ChartStyle.PIE_CHART}>
                <Text weight="bold" align={"center"}>
                  Pie Chart
                </Text>
              </RadioCards.Item>
              <RadioCards.Item value={ChartStyle.BAR_CHART}>
                <Text weight="bold" align={"center"}>
                  Bar Chart
                </Text>
              </RadioCards.Item>
              <RadioCards.Item value={ChartStyle.SANKEY_CHART}>
                <Text weight="bold" align={"center"}>
                  Sankey Chart
                </Text>
              </RadioCards.Item>
            </RadioCards.Root>
          </Box>
        </div>
        <div className="timeframe-dropdown">
          <Dropdown
            name={timeFrame}
            options={timeFrameOptions}
            onChange={(selected) => setTimeFrame(selected as TimeFrameType)}
          />
        </div>
        <div className="chart">{chart}</div>
      </div>
    </QueryState>
  );
};

export default AnalyticsPage;
