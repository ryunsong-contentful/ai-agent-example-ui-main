import React from 'react';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// Mock data for revenue and expenses
const mockData = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  datasets: [
    {
      label: 'Revenue',
      data: [12000, 19000, 30000, 25000, 22000, 30000, 40000, 35000, 45000, 48000, 50000, 60000],
      fill: false,
      borderColor: '#4CAF50',
      tension: 0.1,
    },
    {
      label: 'Expenses',
      data: [10000, 8000, 15000, 12000, 17000, 23000, 25000, 23000, 26000, 29000, 32000, 36000],
      fill: false,
      borderColor: '#F44336',
      tension: 0.1,
    },
  ],
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);

  // Simulating data fetching
  useEffect(() => {
    const fetchData = async () => {
      // Mocking a fetch function
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Monthly Revenue & Expenses Track</h2>
      <div className="mt-4 mb-10">
        <Line data={mockData} options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Revenue & Expenses Overview',
            },
          },
        }} />
      </div>
      {/* Existing charts or other components can be retained here */}
    </div>
  );
};

export default Analytics;
