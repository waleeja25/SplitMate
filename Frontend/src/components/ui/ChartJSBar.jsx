import React, { useMemo } from 'react';
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
  const labels = useMemo(
    () => barData.map(item => (viewMode === 'monthly' ? item.month : item.date)),
    [barData, viewMode]
  );

  const dataValues = useMemo(
    () => barData.map(item => item.total),
    [barData]
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Total',
          data: dataValues,
          backgroundColor: '#2A806D',
          borderRadius: 8,
        },
      ],
    }),
    [labels, dataValues]
  );

  const options = useMemo(
    () => ({
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
    }),
    [viewMode]
  );

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartJSBar;
