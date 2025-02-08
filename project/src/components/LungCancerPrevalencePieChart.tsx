import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface LungCancerPrevalenceHistogramProps {
  histData: number[];
  binEdges: number[];
}

const LungCancerPrevalenceHistogram: React.FC<LungCancerPrevalenceHistogramProps> = ({ histData, binEdges }) => {
  const labels = binEdges.map((edge, index) => `${edge.toFixed(2)} - ${binEdges[index + 1]?.toFixed(2) || ''}`).slice(0, -1);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Lung Cancer Prevalence Rate',
        data: histData,
        backgroundColor: 'orange',
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Distribution of Lung Cancer Prevalence Rate</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default LungCancerPrevalenceHistogram;