import { useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { trafficData, userData, revenueData, productPerformanceData } from '@/data/charts';
import { ChartContainer } from '@/components/ui/chart-container';

/**
 * Analytics Page rendering various charts including revenue, user growth, product performance and traffic.
 */
const Analytics = () => {
  // Convert first four months user data from strings to numbers
  const transformedUserData = userData.map((data, index) => (
    index < 4 ? { ...data, value: Number(data.value) } : data
  ));

  return (
    <div>
      <h1>Analytics Dashboard</h1>

      <ChartContainer title='Monthly Revenue & Expenses'>
        <ResponsiveContainer height={400}>
          <LineChart data={revenueData}>
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='revenue' stroke='#8884d8' />
            <Line type='monotone' dataKey='expenses' stroke='#82ca9d' />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer title='User Growth'>
        <ResponsiveContainer height={400}>
          <LineChart data={transformedUserData}>
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='value' stroke='#ff7300' />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer title='Product Performance'>
        <ResponsiveContainer height={400}>
          <BarChart data={productPerformanceData}>
            <XAxis dataKey='product' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='sales' fill='#82ca9d' />
            <Bar dataKey='returns' fillColor='#ff0000' />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer title='Website Traffic'>
        <ResponsiveContainer height={400}>
          <LineChart data={trafficData}>
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='visitors' stroke='#8884d8' />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default Analytics;
