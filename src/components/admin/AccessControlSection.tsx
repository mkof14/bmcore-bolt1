import { useState, useEffect } from 'react';
import { Shield, Users, Plus, Edit2, Trash2, UserPlus, UserMinus, Key, Lock, Search, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminDb } from '../../lib/adminApi';
import { notifyError, notifySuccess } from '../../lib/adminNotify';
import StateCard from '../ui/StateCard';
import ErrorBanner from '../ui/ErrorBanner';
import SuccessBanner from '../ui/SuccessBanner';
import ModalShell from '../ui/ModalShell';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system: boolean;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  profiles?: {
    id: string;
  };
  roles?: Role;
}

interface Profile {
  id: string;
  email?: string;
  name?: string;
  privacy_flags?: {
    is_admin?: boolean;
  };
  created_at: string;
  last_sign_in_at?: string;
  roles?: string[];
}

const PERMISSION_CATEGORIES = {
  'Content Management': [
    { key: 'content.view', label: 'View Content', description: 'View all content (blog, news, jobs)' },
    { key: 'content.create', label: 'Create Content', description: 'Create new content items' },
    { key: 'content.edit', label: 'Edit Content', description: 'Edit existing content' },
    { key: 'content.delete', label: 'Delete Content', description: 'Delete content items' },
    { key: 'content.publish', label: 'Publish Content', description: 'Publish or unpublish content' },
  ],
  'User Management': [
    { key: 'users.view', label: 'View Users', description: 'View user list and profiles' },
    { key: 'users.create', label: 'Create Users', description: 'Create new user accounts' },
    { key: 'users.edit', label: 'Edit Users', description: 'Edit user profiles and settings' },
    { key: 'users.delete', label: 'Delete Users', description: 'Delete user accounts' },
    { key: 'users.manage_roles', label: 'Manage User Roles', description: 'Assign/revoke user roles' },
  ],
  'System Administration': [
    { key: 'system.settings', label: 'System Settings', description: 'Configure system settings' },
    { key: 'system.analytics', label: 'View Analytics', description: 'Access analytics dashboard' },
    { key: 'system.roles', label: 'Manage Roles', description: 'Create and manage roles' },
    { key: 'system.permissions', label: 'Manage Permissions', description: 'Manage permission assignments' },
    { key: 'system.logs', label: 'View Logs', description: 'View system logs and audit trails' },
  ],
  'Email & Communications': [
    { key: 'emails.templates', label: 'Email Templates', description: 'Manage email templates' },
    { key: 'emails.send', label: 'Send Emails', description: 'Send emails to users' },
    { key: 'emails.campaigns', label: 'Email Campaigns', description: 'Create and manage email campaigns' },
  ],
  'Marketing & Documents': [
    { key: 'marketing.documents', label: 'Marketing Documents', description: 'Manage marketing materials' },
    { key: 'marketing.upload', label: 'Upload Documents', description: 'Upload new marketing materials' },
  ],
};

export default function AccessControlSection() {
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'permissions'>('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 4000);
    return () => clearTimeout(t);
  }, [error]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([loadRoles(), loadUserRoles(), loadUsers()]);
    setLoading(false);
  };

  const loadRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      setError('Role load failed');
      notifyError('Role load failed');
    }
  };

  const loadUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*, profiles(id), roles(*)')
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      setError('Role assignments load failed');
      notifyError('Role assignments load failed');
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, first_name, last_name, is_admin, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers = (data || []).map(user => ({
        id: user.id,
        email: user.email || '',
        name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unknown',
        privacy_flags: { is_admin: user.is_admin },
        created_at: user.created_at,
        roles: user.role ? [user.role] : [],
      }));

      setUsers(formattedUsers);
    } catch (error) {
      setUsers([]);
      setError('Users load failed');
      notifyError('Users load failed');
    }
  };

  const getRoleUserCount = (roleId: string) => {
    return userRoles.filter(ur => ur.role_id === roleId).length;
  };

  const getUserRoles = (userId: string) => {
    return userRoles.filter(ur => ur.user_id === userId);
  };

  const openCreateRole = () => {
    setEditingRole(null);
    setRoleForm({ name: '', description: '', permissions: [] });
    setShowRoleModal(true);
  };

  const openEditRole = (role: Role) => {
    if (role.is_system) {
        setError('System roles cannot be edited');
        return;
      }
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setShowRoleModal(true);
  };

  const handleSaveRole = async () => {
    if (!roleForm.name) {
        setError('Role name is required');
        return;
      }

    try {
      const roleData = {
        name: roleForm.name,
        description: roleForm.description,
        permissions: roleForm.permissions,
      };

      if (editingRole) {
        const result = await adminDb({
          table: 'roles',
          action: 'update',
          data: roleData,
          match: { id: editingRole.id },
        });

        if (!result.ok) throw new Error(result.error || 'Role update failed');
        setSuccess('Role updated');
        notifySuccess('Role updated');
      } else {
        const result = await adminDb({
          table: 'roles',
          action: 'insert',
          data: roleData,
        });

        if (!result.ok) throw new Error(result.error || 'Role create failed');
        setSuccess('Role created');
        notifySuccess('Role created');
      }

      setError(null);
      setShowRoleModal(false);
      loadRoles();
    } catch (error) {
      setError('Role save failed');
      notifyError('Role save failed');
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.is_system) {
        setError('System roles cannot be deleted');
        return;
      }

    if (!confirm(`Delete role "${role.name}"? Users with this role will lose their permissions.`)) {
      return;
    }

    try {
      const result = await adminDb({
        table: 'roles',
        action: 'delete',
        match: { id: role.id },
      });

      if (!result.ok) throw new Error(result.error || 'Role delete failed');
      loadRoles();
      setSuccess('Role deleted');
      notifySuccess('Role deleted');
      setError(null);
    } catch (error) {
      setError('Role delete failed');
      notifyError('Role delete failed');
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();

      if (!currentUser.user) {
        setError('You must be logged in to assign roles');
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        setError('Authentication required');
        return;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const res = await fetch(`${supabaseUrl}/functions/v1/admin-assign-role`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, roleId }),
      });

      const data = await res.json().catch(() => null);
      const error =
        res.ok && data?.ok !== false ? null : { message: data?.error || 'Role assign failed', code: data?.code };

      if (error) {
        let message = 'Role assign failed';
        if (error.code === 'FORBIDDEN') {
          message = 'Permission denied. Admin access required.';
        } else if (error.code === 'UNAUTHORIZED') {
          message = 'Authentication required';
        } else if (error.message && error.message.includes('already')) {
          message = 'User already has this role';
        } else if (error.message && error.message.toLowerCase().includes('forbidden')) {
          message = 'Permission denied. Admin access required.';
        } else if (error.message && error.message.includes('infinite recursion')) {
          message = 'System error: Infinite recursion detected. Please contact administrator.';
        } else if (error.message) {
          message = `Role assign failed: ${error.message}`;
        }
        setError(message);
        notifyError(message);
      } else {
        await loadUserRoles();
        setShowAssignModal(false);
        setSuccess('Role assigned');
        notifySuccess('Role assigned');
        setError(null);
      }
    } catch (error: any) {
      const message = `Role assign failed: ${error.message || 'Unknown error'}`;
      setError(message);
      notifyError(message);
    }
  };

  const handleRevokeRole = async (userRoleId: string) => {
    if (!confirm('Revoke this role assignment?')) return;

    try {
      const result = await adminDb({
        table: 'user_roles',
        action: 'delete',
        match: { id: userRoleId },
      });

      if (!result.ok) throw new Error(result.error || 'Role revoke failed');
      loadUserRoles();
      setSuccess('Role revoked');
      notifySuccess('Role revoked');
      setError(null);
    } catch (error) {
      setError('Role revoke failed');
      notifyError('Role revoke failed');
    }
  };

  const togglePermission = (permission: string) => {
    if (roleForm.permissions.includes(permission)) {
      setRoleForm({
        ...roleForm,
        permissions: roleForm.permissions.filter(p => p !== permission),
      });
    } else {
      setRoleForm({
        ...roleForm,
        permissions: [...roleForm.permissions, permission],
      });
    }
  };

  const toggleAllInCategory = (categoryPerms: typeof PERMISSION_CATEGORIES[keyof typeof PERMISSION_CATEGORIES]) => {
    const categoryKeys = categoryPerms.map(p => p.key);
    const allSelected = categoryKeys.every(key => roleForm.permissions.includes(key));

    if (allSelected) {
      setRoleForm({
        ...roleForm,
        permissions: roleForm.permissions.filter(p => !categoryKeys.includes(p)),
      });
    } else {
      const newPerms = [...new Set([...roleForm.permissions, ...categoryKeys])];
      setRoleForm({ ...roleForm, permissions: newPerms });
    }
  };

  const getAllPermissions = () => {
    return Object.values(PERMISSION_CATEGORIES).flat();
  };

  const filteredUsers = users.filter(user =>
    user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
          <Shield className="h-8 w-8 text-orange-500" />
          Access Control
        </h1>
        <div className="flex gap-2">
          <button
            onClick={loadAllData}
            className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          {activeTab === 'roles' && (
            <button
              onClick={openCreateRole}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Role
            </button>
          )}
          {activeTab === 'users' && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20 flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Assign Role
            </button>
          )}
        </div>
      </div>

      {error && <ErrorBanner message={error} className="mb-4" />}
      {success && (
        <SuccessBanner message={success} className="mb-4" />
      )}

      <div className="mb-6 flex gap-4 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-6 py-3 font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Key className="h-4 w-4" />
          Roles & Permissions
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs">{roles.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'users'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4" />
          User Assignments
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs">{userRoles.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-6 py-3 font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'permissions'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lock className="h-4 w-4" />
          Permission Matrix
        </button>
      </div>

      {loading ? (
        <StateCard title="Loading access control..." description="Fetching roles, users, and permissions." />
      ) : activeTab === 'roles' ? (
        roles.length === 0 ? (
          <StateCard title="No roles created yet" description="Create a role to start assigning permissions." />
        ) : (
          <div className="grid gap-4">
            {roles.map(role => (
              <div
                key={role.id}
                className="bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-lg hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-900/30 border border-orange-600/30 rounded-lg">
                        <Shield className="h-5 w-5 text-orange-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{role.name}</h3>
                      {role.is_system && (
                        <span className="px-2 py-1 bg-blue-900/30 border border-blue-600/30 text-blue-400 text-xs font-medium rounded-full">
                          System Role
                        </span>
                      )}
                      <span className="px-2 py-1 bg-orange-900/30 border border-orange-600/30 text-orange-400 text-xs font-medium rounded-full flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {getRoleUserCount(role.id)} {getRoleUserCount(role.id) === 1 ? 'user' : 'users'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.includes('*') ? (
                        <span className="px-3 py-1 bg-green-900/30 border border-green-600/30 text-green-400 text-xs rounded-full font-medium">
                          ★ All Permissions
                        </span>
                      ) : (
                        role.permissions.map(perm => {
                          const permInfo = getAllPermissions().find(p => p.key === perm);
                          return (
                            <span
                              key={perm}
                              className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs rounded-full"
                              title={permInfo?.description}
                            >
                              {permInfo?.label || perm}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>
                  {!role.is_system && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditRole(role)}
                        className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit Role"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete Role"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'users' ? (
        <div>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search users by email, name, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <StateCard
              title="No users found"
              description={searchQuery ? 'Try adjusting your search criteria.' : 'No users are registered yet.'}
              icon={<Users className="h-10 w-10" />}
            />
          ) : (
            <div className="space-y-4">
              {filteredUsers.map(user => {
              const userRolesList = getUserRoles(user.id);
              return (
                <div
                  key={user.id}
                  className="bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-900/30 border border-blue-600/30 rounded-lg">
                          <Users className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {user.email || user.name || 'Unknown User'}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono">{user.id}</p>
                        </div>
                        {user.privacy_flags?.is_admin && (
                          <span className="px-2 py-1 bg-orange-900/30 border border-orange-600/30 text-orange-400 text-xs font-medium rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                        {user.last_sign_in_at && (
                          <span>• Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="space-y-3">
                        {userRolesList.length > 0 && (
                          <div className="space-y-2">
                            {userRolesList.map(ur => (
                              <div
                                key={ur.id}
                                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-orange-400" />
                                  <span className="text-sm font-medium text-gray-900">{ur.roles?.name}</span>
                                  <span className="text-xs text-gray-500">
                                    • Assigned {new Date(ur.assigned_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleRevokeRole(ur.id)}
                                  className="p-1 text-red-400 hover:bg-red-900/30 rounded transition-colors"
                                  title="Revoke Role"
                                >
                                  <UserMinus className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignRole(user.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">+ Assign role...</option>
                            {roles
                              .filter(role => !userRolesList.some(ur => ur.role_id === role.id))
                              .map(role => (
                                <option key={role.id} value={role.id}>
                                  {role.name} {role.is_system ? '(System)' : ''}
                                </option>
                              ))}
                          </select>
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
      ) : (
        <div className="space-y-6">
          {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => (
            <div
              key={category}
              className="bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-orange-400" />
                {category}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {perms.map(perm => (
                  <div
                    key={perm.key}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <Key className="h-4 w-4 text-gray-600 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">{perm.label}</p>
                        <p className="text-xs text-gray-600">{perm.description}</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{perm.key}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showRoleModal && (
        <ModalShell
          title={editingRole ? 'Edit Role' : 'Create Role'}
          icon={<Lock className="h-5 w-5 text-orange-400" />}
          onClose={() => setShowRoleModal(false)}
          panelClassName="max-w-4xl"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Role Name</label>
              <input
                type="text"
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Content Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
              <textarea
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Describe this role's purpose"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-600">Permissions</label>
                <span className="text-xs text-gray-500">
                  {roleForm.permissions.length} of {getAllPermissions().length} selected
                </span>
              </div>

              <div className="space-y-4">
                {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => {
                  const categoryKeys = perms.map(p => p.key);
                  const allSelected = categoryKeys.every(key => roleForm.permissions.includes(key));
                  const someSelected = categoryKeys.some(key => roleForm.permissions.includes(key));

                  return (
                    <div key={category} className="border border-slate-200 rounded-lg p-4 bg-white/80">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-orange-400" />
                          {category}
                        </h4>
                        <button
                          onClick={() => toggleAllInCategory(perms)}
                          className={`text-xs px-3 py-1 rounded-full transition-colors ${
                            allSelected
                              ? 'bg-orange-900/30 border border-orange-600/30 text-orange-400'
                              : someSelected
                              ? 'bg-blue-900/30 border border-blue-600/30 text-blue-400'
                              : 'bg-slate-100 border border-slate-200 text-gray-600'
                          }`}
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>

                      <div className="space-y-2">
                        {perms.map(perm => (
                          <label
                            key={perm.key}
                            className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={roleForm.permissions.includes(perm.key)}
                              onChange={() => togglePermission(perm.key)}
                              className="mt-1 h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{perm.label}</p>
                              <p className="text-xs text-gray-600 mt-0.5">{perm.description}</p>
                              <p className="text-xs text-gray-500 font-mono mt-1">{perm.key}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveRole}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all"
            >
              {editingRole ? 'Update Role' : 'Create Role'}
            </button>
            <button
              onClick={() => setShowRoleModal(false)}
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </ModalShell>
      )}

      {showAssignModal && (
        <ModalShell
          title="Assign Role to User"
          icon={<UserPlus className="h-6 w-6 text-orange-400" />}
          onClose={() => setShowAssignModal(false)}
          panelClassName="max-w-2xl"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Select User</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Choose a user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Select Role
                {selectedUserId && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Click a role to assign)
                  </span>
                )}
              </label>

              {(() => {
                const systemRoles = roles.filter(r => r.is_system);
                const customRoles = roles.filter(r => !r.is_system);

                return (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {systemRoles.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          System Roles
                        </h4>
                        <div className="space-y-2">
                          {systemRoles.map(role => (
                            <button
                              key={role.id}
                              onClick={() => {
                                if (selectedUserId) {
                                  handleAssignRole(selectedUserId, role.id);
                                } else {
                                  setError('Please select a user first');
                                }
                              }}
                              disabled={!selectedUserId}
                              className={`w-full p-4 rounded-lg border transition-all text-left ${
                                selectedUserId
                                  ? 'bg-white border-slate-200 hover:bg-slate-50 hover:border-orange-300 cursor-pointer'
                                  : 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${
                                  role.name === 'super_admin' ? 'bg-purple-900/30 border border-purple-600/30' :
                                  role.name === 'admin' ? 'bg-orange-900/30 border border-orange-600/30' :
                                  'bg-blue-900/30 border border-blue-600/30'
                                }`}>
                                  <Shield className={`h-5 w-5 ${
                                    role.name === 'super_admin' ? 'text-purple-400' :
                                    role.name === 'admin' ? 'text-orange-400' :
                                    'text-blue-400'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900">{role.name}</span>
                                    {role.name === 'super_admin' && (
                                      <span className="px-2 py-0.5 bg-purple-900/30 border border-purple-600/30 text-purple-400 text-xs font-medium rounded-full">
                                        ★ FULL ACCESS
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">{role.description}</p>
                                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                    <Users className="h-3 w-3" />
                                    {getRoleUserCount(role.id)} {getRoleUserCount(role.id) === 1 ? 'user' : 'users'}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {customRoles.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Custom Roles
                        </h4>
                        <div className="space-y-2">
                          {customRoles.map(role => (
                            <button
                              key={role.id}
                              onClick={() => {
                                if (selectedUserId) {
                                  handleAssignRole(selectedUserId, role.id);
                                } else {
                                  setError('Please select a user first');
                                }
                              }}
                              disabled={!selectedUserId}
                              className={`w-full p-4 rounded-lg border transition-all text-left ${
                                selectedUserId
                                  ? 'bg-white border-slate-200 hover:bg-slate-50 hover:border-orange-300 cursor-pointer'
                                  : 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-900/30 border border-green-600/30 rounded-lg">
                                  <Shield className="h-5 w-5 text-green-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900">{role.name}</span>
                                  </div>
                                  <p className="text-sm text-gray-600">{role.description}</p>
                                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                    <Users className="h-3 w-3" />
                                    {getRoleUserCount(role.id)} {getRoleUserCount(role.id) === 1 ? 'user' : 'users'}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          <button
            onClick={() => setShowAssignModal(false)}
            className="w-full mt-6 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            Cancel
          </button>
        </ModalShell>
      )}
    </div>
  );
}
