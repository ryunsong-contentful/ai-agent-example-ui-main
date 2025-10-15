import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Sample data format for user growth
const userData = [
  { month: 'January', users: 1200 },
  { month: 'February', users: 1100 },
  { month: 'March', users: 1400 },
  { month: 'April', users: 1600 }
];

const Analytics = () => {
  // Convert user data with numeric correction for months
  const formattedUserData = userData.map(item => ({
    ...item,
    users: typeof item.users === 'string' ? Number(item.users) : item.users
  }));

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <h2>User Growth Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedUserData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;