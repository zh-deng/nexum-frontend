"use client";

import { useEffect, useRef } from "react";
import "./BarChart.scss";
import * as d3 from "d3";
import { useBreakpoint } from "../../hooks/useBreakpoint";

type SubCategory = {
  label: string;
  value: number;
};

type BarData = {
  label: string;
  total: number;
  subcategories: SubCategory[];
};

type BarChartProps = {
  barChartData: BarChartData;
  width?: number;
  height?: number;
};

type StackedDatum = Record<string, number> & { label: string };

const BarChart = ({
  barChartData,
  width = 600,
  height = 400,
}: BarChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { isSm, isMd } = useBreakpoint();

  const data: BarData[] = barChartData.map((item) => ({
    label: isSm ? item.period : item.period.slice(0, 2),
    total: item.total,
    subcategories: [
      { label: "Applied", value: item.APPLIED },
      { label: "Interview", value: item.INTERVIEW },
      { label: "Ghosted", value: item.GHOSTED },
      { label: "Offer", value: item.OFFER },
      { label: "Rejected", value: item.REJECTED },
      { label: "Withdrawn", value: item.WITHDRAWN },
      { label: "Declined", value: item.DECLINED_OFFER },
      { label: "Hired", value: item.HIRED },
    ],
  }));

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Adjust margins depending on legend position
    const margin = isMd
      ? { top: 20, right: 130, bottom: 40, left: 50 } // side legend
      : { top: 100, right: 40, bottom: 40, left: 50 }; // top legend

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Filter active categories
    const allSubcats = Array.from(
      new Set(data.flatMap((d) => d.subcategories.map((s) => s.label))),
    );
    const activeSubcats = allSubcats.filter((name) =>
      data.some((d) =>
        d.subcategories.find((s) => s.label === name && s.value > 0),
      ),
    );

    // Prepare stacked data
    const stackedDataInput: StackedDatum[] = data.map((d) => {
      const entry: StackedDatum = { label: d.label } as StackedDatum;
      d.subcategories.forEach((s) => (entry[s.label] = s.value));
      return entry;
    });

    const stackGenerator = d3.stack<StackedDatum>().keys(activeSubcats);
    const stackedSeries = stackGenerator(stackedDataInput);

    // Color scale
    const color = d3
      .scaleOrdinal<string>()
      .domain(activeSubcats)
      .range(d3.schemeTableau10);

    // Scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    const yMax = d3.max(stackedDataInput, (d) =>
      d3.sum(activeSubcats, (k) => d[k]),
    )!;

    const y = d3.scaleLinear().domain([0, yMax]).nice().range([innerHeight, 0]);

    // Main chart group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    // Integer-only Y Axis
    const yAxisTicks = d3.ticks(
      0,
      Math.ceil(yMax),
      Math.min(5, Math.ceil(yMax)),
    );
    g.append("g").call(
      d3
        .axisLeft(y)
        .tickValues(yAxisTicks.filter((t) => Number.isInteger(t)))
        .tickFormat((d) => d.toString()),
    );

    // Draw stacked bars
    const layers = g
      .selectAll<SVGGElement, d3.Series<StackedDatum, string>>(".layer")
      .data(stackedSeries)
      .enter()
      .append("g")
      .attr("fill", (d) => color(d.key)!);

    layers
      .selectAll<SVGRectElement, d3.SeriesPoint<StackedDatum>>("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data.label)!)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    // Determine which bars have multiple sections
    const multiSectionLabels = data
      .filter((d) => d.subcategories.filter((s) => s.value > 0).length > 1)
      .map((d) => d.label);

    // Subcategory labels (only if multi-section)
    layers
      .selectAll<SVGTextElement, d3.SeriesPoint<StackedDatum>>(".subtext")
      .data((d) => d)
      .enter()
      .append("text")
      .filter((d) => multiSectionLabels.includes(d.data.label))
      .attr("x", (d) => x(d.data.label)! + x.bandwidth() / 2)
      .attr("y", (d) => (y(d[0]) + y(d[1])) / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#fff")
      .text((d) => {
        const value = d[1] - d[0];
        return value > 0 ? value.toString() : "";
      });

    // Total labels on top
    g.selectAll<SVGTextElement, BarData>(".total-text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.label)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.total) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", "#111")
      .attr("font-weight", "bold")
      .text((d) => (d.total > 0 ? d.total.toString() : ""));

    // --- Legend ---
    const legend = svg.append("g").attr("class", "legend");

    if (isMd) {
      // SIDE LEGEND for medium screens and up
      const rectSize = 14;
      const fontSize = 13;
      const spacing = 24;

      activeSubcats.forEach((name, i) => {
        const legendRow = legend
          .append("g")
          .attr(
            "transform",
            `translate(${innerWidth + margin.left + 10}, ${
              margin.top + i * spacing
            })`,
          );

        legendRow
          .append("rect")
          .attr("width", rectSize)
          .attr("height", rectSize)
          .attr("fill", color(name)!);

        legendRow
          .append("text")
          .attr("x", rectSize + 8)
          .attr("y", rectSize - 2)
          .text(name)
          .attr("font-size", `${fontSize}px`)
          .attr("fill", "#222")
          .attr("font-weight", "500");
      });
    } else {
      // TOP LEGEND for small screens (wrapped)
      const itemsPerRow = 3;
      const itemSpacingX = 100;
      const itemSpacingY = 22;
      const rectSize = 12;
      const fontSize = 12;

      const legendItems = legend
        .selectAll(".legend-item")
        .data(activeSubcats)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (_, i) => {
          const row = Math.floor(i / itemsPerRow);
          const col = i % itemsPerRow;
          return `translate(${col * itemSpacingX}, ${row * itemSpacingY})`;
        });

      legendItems
        .append("rect")
        .attr("width", rectSize)
        .attr("height", rectSize)
        .attr("fill", (d) => color(d)!);

      legendItems
        .append("text")
        .attr("x", rectSize + 6)
        .attr("y", rectSize - 2)
        .attr("font-size", `${fontSize}px`)
        .attr("fill", "#333")
        .text((d) => d);

      const totalRows = Math.ceil(activeSubcats.length / itemsPerRow);
      const legendWidth =
        Math.min(activeSubcats.length, itemsPerRow) * itemSpacingX;
      const legendHeight = totalRows * itemSpacingY;

      legend.attr(
        "transform",
        `translate(${(width - legendWidth) / 2}, ${(margin.top - legendHeight) / 2})`,
      );
    }
  }, [barChartData, width, height, isSm, isMd]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default BarChart;
