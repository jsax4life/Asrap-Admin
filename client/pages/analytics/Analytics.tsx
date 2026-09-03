import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { AnalyticsMetricCard } from '@/components/analytics/AnalyticsMetricCard';
import { FilterDropdown } from '@/components/analytics/FilterDropdown';
import { DailyDataList } from '@/components/analytics/DailyDataList';
import { AnalyticsLineChart } from '@/components/analytics/AnalyticsLineChart';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Statistiques (à connecter au service backend)
const analyticsMetrics: { label: string; value: string; trend: 'up' | 'down' }[] = [
  { label: 'Écoutes', value: '0', trend: 'up' },
  { label: 'Auditeurs quotidiens moy.', value: '0', trend: 'up' },
  { label: 'Abonnés', value: '0', trend: 'up' },
  { label: "Mentions J'aime", value: '0', trend: 'up' },
  { label: 'Téléchargements', value: '0', trend: 'up' },
];

const reportMetrics: { label: string; value: string; trend: 'up' | 'down' }[] = [
  { label: 'Utilisateurs', value: '0', trend: 'up' },
  { label: 'Utilisateurs abonnés', value: '0', trend: 'up' },
  { label: 'Nouveaux utilisateurs', value: '0', trend: 'up' },
  { label: 'Anciens utilisateurs', value: '0', trend: 'up' },
  { label: 'Abonnements échoués', value: '0', trend: 'down' },
];

const dailyData = [
  { label: '7 derniers jours', value: 0 },
  { label: 'Lundi', value: 0 },
  { label: 'Mardi', value: 0 },
  { label: 'Mercredi', value: 0 },
  { label: 'Jeudi', value: 0 },
  { label: 'Vendredi', value: 0 },
  { label: 'Samedi', value: 0 },
  { label: 'Dimanche', value: 0 },
];

const subscriptionMetrics = [
  { label: 'Inscription commencée', value: 0 },
  { label: 'Inscription terminée', value: 0 },
  { label: 'Abonnement commencé', value: 0 },
  { label: 'Abonnement terminé..', value: 0 },
];

// Données du graphique (à connecter au service backend)
const chartData = [
  { day: 'Lun', value: 0 },
  { day: 'Mar', value: 0 },
  { day: 'Mer', value: 0 },
  { day: 'Jeu', value: 0 },
  { day: 'Ven', value: 0 },
  { day: 'Sam', value: 0 },
  { day: 'Dim', value: 0 },
];

export default function Analytics() {
  const [selectedFilter, setSelectedFilter] = useState('Tout');
  const [selectedMetric, setSelectedMetric] = useState('Écoutes');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7 derniers jours');
  const [selectedReportMetric, setSelectedReportMetric] = useState('Utilisateurs');
  const [selectedReportTimeframe, setSelectedReportTimeframe] = useState('7 derniers jours');

  return (
    <div className="space-y-8">
      {/* Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl lg:text-2xl font-bold">
            Toutes vos statistiques en un coup d'œil
          </h2>
          <FilterDropdown
            value={selectedFilter}
            onChange={setSelectedFilter}
            options={['Tout', 'Musique', 'Utilisateurs', 'Revenus']}
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
            options={['Écoutes', 'Auditeurs', 'Téléchargements', 'Revenus']}
          />
          <FilterDropdown
            value={selectedTimeframe}
            onChange={setSelectedTimeframe}
            options={['7 derniers jours', '30 derniers jours', '3 derniers mois', 'L\'an dernier']}
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
                    value="Par titres"
                    onChange={() => {}}
                    options={['Par titres', 'Par artistes', 'Par albums']}
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
          Tous vos rapports en un coup d'œil
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
            options={['Utilisateurs', 'Abonnements', 'Revenus', 'Engagement']}
          />
          <FilterDropdown
            value={selectedReportTimeframe}
            onChange={setSelectedReportTimeframe}
            options={['7 derniers jours', '30 derniers jours', '3 derniers mois', 'L\'an dernier']}
          />
        </div>

        {/* Subscription Metrics and Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Statistiques d'abonnement</h3>
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
