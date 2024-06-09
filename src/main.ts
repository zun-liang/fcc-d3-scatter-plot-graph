import "./style.css";
import * as d3 from "d3";
import { Margin, Data } from "./types";

const width: number = 950;
const height: number = 560;
const margin: Margin = { top: 60, right: 20, bottom: 80, left: 70 };

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((res: Response) => res.json() as Promise<Data[]>)
  .then((data: Data[]) => {
    const xScale: d3.ScaleLinear<number, number> = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.Year) as [number, number])
      .nice()
      .range([margin.left, width - margin.left]);

    const yScale: d3.ScaleLinear<number, number> = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => Number(d.Time)) as [number, number])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const svg = d3
      .select("div#app")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .classed("svg-content", true);

    svg
      .append("text")
      .attr("id", "title")
      .attr("x", width / 2)
      .attr("y", 60)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("fill", "black")
      .text("Doping in Professional Bicycle Racing");

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));
  })
  .catch((err) => console.error("Error fetching data", err));
