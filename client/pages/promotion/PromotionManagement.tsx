import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  User, 
  Plus, 
  Filter, 
  MoreVertical, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  Users,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Megaphone
} from 'lucide-react';

// Campagnes de promotion (à connecter au service backend)
const mockCampaigns: {
  id: number;
  name: string;
  type: string;
  status: string;
  targetAudience: string;
  budget: string;
  spent: string;
  reach: string;
  engagement: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  description: string;
  platforms: string[];
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
}[] = [];

const statusColors = {
  Active: 'bg-green-500',
  Paused: 'bg-yellow-500',
  Completed: 'bg-blue-500',
  Draft: 'bg-gray-500'
};

const statusLabels: Record<string, string> = {
  Active: 'Actif',
  Paused: 'En pause',
  Completed: 'Terminé',
  Draft: 'Brouillon'
};

const PromotionManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getFilteredCampaigns = () => {
    let filtered = mockCampaigns;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.targetAudience.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.type === typeFilter);
    }

    return filtered;
  };

  const handleCreateCampaign = () => {
    navigate('/promotion/create');
  };

  const handleViewCampaign = (campaignId: number) => {
    navigate(`/promotion/view/${campaignId}`);
  };

  const handleEditCampaign = (campaignId: number) => {
    navigate(`/promotion/edit/${campaignId}`);
  };

  const handleDeleteCampaign = (campaignId: number) => {
    console.log('Delete campaign:', campaignId);
    // TODO: Implement delete functionality
  };

  const handleToggleStatus = (campaignId: number, currentStatus: string) => {
    console.log('Toggle status for campaign:', campaignId, currentStatus);
    // TODO: Implement status toggle functionality
  };

  const filteredCampaigns = getFilteredCampaigns();

  return (
    <div className="min-h-screen bg-asra-dark text-white">
      {/* Header */}
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Date */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-asra-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white text-xl font-bold">Asrapa</span>
            </div>
            <div className="flex items-center space-x-2 text-asra-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Date : 03/02/2023</span>
            </div>
          </div>

          {/* Center - Page Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-white">Gestion des promotions</h1>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des campagnes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-asra-gray-400" />
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm">Administrateur système</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Action Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCreateCampaign}
              className="bg-asra-red hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Créer une campagne</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-asra-red text-white' : 'bg-asra-gray-800 text-asra-gray-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-asra-red text-white' : 'bg-asra-gray-800 text-asra-gray-400 hover:text-white'
                }`}
              >
                <Megaphone className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white focus:outline-none focus:border-asra-red"
            >
              <option value="all">Tous les statuts</option>
              <option value="Active">Actif</option>
              <option value="Paused">En pause</option>
              <option value="Completed">Terminé</option>
              <option value="Draft">Brouillon</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white focus:outline-none focus:border-asra-red"
            >
              <option value="all">Tous les types</option>
              <option value="Event Promotion">Promotion d'événement</option>
              <option value="Artist Promotion">Promotion d'artiste</option>
              <option value="Album Promotion">Promotion d'album</option>
              <option value="Seasonal Promotion">Promotion saisonnière</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white focus:outline-none focus:border-asra-red"
            >
              <option value="createdAt">Trier par date</option>
              <option value="name">Trier par nom</option>
              <option value="budget">Trier par budget</option>
              <option value="reach">Trier par portée</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-asra-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-asra-gray-400 text-sm font-medium">Total des campagnes</p>
                <p className="text-2xl font-bold text-white">{mockCampaigns.length}</p>
              </div>
              <div className="w-12 h-12 bg-asra-red/20 rounded-lg flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-asra-red" />
              </div>
            </div>
          </div>

          <div className="bg-asra-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-asra-gray-400 text-sm font-medium">Campagnes actives</p>
                <p className="text-2xl font-bold text-white">
                  {mockCampaigns.filter(c => c.status === 'Active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-asra-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-asra-gray-400 text-sm font-medium">Budget total</p>
                <p className="text-2xl font-bold text-white">
                  {mockCampaigns.reduce((sum, c) => sum + parseInt(c.budget.replace('$', '').replace(',', '')), 0).toLocaleString('fr-FR')} FCFA
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-asra-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-asra-gray-400 text-sm font-medium">Portée totale</p>
                <p className="text-2xl font-bold text-white">
                  {mockCampaigns.reduce((sum, c) => sum + parseInt(c.reach.replace('K', '')), 0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-asra-gray-900 rounded-lg p-6 hover:bg-asra-gray-800 transition-colors">
                {/* Campaign Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{campaign.name}</h3>
                    <p className="text-asra-gray-400 text-sm">{campaign.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[campaign.status as keyof typeof statusColors]}`}>
                      {statusLabels[campaign.status] || campaign.status}
                    </span>
                    <button className="text-asra-gray-400 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Campaign Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-asra-gray-400 text-xs">Budget</p>
                    <p className="text-white font-semibold">{campaign.budget}</p>
                  </div>
                  <div>
                    <p className="text-asra-gray-400 text-xs">Dépensé</p>
                    <p className="text-white font-semibold">{campaign.spent}</p>
                  </div>
                  <div>
                    <p className="text-asra-gray-400 text-xs">Portée</p>
                    <p className="text-white font-semibold">{campaign.reach}</p>
                  </div>
                  <div>
                    <p className="text-asra-gray-400 text-xs">Engagement</p>
                    <p className="text-white font-semibold">{campaign.engagement}</p>
                  </div>
                </div>

                {/* Platforms */}
                <div className="mb-4">
                  <p className="text-asra-gray-400 text-xs mb-2">Plateformes</p>
                  <div className="flex flex-wrap gap-1">
                    {campaign.platforms.map((platform, index) => (
                      <span key={index} className="px-2 py-1 bg-asra-gray-800 text-asra-gray-300 text-xs rounded">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewCampaign(campaign.id)}
                      className="p-2 text-asra-gray-400 hover:text-white hover:bg-asra-gray-800 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditCampaign(campaign.id)}
                      className="p-2 text-asra-gray-400 hover:text-white hover:bg-asra-gray-800 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="p-2 text-asra-gray-400 hover:text-red-400 hover:bg-asra-gray-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      campaign.status === 'Active'
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {campaign.status === 'Active' ? 'Mettre en pause' : 'Reprendre'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-asra-gray-900 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-asra-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Campagne</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Budget</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Portée</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Engagement</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-asra-gray-700">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-asra-gray-800 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{campaign.name}</p>
                          <p className="text-asra-gray-400 text-sm">{campaign.targetAudience}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{campaign.type}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[campaign.status as keyof typeof statusColors]}`}>
                          {statusLabels[campaign.status] || campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{campaign.budget}</td>
                      <td className="px-6 py-4 text-sm text-white">{campaign.reach}</td>
                      <td className="px-6 py-4 text-sm text-white">{campaign.engagement}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewCampaign(campaign.id)}
                            className="p-2 text-asra-gray-400 hover:text-white hover:bg-asra-gray-700 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditCampaign(campaign.id)}
                            className="p-2 text-asra-gray-400 hover:text-white hover:bg-asra-gray-700 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="p-2 text-asra-gray-400 hover:text-red-400 hover:bg-asra-gray-700 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-asra-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Aucune campagne trouvée</h3>
            <p className="text-asra-gray-400 mb-6">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Essayez d\'ajuster vos filtres pour voir plus de résultats.'
                : 'Commencez par créer votre première campagne de promotion.'}
            </p>
            <button
              onClick={handleCreateCampaign}
              className="bg-asra-red hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Créer une campagne
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionManagement;
