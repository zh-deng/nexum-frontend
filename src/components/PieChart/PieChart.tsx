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
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const radius = Math.min(width, height) / 2 - 20;

    // Outer pie (main categories)
    const pie = d3
      .pie<PieData>()
      .value((d) => d.value)
      .sort(null);

    const arcs = pie(data);

    const arc = d3
      .arc<d3.PieArcDatum<PieData>>()
      .innerRadius(0)
      .outerRadius(radius);

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

        // Add label
        const [x, y] = arc.centroid(mainArc);

        const text = svg
          .append("text")
          .attr("transform", `translate(${x}, ${y})`)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px");

        text.append("tspan").attr("x", 0).text(mainArc.data.value);

        text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", "1.2em")
          .text(mainArc.data.label);
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

          // Label for sub-slice
          const [sx, sy] = arc.centroid(subArc);
          const text = svg
            .append("text")
            .attr("transform", `translate(${sx}, ${sy})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px");

          text.append("tspan").attr("x", 0).text(sub.value);

          text.append("tspan").attr("x", 0).attr("dy", "1.2em").text(sub.label);
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
          .attr("stroke", color(mainArc.data.label)) // match parent color, or pick neutral
          .attr("stroke-width", 2)
          .attr("opacity", 0.8);

        // Label for main category (outer label)
        const midAngle = (startAngle + endAngle) / 2;
        const labelRadius = radius + 5;
        const lx = Math.cos(midAngle - Math.PI / 2) * labelRadius;
        const ly = Math.sin(midAngle - Math.PI / 2) * labelRadius;
        svg
          .append("text")
          .attr("transform", `translate(${lx}, ${ly})`)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .text(`${mainArc.data.value} ${mainArc.data.label}`);
      }
    });
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;
