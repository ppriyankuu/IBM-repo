import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AgeGroupedChartProps {
  data: { Age: number, Annual_Lung_Cancer_Deaths: number }[];
}

const AgeGroupedChart: React.FC<AgeGroupedChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.Age),
    datasets: [
      {
        label: 'Mean Annual Deaths',
        data: data.map(d => d.Annual_Lung_Cancer_Deaths),
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h2>Average Annual Lung Cancer Deaths by Age Group</h2>
      <Line data={chartData} />
    </div>
  );
};

export default AgeGroupedChart;