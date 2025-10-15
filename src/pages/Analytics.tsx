import React from 'react';
import { Line } from 'react-chartjs-2'; // Importing Line chart from chart.js for analytics

// Interface for chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const Analytics: React.FC = () => {
  // Chart data sample
  const data: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Overview</h1>
      <div className="max-w-4xl w-full"> {/* Ensuring chart fits without scrolling */}
        <Line data={data} options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }} />
      </div>
    </div>
  );
};

export default Analytics;