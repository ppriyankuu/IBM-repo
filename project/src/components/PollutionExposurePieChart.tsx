import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PollutionExposurePieChartProps {
  data: { Air_Pollution_Exposure: string, Count: number }[];
}

const PollutionExposurePieChart: React.FC<PollutionExposurePieChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.Air_Pollution_Exposure),
    datasets: [
      {
        label: 'Proportion of Lung Cancer Diagnoses by Air Pollution Exposure',
        data: data.map(d => d.Count),
        backgroundColor: ['lightgreen', 'tomato', 'gold'],
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Proportion of Lung Cancer Diagnoses by Air Pollution Exposure</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PollutionExposurePieChart;