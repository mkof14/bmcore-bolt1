import { useState, useEffect } from 'react';
import { Users, TrendingUp, Activity, Ban, CheckCircle, XCircle, Mail, Calendar, Clock, Filter, Download, UserX, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newThisMonth: number;
  withRoles: number;
  withoutRoles: number;
}

interface UserDetail {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  roles: string[];
  privacy_flags?: any;
}

export default function EnhancedUserManagement() {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newThisMonth: 0,
    withRoles: 0,
    withoutRoles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'no_roles'>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userData = data || [];
      setUsers(userData);

      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const calculatedStats: UserStats = {
        totalUsers: userData.length,
        activeUsers: userData.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) > thirtyDaysAgo).length,
        inactiveUsers: userData.filter(u => !u.last_sign_in_at || new Date(u.last_sign_in_at) <= thirtyDaysAgo).length,
        newThisMonth: userData.filter(u => new Date(u.created_at) >= thisMonthStart).length,
        withRoles: userData.filter(u => u.roles && u.roles.length > 0).length,
        withoutRoles: userData.filter(u => !u.roles || u.roles.length === 0).length,
      };

      setStats(calculatedStats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case 'active':
        return users.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) > thirtyDaysAgo);
      case 'inactive':
        return users.filter(u => !u.last_sign_in_at || new Date(u.last_sign_in_at) <= thirtyDaysAgo);
      case 'no_roles':
        return users.filter(u => !u.roles || u.roles.length === 0);
      default:
        return users;
    }
  };

  const handleBulkAction = async (action: 'export' | 'notify') => {
    if (selectedUsers.size === 0) {
      alert('Please select users first');
      return;
    }

    if (action === 'export') {
      const selectedData = users.filter(u => selectedUsers.has(u.id));
      const csv = [
        ['Email', 'Name', 'Created At', 'Last Sign In', 'Roles'].join(','),
        ...selectedData.map(u => [
          u.email,
          u.name || '',
          new Date(u.created_at).toLocaleDateString(),
          u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never',
          u.roles?.join('; ') || 'None'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (action === 'notify') {
      alert(`Would send notification to ${selectedUsers.size} users (feature coming soon)`);
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const selectAll = () => {
    const filteredUsers = getFilteredUsers();
    setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
  };

  const deselectAll = () => {
    setSelectedUsers(new Set());
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="h-7 w-7 text-blue-400" />
          Enhanced User Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-600/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-blue-400" />
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
          <p className="text-sm text-gray-400">Total Users</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-600/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-green-400" />
            <CheckCircle className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
          <p className="text-sm text-gray-400">Active (30d)</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-600/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <UserX className="h-5 w-5 text-orange-400" />
            <XCircle className="h-4 w-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.inactiveUsers}</p>
          <p className="text-sm text-gray-400">Inactive</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-600/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.newThisMonth}</p>
          <p className="text-sm text-gray-400">New This Month</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-600/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <CheckCircle className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.withRoles}</p>
          <p className="text-sm text-gray-400">With Roles</p>
        </div>

        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-600/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <XCircle className="h-4 w-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.withoutRoles}</p>
          <p className="text-sm text-gray-400">No Roles</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users ({stats.totalUsers})</option>
              <option value="active">Active Users ({stats.activeUsers})</option>
              <option value="inactive">Inactive Users ({stats.inactiveUsers})</option>
              <option value="no_roles">No Roles ({stats.withoutRoles})</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {selectedUsers.size > 0 && (
              <>
                <span className="text-sm text-gray-400">{selectedUsers.size} selected</span>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-4 py-2 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button
                  onClick={() => handleBulkAction('notify')}
                  className="px-4 py-2 bg-purple-600/20 border border-purple-600/30 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Notify
                </button>
                <button
                  onClick={deselectAll}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </>
            )}
            {selectedUsers.size === 0 && filteredUsers.length > 0 && (
              <button
                onClick={selectAll}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Select All
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl mb-2">No users match this filter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map(user => {
              const isActive = user.last_sign_in_at && new Date(user.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
              const hasRoles = user.roles && user.roles.length > 0;

              return (
                <div
                  key={user.id}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedUsers.has(user.id)
                      ? 'bg-blue-900/20 border-blue-600/50'
                      : 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="mt-1 h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-white truncate">
                          {user.email || 'Unknown'}
                        </h3>
                        {isActive ? (
                          <span className="px-2 py-0.5 bg-green-900/30 border border-green-600/30 text-green-400 text-xs rounded-full flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-700/30 border border-gray-600/30 text-gray-400 text-xs rounded-full flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                        {user.email_confirmed_at && (
                          <CheckCircle className="h-4 w-4 text-green-400" title="Email Confirmed" />
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">User ID</p>
                          <p className="text-gray-300 font-mono text-xs truncate">{user.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Created</p>
                          <p className="text-gray-300">{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Last Sign In</p>
                          <p className="text-gray-300">
                            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Roles</p>
                          <p className="text-gray-300">
                            {hasRoles ? user.roles.join(', ') : (
                              <span className="text-red-400">No roles</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
