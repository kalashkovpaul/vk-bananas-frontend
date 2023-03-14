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
import { Bar } from 'react-chartjs-2';
import type { SingleSlideData } from '../../types';
import { useEffect, useRef, useState, type FunctionComponent } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const labels = [''];

type CustomBarProps = {
  slide: SingleSlideData
};

type UpdateModeType = "default" | "resize" | "reset" | "none" | "hide" | "show" | "active" | undefined;

export const CustomBar = (props: CustomBarProps) => {
  const {slide} = props;
  const [updateMode, setUpdateMode] = useState<UpdateModeType>("default");
  const chartRef = useRef<any>(null);

  const options = {
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
          tickColor: slide.graphColor
        }
      }
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
      <Bar
        className="chart"
        ref={chartRef}
        options={options}
        data={barData}
        updateMode={updateMode}

      />
    </div>
  );
}