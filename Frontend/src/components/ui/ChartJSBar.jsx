import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend);

const ChartJSBar = ({ barData, viewMode }) => {
  const labels = barData.map(item =>
    viewMode === 'monthly' ? item.month : item.date
  );
  const dataValues = barData.map(item => item.total);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total',
        data: dataValues,
        backgroundColor: '#2A806D',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    scales: {
      x: {
        ticks: {
          autoSkip: viewMode !== 'monthly',
          maxTicksLimit: 10,
        },
        grid: {
          display: true,
          borderDash: [3, 3],
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          borderDash: [3, 3],
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: '#2A806D',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartJSBar;
