import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/common/PageHeader';
import { AnalyticsMetricCard } from '@/components/analytics/AnalyticsMetricCard';
import { FilterDropdown } from '@/components/analytics/FilterDropdown';
import { DailyDataList } from '@/components/analytics/DailyDataList';
import { AnalyticsLineChart } from '@/components/analytics/AnalyticsLineChart';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Analytics() {
  const { t } = useTranslation('analytics');

  // Statistiques (à connecter au service backend)
  const analyticsMetrics: { label: string; value: string; trend: 'up' | 'down' }[] = [
    { label: t('metrics.plays'), value: '0', trend: 'up' },
    { label: t('metrics.avgDailyListeners'), value: '0', trend: 'up' },
    { label: t('metrics.subscribers'), value: '0', trend: 'up' },
    { label: t('metrics.likes'), value: '0', trend: 'up' },
    { label: t('metrics.downloads'), value: '0', trend: 'up' },
  ];

  const reportMetrics: { label: string; value: string; trend: 'up' | 'down' }[] = [
    { label: t('reportMetrics.users'), value: '0', trend: 'up' },
    { label: t('reportMetrics.subscribedUsers'), value: '0', trend: 'up' },
    { label: t('reportMetrics.newUsers'), value: '0', trend: 'up' },
    { label: t('reportMetrics.returningUsers'), value: '0', trend: 'up' },
    { label: t('reportMetrics.failedSubscriptions'), value: '0', trend: 'down' },
  ];

  const dailyData = [
    { label: t('days.last7Days'), value: 0 },
    { label: t('days.monday'), value: 0 },
    { label: t('days.tuesday'), value: 0 },
    { label: t('days.wednesday'), value: 0 },
    { label: t('days.thursday'), value: 0 },
    { label: t('days.friday'), value: 0 },
    { label: t('days.saturday'), value: 0 },
    { label: t('days.sunday'), value: 0 },
  ];

  const subscriptionMetrics = [
    { label: t('subscriptionMetrics.signupStarted'), value: 0 },
    { label: t('subscriptionMetrics.signupCompleted'), value: 0 },
    { label: t('subscriptionMetrics.subscriptionStarted'), value: 0 },
    { label: t('subscriptionMetrics.subscriptionEnded'), value: 0 },
  ];

  // Données du graphique (à connecter au service backend)
  const chartData = [
    { day: t('chartDays.mon'), value: 0 },
    { day: t('chartDays.tue'), value: 0 },
    { day: t('chartDays.wed'), value: 0 },
    { day: t('chartDays.thu'), value: 0 },
    { day: t('chartDays.fri'), value: 0 },
    { day: t('chartDays.sat'), value: 0 },
    { day: t('chartDays.sun'), value: 0 },
  ];

  const [selectedFilter, setSelectedFilter] = useState(t('filters.all'));
  const [selectedMetric, setSelectedMetric] = useState(t('metrics.plays'));
  const [selectedTimeframe, setSelectedTimeframe] = useState(t('filters.last7Days'));
  const [selectedReportMetric, setSelectedReportMetric] = useState(t('filters.users'));
  const [selectedReportTimeframe, setSelectedReportTimeframe] = useState(t('filters.last7Days'));

  return (
    <div className="space-y-8">
      {/* Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl lg:text-2xl font-bold">
            {t('sections.statsOverview')}
          </h2>
          <FilterDropdown
            value={selectedFilter}
            onChange={setSelectedFilter}
            options={[t('filters.all'), t('filters.music'), t('filters.users'), t('filters.revenue')]}
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
            options={[t('metrics.plays'), t('filters.listeners'), t('filters.downloads'), t('filters.revenue')]}
          />
          <FilterDropdown
            value={selectedTimeframe}
            onChange={setSelectedTimeframe}
            options={[t('filters.last7Days'), t('filters.last30Days'), t('filters.last3Months'), t('filters.lastYear')]}
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
                    value={t('filters.byTitle')}
                    onChange={() => {}}
                    options={[t('filters.byTitle'), t('filters.byArtist'), t('filters.byAlbum')]}
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
          {t('sections.reportsOverview')}
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
            options={[t('filters.users'), t('filters.subscriptions'), t('filters.revenue'), t('filters.engagement')]}
          />
          <FilterDropdown
            value={selectedReportTimeframe}
            onChange={setSelectedReportTimeframe}
            options={[t('filters.last7Days'), t('filters.last30Days'), t('filters.last3Months'), t('filters.lastYear')]}
          />
        </div>

        {/* Subscription Metrics and Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">{t('sections.subscriptionStats')}</h3>
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
