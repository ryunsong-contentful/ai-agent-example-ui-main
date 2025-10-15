import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { trafficData } from '@/data/trafficData';
import { userGrowthData } from '@/data/userGrowthData';
import { productPerformanceData } from '@/data/productPerformanceData';

const Analytics = () => {
  const updatedUserGrowthData = userGrowthData.map((item, index) => {
    if (typeof item.value === 'string') {
      return { ...item, value: Number(item.value) };
    }
    return item;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
      <div className="chart-container">
        <h2>Monthly Revenue & Expenses</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-container">
        <h2>User Growth</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={updatedUserGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-container">
        <h2>Product Performance</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={productPerformanceData}>
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82ca9d" />
            <Bar dataKey="returns" fill="#ff0000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;