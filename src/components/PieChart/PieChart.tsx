"use client";

import { useEffect, useRef } from "react";
import "./PieChart.scss";
import * as d3 from "d3";
import { PieChartData } from "../../types/dtos/chart.dto";

export type PieData = {
  label: string;
  value: number;
  subcategories?: {
    label: string;
    value: number;
  }[];
};

type PieChartProps = {
  pieChartData: PieChartData;
  width?: number;
  height?: number;
};

const PieChart = ({
  pieChartData,
  width = 300,
  height = 300,
}: PieChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const data: PieData[] = [
    {
      label: "Active",
      value:
        pieChartData.appliedCount +
        pieChartData.interviewCount +
        pieChartData.ghostedCount +
        pieChartData.offerCount,
      subcategories: [
        {
          label: "Applied",
          value: pieChartData.appliedCount,
        },
        {
          label: "Interview",
          value: pieChartData.interviewCount,
        },
        {
          label: "Ghosted",
          value: pieChartData.ghostedCount,
        },
        {
          label: "Offer",
          value: pieChartData.offerCount,
        },
      ],
    },
    {
      label: "Rejected",
      value: pieChartData.rejectedCount,
    },
    {
      label: "Withdrawn",
      value: pieChartData.withdrawnCount,
    },
    {
      label: "Declined Offer",
      value: pieChartData.declinedCount,
    },
    {
      label: "Hired",
      value: pieChartData.hiredCount,
    },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    const svg = svgEl
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("max-width", `${width}px`)
      .style("max-height", `${height}px`)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const radius = Math.min(width, height) / 2 - 50; // Reduced margin for bigger donut
    const innerRadius = radius * 0.5; // Create donut hole (50% of outer radius)

    // Outer pie (main categories)
    const pie = d3
      .pie<PieData>()
      .value((d) => d.value)
      .sort(null);

    const arcs = pie(data);

    const arc = d3
      .arc<d3.PieArcDatum<PieData>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const outerArc = d3
      .arc<d3.PieArcDatum<PieData>>()
      .innerRadius(radius * 1.2)
      .outerRadius(radius * 1.2);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // Draw the main pie
    arcs.forEach((mainArc) => {
      const { startAngle, endAngle } = mainArc;

      if (!mainArc.data.subcategories) {
        // Normal slice (no subcategories)

        if (mainArc.value === 0) return;

        svg
          .append("path")
          .attr("d", arc(mainArc)!)
          .attr("fill", color(mainArc.data.label))
          .attr("stroke", "white")
          .attr("stroke-width", 2);

        // Add label with straight line from edge to label
        const midAngle = (startAngle + endAngle) / 2;

        // Point on outer edge of donut
        const edgeX = Math.cos(midAngle - Math.PI / 2) * radius;
        const edgeY = Math.sin(midAngle - Math.PI / 2) * radius;

        // Pointer endpoint
        const pointerX = Math.cos(midAngle - Math.PI / 2) * (radius * 1.15);
        const pointerY = Math.sin(midAngle - Math.PI / 2) * (radius * 1.15);

        // Label position with gap from pointer
        const labelX = Math.cos(midAngle - Math.PI / 2) * (radius * 1.2);
        const labelY = Math.sin(midAngle - Math.PI / 2) * (radius * 1.2);

        // Draw straight line from edge to label
        svg
          .append("line")
          .attr("x1", edgeX)
          .attr("y1", edgeY)
          .attr("x2", pointerX)
          .attr("y2", pointerY)
          .attr("stroke", "#666")
          .attr("stroke-width", 1.5);

        // Add text label
        svg
          .append("text")
          .attr("transform", `translate(${labelX}, ${labelY})`)
          .attr("text-anchor", midAngle < Math.PI ? "start" : "end")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .text(`${mainArc.data.label}: ${mainArc.data.value}`);
      } else {
        // Slice has subcategories
        const total = d3.sum(mainArc.data.subcategories, (d) => d.value);

        let currentAngle = startAngle;
        const subColor = d3
          .scaleOrdinal(d3.schemePastel1)
          .domain(mainArc.data.subcategories.map((s) => s.label));

        mainArc.data.subcategories.forEach((sub) => {
          if (sub.value === 0) return;

          const subAngle = ((endAngle - startAngle) * sub.value) / total;
          const subArc: d3.PieArcDatum<PieData> = {
            ...mainArc,
            startAngle: currentAngle,
            endAngle: currentAngle + subAngle,
            padAngle: 0,
            data: { ...mainArc.data },
            value: sub.value,
            index: 0,
          };
          currentAngle += subAngle;

          // Draw sub-slice
          svg
            .append("path")
            .attr("d", arc(subArc)!)
            .attr("fill", subColor(sub.label))
            .attr("stroke", "white")
            .attr("stroke-width", 1.5);

          // Label for sub-slice with straight line from centroid
          const subMidAngle = (subArc.startAngle + subArc.endAngle) / 2;
          const [centerX, centerY] = arc.centroid(subArc);

          // Pointer endpoint
          const pointerX =
            Math.cos(subMidAngle - Math.PI / 2) * (radius * 1.15);
          const pointerY =
            Math.sin(subMidAngle - Math.PI / 2) * (radius * 1.15);

          // Label position with gap from pointer
          const labelX = Math.cos(subMidAngle - Math.PI / 2) * (radius * 1.2);
          const labelY = Math.sin(subMidAngle - Math.PI / 2) * (radius * 1.2);

          // Draw straight line from piece centroid to label
          svg
            .append("line")
            .attr("x1", centerX)
            .attr("y1", centerY)
            .attr("x2", pointerX)
            .attr("y2", pointerY)
            .attr("stroke", "#666")
            .attr("stroke-width", 1.5);

          // Add text label
          svg
            .append("text")
            .attr("transform", `translate(${labelX}, ${labelY})`)
            .attr("text-anchor", subMidAngle < Math.PI ? "start" : "end")
            .attr("font-size", "10px")
            .text(`${sub.label}: ${sub.value}`);
        });

        // Draw an outer border around all sub-slices
        const borderArc = d3
          .arc<d3.PieArcDatum<PieData>>()
          .innerRadius(radius + 1)
          .outerRadius(radius + 1)
          .startAngle(startAngle)
          .endAngle(endAngle);

        svg
          .append("path")
          .attr("d", borderArc(mainArc)!)
          .attr("fill", "none")
          .attr("stroke", color(mainArc.data.label))
          .attr("stroke-width", 2)
          .attr("opacity", 0.8);

        // Label for main category (outer label with straight line from border)
        const midAngle = (startAngle + endAngle) / 2;

        // Point on outer edge of donut
        const edgeX = Math.cos(midAngle - Math.PI / 2) * radius;
        const edgeY = Math.sin(midAngle - Math.PI / 2) * radius;

        // Pointer endpoint
        const pointerX = Math.cos(midAngle - Math.PI / 2) * (radius * 1.2);
        const pointerY = Math.sin(midAngle - Math.PI / 2) * (radius * 1.2);

        // Label position with gap from pointer
        const labelX = Math.cos(midAngle - Math.PI / 2) * (radius * 1.25);
        const labelY = Math.sin(midAngle - Math.PI / 2) * (radius * 1.25);

        // Draw straight line from border to label
        svg
          .append("line")
          .attr("x1", edgeX)
          .attr("y1", edgeY)
          .attr("x2", pointerX)
          .attr("y2", pointerY)
          .attr("stroke", "#666")
          .attr("stroke-width", 1.5);

        // Add text label
        svg
          .append("text")
          .attr("transform", `translate(${labelX}, ${labelY})`)
          .attr("text-anchor", midAngle < Math.PI ? "start" : "end")
          .attr("font-size", "13px")
          .attr("font-weight", "bold")
          .text(`${mainArc.data.label}: ${mainArc.data.value}`);
      }
    });

    // Calculate total
    const total = d3.sum(data, (d) => d.value);

    // Display total in center of donut
    const centerText = svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.2em");

    centerText
      .append("tspan")
      .attr("x", 0)
      .attr("font-size", "28px")
      .attr("font-weight", "bold")
      .text(total);

    centerText
      .append("tspan")
      .attr("x", 0)
      .attr("dy", "1.4em")
      .attr("font-size", "14px")
      .attr("fill", "#666")
      .text("Total");
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;
