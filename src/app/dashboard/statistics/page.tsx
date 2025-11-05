"use client";

import { Box, Flex, RadioCards, Text } from "@radix-ui/themes";
import PieChart, { PieData } from "../../../components/PieChart/PieChart";
import "./statistics.scss";
import { useState } from "react";
import BarChart from "../../../components/BarChart/BarChart";
import SankeyChart from "../../../components/SankeyChart/SankeyChart";
import { usePieChart } from "../../../hooks/chart/usePieChart";
import Dropdown from "../../../components/Dropdown/Dropdown";
import { TimeFrameType } from "../../../types/enums";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { useBarChart } from "../../../hooks/chart/useBarChart";

const StatisticsPage = () => {
  const [chartStyle, setChartStyle] = useState<string>("pie-chart");
  const [timeFrame, setTimeFrame] = useState<TimeFrameType>(
    TimeFrameType.PAST_MONTH,
  );
  const timeFrameOptions = Object.values(TimeFrameType).filter(
    (option) => option !== timeFrame,
  );
  const { isSm, isMd, isLg } = useBreakpoint();
  const { data: pieChartData } = usePieChart(timeFrame);
  const { data: barChartData } = useBarChart(timeFrame);

  let chart;

  switch (chartStyle) {
    case "pie-chart": {
      if (!pieChartData) chart = <Text weight={"bold"}>No Data Yet</Text>;

      chart = (
        <PieChart
          pieChartData={pieChartData}
          width={isSm ? 500 : 300}
          height={isSm ? 400 : 250}
        />
      );
      break;
    }
    case "bar-chart": {
      if (!barChartData) chart = <Text weight={"bold"}>No Data Yet</Text>;

      chart = (
        <BarChart
          barChartData={barChartData}
          width={isLg ? 800 : isMd ? 650 : isSm ? 450 : 300}
          height={isLg ? 500 : isSm ? 400 : 250}
        />
      );
      break;
    }
    case "sankey-chart": {
      // if (!data) chart = <Text weight={"bold"}>No Data Yet</Text>;
      chart = <SankeyChart />;
      break;
    }
  }

  return (
    <div className="statistics-page">
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
  );
};

export default StatisticsPage;
