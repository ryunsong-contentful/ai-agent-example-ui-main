import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { mockRevenueData, mockExpenseData } from '@/data/mockData';

const Analytics = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    setChartData({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Revenue',
          data: mockRevenueData,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
        {
          label: 'Expenses',
          data: mockExpenseData,
          borderColor: 'rgba(255,99,132,1)',
          fill: false,
        },
      ],
    });
  }, []);

  return (
    <div className="p-4 flex flex-col space-y-4">
      <h2 className="text-xl font-bold">Monthly Revenue & Expenses Track</h2>
      <div className="flex flex-col bg-white rounded-lg shadow p-4">
        <Line data={chartData} options={{ responsive: true }} />
      </div>
      <Button>
        Refresh Data
      </Button>
    </div>
  );
};

export default Analytics;

// Mocked Data
export const mockRevenueData = [3000, 2000, 4000, 5000, 6000, 7000, 8000];
export const mockExpenseData = [1500, 2500, 3000, 3500, 2000, 4500, 5000];