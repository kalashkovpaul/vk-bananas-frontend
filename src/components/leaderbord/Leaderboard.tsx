import React, { useEffect, useRef } from "react";
import './leaderboard.css';
import { leaderboardData } from "../../types";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2";
import { useTraceUpdate } from "../../utils/utils";

type LeaderboardProps = {
    data: leaderboardData;
    width: number;
    height: number;
    top: number;
    left: number;
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const labels = [''];

const Leaderboard = (props: LeaderboardProps) => {
    const {data, width, height, top, left} = props;
    const colors = ["green", "red", "blue", "purple", "orange"]
    const chartRef = useRef(null);
    const root = document.querySelector(':root') as HTMLDivElement;
    root?.style.setProperty('--graph-width', `${width}px`);
    root?.style.setProperty('--graph-height', `${height}px`);

    const totalDuration = 5000;
    const delayBetweenPoints = totalDuration / 500;
    const barDataRef = useRef<any>();

    const mapData = () => {
      barDataRef.current = {
        labels: Array.from(Array((data.length + 1) * 100).keys()),
        datasets: data.map((result, i) => {
          let currentData = [];
          for (let j = 0; j < result.points; j++) {
            currentData.push({x: j, y: (i * 100 + 100)});
          }
          return {
            label: result.name,
            data: currentData,
            color: colors[Math.floor(i % colors.length)],
            borderWidth: 90 + 10 * (5 - data.length),
          }
        })
      };
    };

    mapData();

    const horizontalOptions = {
        events: [],
        indexAxis: 'y' as const,
        responsive: true,
        elements: {
          point:{
              radius: 0
          }
        },
        animations: {
          'x': {
            type: "number" as const,
            easing: 'linear' as const,
            from: NaN,
            duration: delayBetweenPoints,
            delay(ctx: any) {
              if (ctx.type !== 'data' || ctx.xStarted) {
                return 0;
              }
              ctx.xStarted = true;
              return (ctx.index * delayBetweenPoints) + 1500;
            }
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              tickColor: "black",
              drawOnChartArea: false,
              color: "black",
            },
            border: {
              color: "black",
            },
            ticks: {
              font: {
                family: 'Nunito',
                size: 22,
              },
              // beginAtZero: true
            }
          },
          y: {
            grid: {
              tickColor: "black",
              drawOnChartArea: false,
              display: false, //  display none???
            },
            border: {
              color: "black",
            },
            ticks: {
              font: {
                family: 'Nunito',
                size: 22
              },
              // autoSkip: true,
              maxTicksLimit: (data.length + 1),
              // stepSize: 100,
              // count: 5,
              callback: function(val: any, index: number) {
                return (index > 0 && index % 100 === 0) ? data[(Math.floor((index -99) / 100)) % data.length].name : '';
              },
            }
          },
        }
    };

    useEffect(() => {
      root?.style.setProperty('--graph-width', `${width}px`);
      root?.style.setProperty('--graph-height', `${height}px`);
      root?.style.setProperty('--graph-top', `${top}px`);
      root?.style.setProperty('--graph-left', `${left}px`);
    }, [width, height, top, left]);



    const usePreviousBarData = (value: any) => {
      const barDataRef = useRef<any>(value);
        useEffect(() => {
            barDataRef.current = value;
        })
        return barDataRef.current
    };

    const previousData = usePreviousBarData(data);

    // useEffect(() => {
    // }, [data]);

    useEffect(() => {
      mapData();
    }, [])

    return (
        <div className="leaderboard">
          <div className="leaderboardTitle">Результаты</div>
          {data.length && <Line
            className="chart"
            ref={chartRef}
            options={horizontalOptions}
            data={barDataRef.current}
            updateMode={"default"}
          />}
        </div>
    );
}

export default React.memo(Leaderboard);