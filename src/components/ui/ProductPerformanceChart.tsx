import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const productPerformanceData = [
  { month: 'January', sales: 2000, returns: 400 },
  { month: 'February', sales: 3000, returns: 800 },
  // Add missing data for March and August
  { month: 'March', sales: 2500, returns: 300 },
  { month: 'April', sales: 2200, returns: 400 },
  { month: 'August', sales: 2700, returns: 350 }
];

const ProductPerformanceChart = () => (
  <BarChart width={600} height={400} data={productPerformanceData}>
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="sales" fill="#82ca9d" />
    <Bar dataKey="returns" fill="#ff7300" />
  </BarChart>
);

export default ProductPerformanceChart;