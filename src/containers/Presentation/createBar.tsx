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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const options = {
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

const labels = [''];

export const barData = {
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

export const createBar = (data: SingleSlideData) => {

  let barData = {
    labels,
    datasets: data.options.map((option) => {
      return {
        label: option.option,
        data: [option.votes],
        backgroundColor: option.color,
      }
    })
  };

  return (
    <div className="bar">
      <div className="slideQuestion">{data.question}</div>
      <Bar className="chart" options={options} data={barData} />
    </div>
  );
}