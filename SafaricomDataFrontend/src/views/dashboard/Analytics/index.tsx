import React from 'react';
import { AnalyticsDataProvider } from './AnalyticsData';
import AnalyticsContent from './AnalyticsContent';

const Analytics = () => {
  return (
    <AnalyticsDataProvider>
      <AnalyticsContent />
    </AnalyticsDataProvider>
  );
};

export default Analytics;