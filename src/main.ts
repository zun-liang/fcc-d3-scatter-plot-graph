import "./style.css";
import * as d3 from "d3";
import { Margin, Data } from "./types";

const width: number = 920;
const height: number = 630;
const margin: Margin = { top: 80, right: 70, bottom: 80, left: 70 };

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((res: Response) => res.json() as Promise<Data[]>)
  .then((data: Data[]) => {
    const xScale: d3.ScaleLinear<number, number> = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.Year) as [number, number])
      .range([margin.left, width - margin.left])
      .nice();

    const yScale: d3.ScaleTime<number, number> = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d3.timeParse("%M:%S")(d.Time)) as [Date, Date])
      .range([margin.top, height - margin.bottom]);

    const svg = d3
      .select("div#app")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .classed("svg-content", true);

    const tooltip = d3.select("body").append("div").attr("id", "tooltip");

    svg
      .append("text")
      .attr("id", "title")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .style("fill", "black")
      .text("Doping in Professional Bicycle Racing");

    svg
      .append("text")
      .attr("id", "subtitle")
      .attr("x", width / 2)
      .attr("y", 60)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("fill", "black")
      .text("35 Fastest times up Alpe d'Huez");

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

      svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => {
        const date = new Date(d.valueOf());
        return d3.timeFormat("%M:%S")(date);
      }));

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d3.timeParse("%M:%S")(d.Time)!))
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => {
        const parsedTime = d3.timeParse("%M:%S")(d.Time);
        return parsedTime ? parsedTime.toISOString() : "";
      })
      .attr("r", 5)
      .attr("fill", (d) => (d.Doping ? "steelblue" : "orange"))
      .attr("stroke", "black")
      .attr("stroke-width", "1px")
      .on("mouseover", (event, d) => {
        tooltip
          .style("display", "block")
          .html(
            `${d.Name}: ${d.Nationality}<br/>Year: ${d.Year}, Time: ${d.Time}<br/>${d.Doping}`
          )
          .attr("data-year", d.Year)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", () => tooltip.style("display", "none"));

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 3)
      .attr("y", 20)
      .text("Time in Minutes")
      .style("font-size", "18px");

    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${width - margin.left}, ${height / 2})`);

    const categories = [
      { label: "No doping allegations", color: "orange" },
      { label: "Riders with doping allegations", color: "steelblue" },
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
