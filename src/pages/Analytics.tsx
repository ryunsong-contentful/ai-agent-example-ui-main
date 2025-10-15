import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const Analytics: React.FC = () => {
  // Mocked data for revenue - intentional bug: inconsistent data length
  const revenueData = [
    { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'Mar', revenue: 48000, expenses: 31000, profit: 17000 },
    { month: 'Apr', revenue: 61000, expenses: 42000, profit: 19000 },
    { month: 'May', revenue: 55000, expenses: 38000, profit: 17000 },
    { month: 'Jun', revenue: 67000, expenses: 45000, profit: 22000 },
    { month: 'Jul', revenue: 72000, expenses: 48000, profit: 24000 },
    { month: 'Aug', revenue: 68000, expenses: 46000, profit: 22000 },
    { month: 'Sep', revenue: 74000, expenses: 50000, profit: 24000 },
    { month: 'Oct', revenue: 81000, expenses: 54000, profit: 27000 },
    { month: 'Nov', revenue: 88000, expenses: 58000, profit: 30000 },
    { month: 'Dec', revenue: 95000, expenses: 62000, profit: 33000 },
  ];

  // Mocked data for user growth - intentional bug: wrong data type for users
  const userGrowthData = [
    { month: 'Jan', users: '1200', activeUsers: 890 },
    { month: 'Feb', users: '1450', activeUsers: 1100 },
    { month: 'Mar', users: '1680', activeUsers: 1280 },
    { month: 'Apr', users: '1920', activeUsers: 1450 },
    { month: 'May', users: 2150, activeUsers: 1620 },
    { month: 'Jun', users: 2380, activeUsers: 1820 },
    { month: 'Jul', users: 2650, activeUsers: 2010 },
    { month: 'Aug', users: 2890, activeUsers: 2180 },
    { month: 'Sep', users: 3120, activeUsers: 2380 },
    { month: 'Oct', users: 3420, activeUsers: 2610 },
    { month: 'Nov', users: 3680, activeUsers: 2820 },
    { month: 'Dec', users: 3950, activeUsers: 3020 },
  ];

  // Mocked data for product performance
  const productData = [
    { product: 'Product A', sales: 4200, returns: 180 },
    { product: 'Product B', sales: 3800, returns: 220 },
    { product: 'Product C', sales: 5100, returns: 150 },
    { product: 'Product D', sales: 2900, returns: 280 },
    { product: 'Product E', sales: 4600, returns: 190 },
    { product: 'Product F', sales: 3200, returns: 240 },
    { product: 'Product G', sales: 5500, returns: 120 },
    { product: 'Product H', sales: 4100, returns: 210 },
  ];

  // Mocked data for website traffic - intentional bug: missing some months
  const trafficData = [
    { month: 'Jan', pageViews: 125000, uniqueVisitors: 45000 },
    { month: 'Feb', pageViews: 142000, uniqueVisitors: 52000 },
    { month: 'Apr', pageViews: 168000, uniqueVisitors: 61000 },
    { month: 'May', pageViews: 175000, uniqueVisitors: 65000 },
    { month: 'Jun', pageViews: 189000, uniqueVisitors: 72000 },
    { month: 'Jul', pageViews: 201000, uniqueVisitors: 78000 },
    { month: 'Sep', pageViews: 218000, uniqueVisitors: 84000 },
    { month: 'Oct', pageViews: 235000, uniqueVisitors: 91000 },
    { month: 'Nov', pageViews: 248000, uniqueVisitors: 96000 },
    { month: 'Dec', pageViews: 265000, uniqueVisitors: 102000 },
  ];

  // Mocked data for regional sales
  const regionalData = [
    { region: 'North America', q1: 125000, q2: 142000, q3: 158000, q4: 172000 },
    { region: 'Europe', q1: 98000, q2: 112000, q3: 128000, q4: 145000 },
    { region: 'Asia Pacific', q1: 156000, q2: 178000, q3: 195000, q4: 218000 },
    { region: 'Latin America', q1: 67000, q2: 75000, q3: 82000, q4: 91000 },
    { region: 'Middle East', q1: 45000, q2: 52000, q3: 58000, q4: 65000 },
    { region: 'Africa', q1: 32000, q2: 38000, q3: 42000, q4: 48000 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Year 2024 Performance Overview</p>
      </div>

      {/* Revenue Chart - intentional bug: missing height causing display issues */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue & Expenses</CardTitle>
          <CardDescription>Track revenue, expenses, and profit trends</CardDescription>
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
              <Bar dataKey="profit" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Growth Chart */}
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
              <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Product Performance Chart - intentional bug: wrong color prop name */}
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>Sales and returns by product</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={productData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fillColor="#4f46e5" />
              <Bar dataKey="returns" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Traffic Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Website Traffic</CardTitle>
          <CardDescription>Page views and unique visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pageViews" stroke="#8b5cf6" strokeWidth={3} />
              <Line type="monotone" dataKey="uniqueVisitors" stroke="#ec4899" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Regional Sales Chart - intentional bug: too many bars making it cluttered */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Regional Sales by Quarter</CardTitle>
          <CardDescription>Quarterly performance across different regions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="q1" fill="#ef4444" />
              <Bar dataKey="q2" fill="#f97316" />
              <Bar dataKey="q3" fill="#84cc16" />
              <Bar dataKey="q4" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional metrics section - intentional bug: overflow issue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">$823,000</p>
            <p className="text-sm text-muted-foreground mt-2">+18.5% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">3,950</p>
            <p className="text-sm text-muted-foreground mt-2">+229% growth</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-purple-600">4.8%</p>
            <p className="text-sm text-muted-foreground mt-2">+0.8% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
