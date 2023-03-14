import React from 'react';
import './slide.css';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    //   title: {
    //     display: true,
    //     text: 'Chart.js Bar Chart',
    //   },
    },
  };

const labels = ['Настроение'];

export const data = {
    labels,
    datasets: [
      {
        label: 'Хорошее',
        data: [3],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Отличное',
        data: [5],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

export type SlideProps = {

}

export const Slide: React.FunctionComponent<SlideProps> = () => {
    let question = "Как настроение?"; // TODO
    let options;
    // let data;
    // let
    // const chartRef = React.useRef<HTMLCanvasElement>(null);

    return (
        <div className="slide">
            <div className="slideQuestion">{question}</div>
            <Bar className="chart" options={options} data={data} />
        </div>
    );
}