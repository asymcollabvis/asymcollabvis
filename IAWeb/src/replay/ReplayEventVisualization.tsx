import { width, margin, height } from "@mui/system";
import * as d3 from "d3";
import React, { useMemo, useRef } from "react";
import { useEffect } from "react";
import { selectReplayData } from "../features/replay/replaySlice";
import { useAppSelector } from "../hooks";
import { EventType } from "../../server/common";
export default function ReplayEventVisualization({ replayData, colorScale }) {
  console.log("ReplayEventVisualization");

  const selector = useAppSelector;
  // const replayData = selector(selectReplayData);
  const yAxisRef = useRef(null!);
  const xAxisRef = useRef(null!);

  let width = 1000;
  let height = 100;
  const margin = { top: 20, right: 20, bottom: 30, left: 100 };
  // const [timeScale, setTimeScale] = React.useState();
  // const [colorScale, setColorScale] = React.useState();
  // const [eventScale, setEventScale] = React.useState();

  const timeScale = useMemo(
    () =>
      d3
        .scaleTime()
        .domain(d3.extent(replayData.map((d) => d.timestamp)))
        .range([0, width]),
    [replayData]
  );

  const eventScale = useMemo(
    () =>
      d3
        .scalePoint()
        .domain(replayData.map((d) => EventType[d.event]))
        .range([0, height]),
    [replayData]
  );

  useEffect(() => {
    // draw axis
    const yAxis = d3.axisLeft(eventScale);
    d3.select(yAxisRef.current).call(yAxis);

    const xAxis = d3.axisBottom(timeScale);
    d3.select(xAxisRef.current).call(xAxis);
  }, [eventScale]);

  function drawVisualization() {
    if (!replayData) return;

    if (replayData.length === 0) {
      return;
    }

    // console.log(timeScale, colorScale, eventScale);

    return (
      <g transform={`translate(${margin.left},${margin.top})`}>
        {replayData.map((d, i) => {
          return (
            <g
              key={i}
              transform={`translate(${timeScale(d.timestamp)},${eventScale(
                EventType[d.event]
              )})`}
            >
              <circle r={5} fill={colorScale(d.event)} />
            </g>
          );
        })}
      </g>
    );
  }

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g ref={xAxisRef} transform={`translate(${margin.left},${height + margin.top})`} />
      <g ref={yAxisRef} transform={`translate(${margin.left},${margin.top})`} />
      {drawVisualization()}
    </svg>
  );
}
