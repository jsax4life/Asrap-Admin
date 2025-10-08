import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { AnalyticsMetricCard } from '@/components/analytics/AnalyticsMetricCard';
import { FilterDropdown } from '@/components/analytics/FilterDropdown';
import { DailyDataList } from '@/components/analytics/DailyDataList';
import { AnalyticsLineChart } from '@/components/analytics/AnalyticsLineChart';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Mock data for analytics
const analyticsMetrics = [
  { label: 'Plays', value: '1.5M', trend: 'up' },
  { label: 'Avg. Daily listeners', value: '1.5M', trend: 'up' },
  { label: 'Subscribers', value: '1.5M', trend: 'up' },
  { label: 'Likes', value: '1.5M', trend: 'up' },
  { label: 'Downloads', value: '1.5M', trend: 'up' },
];

const reportMetrics = [
  { label: 'Users', value: '2.5M', trend: 'up' },
  { label: 'Subscribed users', value: '1.5M', trend: 'up' },
  { label: 'New users', value: '500K', trend: 'up' },
  { label: 'Old users', value: '1.5M', trend: 'up' },
  { label: 'Failed subscriptions', value: '1K', trend: 'down' },
];

const dailyData = [
  { label: 'Last 7 days', value: 0 },
  { label: 'Monday', value: 0 },
  { label: 'Tuesday', value: 0 },
  { label: 'Wednesday', value: 0 },
  { label: 'Thursday', value: 0 },
  { label: 'Friday', value: 0 },
  { label: 'Saturday', value: 0 },
  { label: 'Sunday', value: 0 },
];

const subscriptionMetrics = [
  { label: 'Started signup', value: 0 },
  { label: 'Completed sign up', value: 0 },
  { label: 'Started subscription', value: 0 },
  { label: 'Completed subscrip..', value: 0 },
];

// Mock chart data
const chartData = [
  { day: 'Mon', value: 500000 },
  { day: 'Tue', value: 750000 },
  { day: 'Wed', value: 600000 },
  { day: 'Thu', value: 800563 },
  { day: 'Fri', value: 900000 },
  { day: 'Sat', value: 700000 },
  { day: 'Sun', value: 650000 },
];

export default function Analytics() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedMetric, setSelectedMetric] = useState('Plays');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 7 days');
  const [selectedReportMetric, setSelectedReportMetric] = useState('Users');
  const [selectedReportTimeframe, setSelectedReportTimeframe] = useState('Last 7 days');

  return (
    <div className="space-y-8">
      {/* Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl lg:text-2xl font-bold">
            All your analytics at a glance
          </h2>
          <FilterDropdown
            value={selectedFilter}
            onChange={setSelectedFilter}
            options={['All', 'Music', 'Users', 'Revenue']}
            icon="A"
          />
        </div>

        {/* Analytics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {analyticsMetrics.map((metric, index) => (
            <AnalyticsMetricCard
              key={index}
              label={metric.label}
              value={metric.value}
              trend={metric.trend}
            />
          ))}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <FilterDropdown
            value={selectedMetric}
            onChange={setSelectedMetric}
            options={['Plays', 'Listeners', 'Downloads', 'Revenue']}
          />
          <FilterDropdown
            value={selectedTimeframe}
            onChange={setSelectedTimeframe}
            options={['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last year']}
          />
        </div>

        {/* Daily Data and Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-4">
            <DailyDataList 
              data={dailyData} 
              filterDropdown={
                <div className="flex items-center gap-3 mb-4">
                  <FilterDropdown
                    value="By songs"
                    onChange={() => {}}
                    options={['By songs', 'By artists', 'By albums']}
                  />
                  <div className="w-8 h-8 bg-asra-gray-2 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">O</span>
                  </div>
                </div>
              }
            />
          </div>
          
          <div className="bg-asra-gray-1 rounded-lg p-6">
            <AnalyticsLineChart data={chartData} />
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="space-y-6">
        <h2 className="text-white text-xl lg:text-2xl font-bold">
          All your reports at a glance
        </h2>

        {/* Report Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {reportMetrics.map((metric, index) => (
            <AnalyticsMetricCard
              key={index}
              label={metric.label}
              value={metric.value}
              trend={metric.trend}
            />
          ))}
        </div>

        {/* Report Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <FilterDropdown
            value={selectedReportMetric}
            onChange={setSelectedReportMetric}
            options={['Users', 'Subscriptions', 'Revenue', 'Engagement']}
          />
          <FilterDropdown
            value={selectedReportTimeframe}
            onChange={setSelectedReportTimeframe}
            options={['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last year']}
          />
        </div>

        {/* Subscription Metrics and Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Subscription Metrics</h3>
            <div className="space-y-3">
              {subscriptionMetrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-asra-gray-6 text-sm">{metric.label}</span>
                  <span className="text-white text-sm font-semibold">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-asra-gray-1 rounded-lg p-6">
            <AnalyticsLineChart data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
