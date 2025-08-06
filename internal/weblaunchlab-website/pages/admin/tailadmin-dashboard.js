import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/Layout';
import StatsCard from '../../components/admin/StatsCard';
import DataTable from '../../components/admin/DataTable';

export default function AdminDashboard() {
  const [deals, setDeals] = useState([]);
  const [recentDeals, setRecentDeals] = useState([]);
  const [stats, setStats] = useState({
    totalDeals: 0,
    totalValue: 0,
    wonDeals: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    avgDealSize: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/hubspot-deals');
      if (response.ok) {
        const data = await response.json();
        setDeals(data);
        
        // Get recent deals (last 5)
        const sortedDeals = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentDeals(sortedDeals.slice(0, 5));
        
        // Calculate stats
        const totalValue = data.reduce((sum, deal) => sum + (deal.amount || 0), 0);
        const wonDeals = data.filter(deal => deal.stage === 'closedwon');
        const monthlyRevenue = wonDeals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
        const conversionRate = data.length > 0 ? ((wonDeals.length / data.length) * 100) : 0;
        const avgDealSize = data.length > 0 ? totalValue / data.length : 0;
        
        setStats({
          totalDeals: data.length,
          totalValue,
          wonDeals: wonDeals.length,
          monthlyRevenue,
          conversionRate,
          avgDealSize
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      'appointmentscheduled': 'bg-blue-100 text-blue-800',
      'qualifiedtobuy': 'bg-yellow-100 text-yellow-800',
      'presentationscheduled': 'bg-purple-100 text-purple-800',
      'decisionmakerboughtin': 'bg-green-100 text-green-800',
      'contractsent': 'bg-orange-100 text-orange-800',
      'closedwon': 'bg-green-200 text-green-900',
      'closedlost': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const formatStage = (stage) => {
    const labels = {
      'appointmentscheduled': 'Appointment',
      'qualifiedtobuy': 'Qualified',
      'presentationscheduled': 'Presentation',
      'decisionmakerboughtin': 'Decision Maker',
      'contractsent': 'Contract Sent',
      'closedwon': 'Won',
      'closedlost': 'Lost'
    };
    return labels[stage] || stage;
  };

  const recentDealsColumns = [
    {
      key: 'name',
      label: 'Deal',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Value',
      render: (value) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${value?.toLocaleString() || '0'}
        </span>
      )
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(value)}`}>
          {formatStage(value)}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatsCard
            title="Total Deals"
            value={stats.totalDeals}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          
          <StatsCard
            title="Pipeline Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />
          
          <StatsCard
            title="Won Deals"
            value={stats.wonDeals}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <StatsCard
            title="Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          
          <StatsCard
            title="Conversion"
            value={`${stats.conversionRate.toFixed(1)}%`}
            color="orange"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            }
          />
          
          <StatsCard
            title="Avg Deal Size"
            value={`$${Math.round(stats.avgDealSize).toLocaleString()}`}
            color="gray"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Deals */}
          <DataTable
            title="Recent Deals"
            data={recentDeals}
            columns={recentDealsColumns}
            actions={[
              <button
                key="view-all"
                onClick={() => window.location.href = '/admin/crm'}
                className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600"
              >
                View All
              </button>
            ]}
            emptyState={{
              title: "No deals yet",
              description: "Start by capturing leads from your website or create deals in HubSpot."
            }}
          />

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                <button 
                  onClick={() => window.location.href = '/admin/contacts'}
                  className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-3 group-hover:bg-blue-200">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Add New Prospect</h4>
                      <p className="text-sm text-gray-500">Create new contact in HubSpot</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href = '/admin/crm'}
                  className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg mr-3 group-hover:bg-purple-200">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Manage Pipeline</h4>
                      <p className="text-sm text-gray-500">Update deal stages & progress</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href = '/admin/invoices'}
                  className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg mr-3 group-hover:bg-green-200">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Create Invoice</h4>
                      <p className="text-sm text-gray-500">Generate invoices for won deals</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => window.open('https://app.hubspot.com/', '_blank')}
                  className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg mr-3 group-hover:bg-orange-200">
                      <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Open HubSpot</h4>
                      <p className="text-sm text-gray-500">Access full HubSpot CRM</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}