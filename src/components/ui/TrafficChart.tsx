import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const trafficData = [
  { month: 'January', visitors: 400 },
  { month: 'February', visitors: 300 },
  // Adding missing data for March and August to make the data continuous
  { month: 'March', visitors: 500 },
  { month: 'April', visitors: 700 },
  { month: 'May', visitors: 600 },
  { month: 'June', visitors: 800 },
  { month: 'July', visitors: 650 },
  { month: 'August', visitors: 720 },
  { month: 'September', visitors: 790 },
  { month: 'October', visitors: 930 },
  { month: 'November', visitors: 1000 },
  { month: 'December', visitors: 1100 }
];

const TrafficChart = () => (
  <LineChart width={600} height={400} data={trafficData}>
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
  </LineChart>
);

export default TrafficChart;