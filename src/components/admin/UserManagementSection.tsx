import { useState, useEffect } from 'react';
import { Users, Search, Shield, Ban, CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Profile {
  id: string;
  created_at: string;
  privacy_flags: {
    is_admin?: boolean;
    is_active?: boolean;
  };
}

export default function UserManagementSection() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          privacy_flags: {
            is_admin: !currentStatus,
            is_active: true,
          },
        })
        .eq('id', userId);

      if (error) throw error;
      loadUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert('Failed to update admin status');
    }
  };

  const toggleActiveStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const user = users.find(u => u.id === userId);
      const { error } = await supabase
        .from('profiles')
        .update({
          privacy_flags: {
            ...user?.privacy_flags,
            is_active: !currentStatus,
          },
        })
        .eq('id', userId);

      if (error) throw error;
      loadUsers();
    } catch (error) {
      console.error('Error updating active status:', error);
      alert('Failed to update active status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      filterRole === 'all' ||
      (filterRole === 'admin' && user.privacy_flags?.is_admin) ||
      (filterRole === 'user' && !user.privacy_flags?.is_admin);
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="h-8 w-8 text-orange-500" />
          User Management
        </h1>
        <div className="text-sm text-gray-400">
          Total Users: <span className="text-white font-semibold">{users.length}</span>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Users</option>
          <option value="admin">Admins Only</option>
          <option value="user">Regular Users</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading users...</div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map(user => {
            const isAdmin = user.privacy_flags?.is_admin || false;
            const isActive = user.privacy_flags?.is_active !== false;

            return (
              <div
                key={user.id}
                className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-white font-mono">{user.id}</h3>
                      {isAdmin && (
                        <span className="px-2 py-1 bg-orange-900/30 border border-orange-600/30 text-orange-400 text-xs font-medium rounded-full flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Admin
                        </span>
                      )}
                      {isActive ? (
                        <span className="px-2 py-1 bg-green-900/30 border border-green-600/30 text-green-400 text-xs font-medium rounded-full flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-900/30 border border-red-600/30 text-red-400 text-xs font-medium rounded-full flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAdminStatus(user.id, isAdmin)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        isAdmin
                          ? 'bg-orange-900/30 border border-orange-600/30 text-orange-400 hover:bg-orange-900/50'
                          : 'bg-gray-700/50 border border-gray-600/30 text-gray-300 hover:bg-gray-700'
                      }`}
                      title={isAdmin ? 'Remove Admin' : 'Make Admin'}
                    >
                      <Shield className="h-4 w-4" />
                      {isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </button>

                    <button
                      onClick={() => toggleActiveStatus(user.id, isActive)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-red-900/30 border border-red-600/30 text-red-400 hover:bg-red-900/50'
                          : 'bg-green-900/30 border border-green-600/30 text-green-400 hover:bg-green-900/50'
                      }`}
                      title={isActive ? 'Deactivate' : 'Activate'}
                    >
                      {isActive ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No users found matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
