import { useState, useEffect } from 'react';
import { CreditCard, Download, Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  plan_name: string;
  billing_period_start: string;
  billing_period_end: string;
  created_at: string;
  paid_at: string | null;
}

export default function BillingSection() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('subscription_invoices')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inv.plan_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-900/30 border-green-600/30 text-green-400';
      case 'pending': return 'bg-yellow-900/30 border-yellow-600/30 text-yellow-400';
      case 'failed': return 'bg-red-900/30 border-red-600/30 text-red-400';
      default: return 'bg-gray-700/30 border-gray-600/30 text-gray-400';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-orange-500" />
          Billing & Subscription
        </h1>
        <p className="text-gray-400">Manage your subscription and view payment history</p>
      </div>

      <div className="mb-6 grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-900 border border-blue-600/30 rounded-xl p-4">
          <CreditCard className="h-6 w-6 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">Pro Plan</p>
          <p className="text-xs text-gray-400">Current Plan</p>
        </div>
        <div className="bg-gradient-to-br from-green-900/30 via-green-800/20 to-gray-900 border border-green-600/30 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Next Billing</p>
          <p className="text-lg font-bold text-white">Jan 1, 2025</p>
          <p className="text-xs text-gray-500">$49.99/month</p>
        </div>
        <div className="bg-gradient-to-br from-orange-900/30 via-orange-800/20 to-gray-900 border border-orange-600/30 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Total Paid</p>
          <p className="text-lg font-bold text-white">$599.88</p>
          <p className="text-xs text-gray-500">Lifetime</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-gray-900 border border-purple-600/30 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Payment Method</p>
          <p className="text-lg font-bold text-white">•••• 4242</p>
          <p className="text-xs text-gray-500">Visa</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">{invoice.invoice_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{invoice.plan_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                    ${invoice.amount.toFixed(2)} {invoice.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-orange-400 hover:text-orange-300 flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
