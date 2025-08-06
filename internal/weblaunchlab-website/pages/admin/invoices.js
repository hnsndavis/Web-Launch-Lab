import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/Layout';
import StatsCard from '../../components/admin/StatsCard';
import DataTable from '../../components/admin/DataTable';

export default function AdminInvoices() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/admin/hubspot-deals');
      if (response.ok) {
        const data = await response.json();
        // Only show deals ready for invoicing
        const invoiceableDeals = data.filter(deal => 
          ['decisionmakerboughtin', 'contractsent', 'closedwon'].includes(deal.stage) && 
          deal.amount > 0
        );
        setDeals(invoiceableDeals);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (deal) => {
    try {
      const response = await fetch('/api/invoices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId: deal.id,
          amount: deal.amount,
          description: `Website development services - ${deal.name}`,
          customerEmail: 'customer@example.com', // Would get from contact
          customerName: deal.name,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Invoice created successfully! Invoice ID: ${result.invoiceId}`);
      } else {
        alert('Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice');
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      'decisionmakerboughtin': 'bg-green-100 text-green-800',
      'contractsent': 'bg-orange-100 text-orange-800',
      'closedwon': 'bg-green-200 text-green-900'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const formatStage = (stage) => {
    const labels = {
      'decisionmakerboughtin': 'Decision Maker Bought In',
      'contractsent': 'Contract Sent',
      'closedwon': 'Closed Won'
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
          <div className="text-sm text-gray-500">{row.source || 'Website'}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Invoice Amount',
      sortable: true,
      render: (value) => (
        <span className="text-lg font-bold text-green-600">
          ${value?.toLocaleString() || '0'}
        </span>
      )
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (value) => (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStageColor(value)}`}>
          {formatStage(value)}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Deal Created',
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
        <button
          onClick={() => createInvoice(row)}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
        >
          Create Invoice
        </button>
      )
    }
  ];

  const totalInvoiceValue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
  const avgDealValue = deals.length > 0 ? totalInvoiceValue / deals.length : 0;

  if (loading) {
    return (
      <AdminLayout title="Invoicing">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Invoicing">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Ready to Invoice"
            value={`$${totalInvoiceValue.toLocaleString()}`}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />
          
          <StatsCard
            title="Invoice Count"
            value={deals.length}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          
          <StatsCard
            title="Average Deal"
            value={`$${Math.round(avgDealValue).toLocaleString()}`}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>

        {/* Invoiceable Deals */}
        <DataTable
          title="Ready to Invoice"
          data={deals}
          columns={columns}
          actions={[
            <button
              key="refresh"
              onClick={fetchDeals}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Refresh
            </button>
          ]}
          emptyState={{
            title: "No deals ready for invoicing",
            description: "Move deals to qualified stages in your CRM first, then return here to create invoices."
          }}
        />

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => window.location.href = '/admin/crm'}
              className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">View CRM Pipeline</h4>
                  <p className="text-sm text-gray-500">Manage deal stages</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => window.open('https://app.hubspot.com/', '_blank')}
              className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Open HubSpot</h4>
                  <p className="text-sm text-gray-500">Manage contacts & deals</p>
                </div>
              </div>
            </button>

            <div className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg opacity-50">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Stripe Integration</h4>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}