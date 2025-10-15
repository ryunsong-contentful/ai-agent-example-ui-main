import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics: React.FC = () => {
  // Mocked data for revenue - intentional bug: some values are strings
  const revenueData = [
    { month: 'Jan', revenue: '45000', expenses: 32000 },
    { month: 'Feb', revenue: '52000', expenses: 35000 },
    { month: 'Mar', revenue: 48000, expenses: 31000 },
    { month: 'Apr', revenue: 61000, expenses: 42000 },
    { month: 'May', revenue: 55000, expenses: 38000 },
    { month: 'Jun', revenue: 67000, expenses: 45000 },
  ];

  // Mocked data for user growth
  const userGrowthData = [
    { month: 'Jan', users: 1200, activeUsers: 890 },
    { month: 'Feb', users: 1450, activeUsers: 1100 },
    { month: 'Mar', users: 1680, activeUsers: 1280 },
    { month: 'Apr', users: 1920, activeUsers: 1450 },
    { month: 'May', users: 2150, activeUsers: 1620 },
    { month: 'Jun', users: 2380, activeUsers: 1820 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Performance Overview</p>
      </div>

      {/* Revenue Chart - intentional bug: missing height prop */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue & Expenses</CardTitle>
          <CardDescription>Track revenue and expenses trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
              <Bar dataKey="expenses" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Growth Chart - intentional bug: wrong prop name */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth Trends</CardTitle>
          <CardDescription>Total users vs active users over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" strokeColor="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
