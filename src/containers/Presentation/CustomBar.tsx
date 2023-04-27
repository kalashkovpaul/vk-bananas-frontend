import Chart from 'chart.js/auto';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import type { CustomBarProps, OptionData, UpdateModeType } from '../../types';
import React, { useEffect, useRef, useState, } from 'react';
import WordCloud from 'wordcloud';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const labels = [''];

const CustomBar = (props: CustomBarProps) => {
  const {slide, kind, width, height, top, left} = props;
  const [updateMode, setUpdateMode] = useState<UpdateModeType>("default");
  const chartRef = useRef<any>(null);
  const root = document.querySelector(':root') as HTMLDivElement;
  root?.style.setProperty('--graph-width', `${width}px`);
  root?.style.setProperty('--graph-height', `${height}px`);

  useEffect(() => {
    root?.style.setProperty('--graph-width', `${width}px`);
    root?.style.setProperty('--graph-height', `${height}px`);
    root?.style.setProperty('--graph-top', `${top}px`);
    root?.style.setProperty('--graph-left', `${left}px`);
  }, [width, height, top, left]);

  const verticalOptions = {
    responsive: true,
    events: [],
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Nunito',
          }
        }
      },
    },
    transitions: {
      'resize': {
        animation: {
          duration: 0
        }
      }
    },
    scales: {
      x: {
        grid: {
          tickColor: slide.graphColor,
          display: false
        },
        border: {
          color: slide.graphColor,
        },
        ticks: {
          font: {
            family: 'Nunito',
          }
        }
      },
      y: {
        grid: {
          tickColor: slide.graphColor
        },
        border: {
          color: slide.graphColor,
        },
        ticks: {
          font: {
            family: 'Nunito',
          }
        }
      }
    }
  };

  const horizontalOptions = {
    events: [],
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Nunito',
          }
        }
      },
    },
    transitions: {
      'resize': {
        animation: {
          duration: 0
        }
      }
    },
    scales: {
      x: {
        grid: {
          tickColor: slide.graphColor,
          drawOnChartArea: false,
          color: slide.graphColor,
        },
        border: {
          color: slide.graphColor,
        },
        ticks: {
          font: {
            family: 'Nunito',
          }
        }
      },
      y: {
        grid: {
          tickColor: slide.graphColor,
          drawOnChartArea: false,
          display: false
        },
        border: {
          color: slide.graphColor,
        },
        ticks: {
          font: {
            family: 'Nunito',
          }
        }
      },
    }
  };

  let barData = {
    labels,
    datasets: slide.votes.map((option) => {
      return {
        label: option.option,
        data: [option.votes],
        backgroundColor: option.color,

      }
    })
  };

  let pieOptions = {
    events: [],
    responsive: true,
    interaction: {
        mode: 'nearest' as const
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Nunito',
          }
        }
      },
    },
  }

  let pieData = {
    labels: slide.votes.map(option => option.option),
    datasets: [{
      labels: 'Голосов: ',
      data: slide.votes.map(option => option.votes),
      backgroundColor: slide.votes.map(option => option.color),
      borderColor: slide.votes.map(option => option.color)

    }]
  }

  // TODO это насчёт обновления
  // setInterval(() => {
  //   let newData = chartRef.current.data.datasets[0].data.map((value: any) => value+2);
  //   // console.log(bar);
  //   chartRef.current.data.datasets[0].data = newData;
  //   chartRef.current.update();
  // }, 2000);


  let cloudData = slide.votes.map((option: OptionData) => {
    return [option.option, option.votes];
  });

  function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  // useEffect(() => {
  //   // console.log(cloudData);
  //   if (slide.type === "cloud") {
  //     const chart = document.getElementById("cloud-chart");
  //     if (chart) {
  //       WordCloud(chart, {
  //         list: cloudData as any,
  //         weightFactor: 10  ,
  //         fontFamily: "Times, serif",
  //         // rotateRatio: 0,
  //         // rotationSteps: 2,
  //         clearCanvas: true,
  //         backgroundColor: slide.background
  //       });
  //     }
  //   }

  // });

  // setInterval(() => {
  //   cloudData[1][1] = cloudData[1][1] as number + 1;
  //   console.log(cloudData);
  // }, 2000);

  const usePreviousBarData = (value: any) => {
    const barDataRef = useRef<any>(value);
      useEffect(() => {
          barDataRef.current = value;
      })
      return barDataRef.current
  };

  const previousBarData = usePreviousBarData(barData);

  Chart.defaults.color = slide.graphColor;

  return (
    <div className="bar">
      <div className="slideQuestion" style={{color: slide.fontColor,}}>{slide.question}</div>
      {/* TODO change update mode */}
      {kind === "vertical" &&
      <Bar
        className="chart"
        ref={chartRef}
        options={verticalOptions}
        data={barData}
        updateMode={updateMode}

      />}
      {kind === "horizontal" &&
      <Bar
        className="chart"
        ref={chartRef}
        options={horizontalOptions}
        data={barData}
        updateMode={updateMode}
      />}
      {kind === "pie" &&
      <Pie
        className="chart"
        ref={chartRef}
        options={pieOptions}
        data={pieData}
      />}
      {kind === "cloud" &&
      <canvas
        id="cloud-chart"
        width="600px"
        height="300px"
      />}
      {kind === "doughnut" &&
      <Doughnut
        className="chart"
        ref={chartRef}
        options={pieOptions}
        data={pieData}
    />}
    </div>
  );
}

export default React.memo(CustomBar);