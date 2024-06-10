import "./style.css";
import * as d3 from "d3";
import { Margin, Data } from "./types";

const width: number = 920;
const height: number = 630;
const margin: Margin = { top: 60, right: 20, bottom: 80, left: 70 };

const parseTime = (time: string) =>
  `${time.split(":")[0]}.${time.split(":")[1]}`;

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
      .domain(
        d3.extent(data, (d) => Number(parseTime(d.Time))) as [number, number]
      )
      .nice()
      .range([margin.top, height - margin.bottom]);

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
      .append("text")
      .attr("id", "subtitle")
      .attr("x", width / 2)
      .attr("y", 80)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "black")
      .text("35 Fastest times up Alpe d'Huez");

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

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(Number(parseTime(d.Time))))
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => Number(parseTime(d.Time)))
      .attr("r", 5)
      .attr("fill", "blue");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 3)
      .attr("y", 30)
      .text("Time in Minutes")
      .style("font-size", "15px");

    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${width - margin.left}, ${height / 2})`);

    const categories = [
      { label: "No doping allegations", color: "orange" },
      { label: "Riders with doping allegations", color: "blue" },
    ];
    
    categories.forEach((category, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);
      legendRow
        .append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", category.color);
      legendRow
        .append("text")
        .attr("x", -10)
        .attr("y", 15)
        .attr("text-anchor", "end")
        .text(category.label);
    });
  })
  .catch((err) => console.error("Error fetching data", err));
