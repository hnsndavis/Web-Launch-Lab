import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/Layout';
import StatsCard from '../../components/admin/StatsCard';
import DataTable from '../../components/admin/DataTable';

export default function AdminCRM() {
  const [deals, setDeals] = useState([]);
  const [stats, setStats] = useState({
    totalDeals: 0,
    totalValue: 0,
    wonDeals: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/admin/hubspot-deals');
      if (response.ok) {
        const data = await response.json();
        setDeals(data);
        
        // Calculate stats
        const totalValue = data.reduce((sum, deal) => sum + (deal.amount || 0), 0);
        const wonDeals = data.filter(deal => deal.stage === 'closedwon').length;
        const conversionRate = data.length > 0 ? ((wonDeals / data.length) * 100) : 0;
        
        setStats({
          totalDeals: data.length,
          totalValue,
          wonDeals,
          conversionRate
        });
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDealStage = async (dealId, newStage) => {
    try {
      const response = await fetch('/api/admin/hubspot-deals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId,
          stage: newStage
        }),
      });

      if (response.ok) {
        await fetchDeals(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating deal:', error);
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

  const columns = [
    {
      key: 'name',
      label: 'Deal Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500">{row.type}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Value',
      sortable: true,
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
    },
    {
      key: 'source',
      label: 'Source',
      render: (value) => (
        <span className="text-gray-600 dark:text-gray-400 capitalize">
          {value || 'Unknown'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600 dark:text-gray-400">
          {value ? new Date(value).toLocaleDateString() : '-'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <select
            className="text-xs border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            defaultValue={row.stage}
            onChange={(e) => updateDealStage(row.id, e.target.value)}
          >
            <option value="appointmentscheduled">Appointment</option>
            <option value="qualifiedtobuy">Qualified</option>
            <option value="presentationscheduled">Presentation</option>
            <option value="decisionmakerboughtin">Decision Maker</option>
            <option value="contractsent">Contract Sent</option>
            <option value="closedwon">Won</option>
            <option value="closedlost">Lost</option>
          </select>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="CRM Pipeline">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="CRM Pipeline">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            title="Total Value"
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
            title="Conversion Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            color="orange"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>

        {/* Deals Table */}
        <DataTable
          title="All Deals"
          data={deals}
          columns={columns}
          actions={[
            <button
              key="refresh"
              onClick={fetchDeals}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Refresh
            </button>,
            <button
              key="hubspot"
              onClick={() => window.open('https://app.hubspot.com/', '_blank')}
              className="px-3 py-1.5 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
            >
              Open HubSpot
            </button>
          ]}
          emptyState={{
            title: "No deals found",
            description: "Start by capturing leads from your website or create deals manually in HubSpot."
          }}
        />
      </div>
    </AdminLayout>
  );
}