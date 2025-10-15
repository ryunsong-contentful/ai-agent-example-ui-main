import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { ChartComponent } from '@/components/ui/chart';
import { fetchAnalyticsData } from '@/api/analytics';

/**
 * Analytics Page
 * 
 * This page displays the analytics charts which fit within the main layout.
 * Ensures that charts have proper spacing and do not cause a scroll.
 */
const Analytics = () => {
  const { data, isLoading, isError } = useQuery('analyticsData', fetchAnalyticsData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching analytics data!</div>;
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-4 p-4">
        <h1 className="text-xl font-semibold">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.charts.map((chart) => (
            <div key={chart.id} className="bg-white shadow rounded-lg p-4">
              <ChartComponent chartData={chart.data} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;