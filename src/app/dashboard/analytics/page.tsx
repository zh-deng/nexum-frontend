"use client";

import { Box, Flex, RadioCards, Text } from "@radix-ui/themes";
import PieChart, { PieData } from "../../../components/PieChart/PieChart";
import "./analytics.scss";
import { useState } from "react";
import BarChart from "../../../components/BarChart/BarChart";
import SankeyChart from "../../../components/SankeyChart/SankeyChart";
import { usePieChart } from "../../../hooks/chart/usePieChart";
import Dropdown from "../../../components/Dropdown/Dropdown";
import { TimeFrameType } from "../../../types/enums";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { useBarChart } from "../../../hooks/chart/useBarChart";
import { useSankesChart } from "../../../hooks/chart/useSankeyChart";
import QueryState from "../../../components/QueryState/QueryState";

const AnalyticsPage = () => {
  const [chartStyle, setChartStyle] = useState<string>("pie-chart");
  const [timeFrame, setTimeFrame] = useState<TimeFrameType>(
    TimeFrameType.PAST_MONTH,
  );
  const timeFrameOptions = Object.values(TimeFrameType).filter(
    (option) => option !== timeFrame,
  );
  const { isSm, isMd, isLg } = useBreakpoint();
  const {
    data: pieChartData,
    isLoading: pieLoading,
    error: pieError,
  } = usePieChart(timeFrame);
  const {
    data: barChartData,
    isLoading: barLoading,
    error: barError,
  } = useBarChart(timeFrame);
  const {
    data: sankeyChartData,
    isLoading: sankeyLoading,
    error: sankeyError,
  } = useSankesChart(timeFrame);

  let chart;
  let isLoading;
  let error;

  switch (chartStyle) {
    case "pie-chart": {
      if (
        !pieChartData ||
        Object.values(pieChartData).reduce((sum, n) => sum + n, 0) === 0
      ) {
        chart = <Text weight={"bold"}>No Data Yet</Text>;
      } else {
        isLoading = pieLoading;
        error = pieError;

        chart = (
          <PieChart
            pieChartData={pieChartData!}
            width={isLg ? 600 : isSm ? 500 : 300}
            height={isLg ? 500 : isSm ? 400 : 250}
          />
        );
      }

      break;
    }
    case "bar-chart": {
      if (!barChartData || barChartData[0].total === 0) {
        chart = <Text weight={"bold"}>No Data Yet</Text>;
      } else {
        isLoading = barLoading;
        error = barError;

        chart = (
          <BarChart
            barChartData={barChartData!}
            width={isLg ? 800 : isMd ? 650 : isSm ? 450 : 300}
            height={isLg ? 500 : isSm ? 400 : 250}
          />
        );
      }

      break;
    }
    case "sankey-chart": {
      if (
        !sankeyChartData ||
        (sankeyChartData.nodes.length === 0 &&
          sankeyChartData.links.length === 0)
      ) {
        chart = <Text weight={"bold"}>No Data Yet</Text>;
      } else {
        isLoading = sankeyLoading;
        error = sankeyError;

        chart = <SankeyChart sankeyChartData={sankeyChartData!} />;
      }

      break;
    }
  }

  return (
    <QueryState isLoading={isLoading!} error={error}>
      <div className="analytics-page">
        <div className="chart-selector">
          <Box maxWidth="480px" width={"100%"}>
            <RadioCards.Root
              defaultValue="pie-chart"
              columns={{ initial: "1", sm: "3" }}
              size={"1"}
              onValueChange={setChartStyle}
            >
              <RadioCards.Item value="pie-chart">
                <Text weight="bold" align={"center"}>
                  Pie Chart
                </Text>
              </RadioCards.Item>
              <RadioCards.Item value="bar-chart">
                <Flex direction="column" width="100%">
                  <Text weight="bold" align={"center"}>
                    Bar Chart
                  </Text>
                </Flex>
              </RadioCards.Item>
              <RadioCards.Item value="sankey-chart">
                <Flex direction="column" width="100%">
                  <Text weight="bold" align={"center"}>
                    Sankey Chart
                  </Text>
                </Flex>
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
