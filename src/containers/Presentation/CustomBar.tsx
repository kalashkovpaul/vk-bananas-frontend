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
import { Bar, Pie } from 'react-chartjs-2';
import type { CustomBarProps, SingleSlideData, UpdateModeType } from '../../types';
import { useEffect, useRef, useState, type FunctionComponent } from 'react';
import WordCloud from 'react-d3-cloud';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const labels = [''];

export const CustomBar = (props: CustomBarProps) => {
  const {slide, kind} = props;
  const [updateMode, setUpdateMode] = useState<UpdateModeType>("default");
  const chartRef = useRef<any>(null);

  const verticalOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
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
        }
      },
      y: {
        grid: {
          tickColor: slide.graphColor
        }
      }
    }
  };

  const horizontalOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
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
          tickColor: slide.graphColor
        }
      },
      y: {
        grid: {
          tickColor: slide.graphColor,
          display: false
        }
      },
    }
  };

  let barData = {
    labels,
    datasets: slide.options.map((option) => {
      return {
        label: option.option,
        data: [option.votes],
        backgroundColor: option.color,

      }
    })
  };

  let pieOptions = {
    responsive: true,
    interaction: {
        mode: 'nearest' as const
    },
    maintainAspectRatio: false,
    // plugins: {
    //   legend: {
    //     position: 'top' as const,
    //     labels: {
    //       font: {
    //         size: 30
    //       }
    //     }
    //   },
    //   tooltip: {
    //     titleFont: {
    //       size: 30
    //     },
    //     bodyFont: {
    //       size: 30
    //     }
    //   }
    // },
  }

  let pieData = {
    labels: slide.options.map(option => option.option),
    datasets: [{
      labels: 'Голосов: ',
      data: slide.options.map(option => option.votes),
      backgroundColor: slide.options.map(option => option.color),
      borderColor: slide.options.map(option => option.color)

    }]
  }

  // TODO это насчёт обновления
  // setInterval(() => {
  //   let newData = chartRef.current.data.datasets[0].data.map((value: any) => value+2);
  //   // console.log(bar);
  //   chartRef.current.data.datasets[0].data = newData;
  //   chartRef.current.update();
  // }, 2000);

  let cloudData = slide.options.map(option => {
    return {
      text: option.option,
      value: option.votes * 100
    };
  });

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
        className="piechart"
        ref={chartRef}
        options={pieOptions}
        data={pieData}
      />}
      {kind === "cloud" &&
      <WordCloud
        data={cloudData}
      />}
    </div>
  );
}