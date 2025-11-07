import * as d3 from "d3";
import {
  sankey,
  sankeyLinkHorizontal,
  sankeyLeft,
  sankeyCenter,
  SankeyNode,
  SankeyLink,
} from "d3-sankey";
import "./SankeyChart.scss";
import { useEffect, useRef } from "react";
import { SankeyChartData } from "../../types/dtos/chart.dto";

export type SankeyNodeData = {
  name: string;
  category: string;
};

export type SankeyLinkData = {
  source: string;
  target: string;
  value: number;
};

type SankeyChartProps = {
  sankeyChartData: SankeyChartData;
};

const SankeyChart = ({ sankeyChartData }: SankeyChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const data = sankeyChartData;

    const width = 928;
    const height = 600;
    const format = d3.format(",.0f");

    // Clear previous render
    d3.select(ref.current).selectAll("*").remove();

    // SVG setup
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Sankey generator with explicit types
    const sankeyGen = sankey<SankeyNodeData, SankeyLinkData>()
      .nodeId((d) => d.name)
      .nodeAlign(sankeyCenter)
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 5],
        [width - 1, height - 5],
      ]);

    const { nodes, links } = sankeyGen({
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({ ...d })),
    });

    // Color scale
    const color = d3
      .scaleOrdinal<string>()
      .domain(["start", "active", "finished"])
      .range(d3.schemeCategory10);

    // Nodes
    const rect = svg
      .append("g")
      .attr("stroke", "#000")
      .selectAll<SVGRectElement, SankeyNode<SankeyNodeData, SankeyLinkData>>(
        "rect",
      )
      .data(nodes)
      .join("rect")
      .attr("x", (d) => d.x0!)
      .attr("y", (d) => d.y0!)
      .attr("height", (d) => d.y1! - d.y0!)
      .attr("width", (d) => d.x1! - d.x0!)
      .attr("fill", (d) => color(d.category));

    rect.append("title").text((d) => `${d.name}\n${format(d.value ?? 0)}`);

    // Links
    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
      .selectAll<
        SVGPathElement,
        SankeyLink<SankeyNodeData, SankeyLinkData>
      >("g")
      .data(links)
      .join("g")
      .style("mix-blend-mode", "multiply");

    link
      .append("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d) =>
        color(
          (d.source as SankeyNode<SankeyNodeData, SankeyLinkData>).category,
        ),
      )
      .attr("stroke-width", (d) => Math.max(1, d.width ?? 1));

    link
      .append("title")
      .text(
        (d) =>
          `${(d.source as SankeyNode<SankeyNodeData, SankeyLinkData>).name} → ${(d.target as SankeyNode<SankeyNodeData, SankeyLinkData>).name}\n${format(d.value ?? 0)}`,
      );

    // Labels (grouped name + value)
    const label = svg
      .append("g")
      .selectAll<SVGGElement, SankeyNode<SankeyNodeData, SankeyLinkData>>("g")
      .data(nodes)
      .join("g")
      .attr(
        "transform",
        (d) =>
          `translate(${d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6}, ${(d.y1! + d.y0!) / 2})`,
      )
      .attr("text-anchor", (d) => (d.x0! < width / 2 ? "start" : "end"));

    label
      .append("text")
      .attr("dy", "0.35em")
      .text((d) => d.name);

    label
      .append("text")
      .attr("dy", "2em")
      .attr("font-size", 9)
      .attr("fill", "#555")
      .text((d) => (d.value ? format(d.value) : ""));
  }, [sankeyChartData]);

  return <svg ref={ref}></svg>;
};

export default SankeyChart;
