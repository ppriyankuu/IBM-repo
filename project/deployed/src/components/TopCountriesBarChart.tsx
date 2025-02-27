import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TopCountriesBarChartProps {
  data: { Country: string, Count: number }[];
}

const TopCountriesBarChart: React.FC<TopCountriesBarChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.Country),
    datasets: [
      {
        label: 'Number of Lung Cancer Diagnoses',
        data: data.map(d => d.Count),
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          rotation: 45,
          autoSkip: false,
        },
      },
    },
  };

  return (
    <div>
      <h2>Top 10 Countries by Number of Lung Cancer Diagnoses</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TopCountriesBarChart;