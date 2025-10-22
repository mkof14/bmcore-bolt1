import { useState, useEffect } from 'react';
import { Shield, Users, Plus, Edit2, Trash2, UserPlus, UserMinus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
}

const AVAILABLE_PERMISSIONS = [
  { key: 'users.manage', label: 'Manage Users', description: 'Create, edit, delete users' },
  { key: 'content.manage', label: 'Manage Content', description: 'Full content management' },
  { key: 'content.create', label: 'Create Content', description: 'Create new content' },
  { key: 'content.edit', label: 'Edit Content', description: 'Edit existing content' },
  { key: 'content.view', label: 'View Content', description: 'View content only' },
  { key: 'analytics.view', label: 'View Analytics', description: 'Access analytics dashboard' },
  { key: 'settings.manage', label: 'Manage Settings', description: 'Configure system settings' },
  { key: 'emails.manage', label: 'Manage Emails', description: 'Manage email templates' },
];

export default function AccessControlSection() {
  const [activeTab, setActiveTab] = useState<'roles' | 'assignments'>('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    loadRoles();
    loadUserRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*, profiles(id)')
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error loading user roles:', error);
    }
  };

  const getRoleUserCount = (roleId: string) => {
    return userRoles.filter(ur => ur.role_id === roleId).length;
  };

  const openCreateRole = () => {
    setEditingRole(null);
    setRoleForm({ name: '', description: '', permissions: [] });
    setShowRoleModal(true);
  };

  const openEditRole = (role: Role) => {
    if (role.is_system) {
      alert('System roles cannot be edited');
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
      alert('Role name is required');
      return;
    }

    try {
      const roleData = {
        name: roleForm.name,
        description: roleForm.description,
        permissions: roleForm.permissions,
      };

      if (editingRole) {
        const { error } = await supabase
          .from('roles')
          .update(roleData)
          .eq('id', editingRole.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('roles')
          .insert(roleData);

        if (error) throw error;
      }

      setShowRoleModal(false);
      loadRoles();
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save role');
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.is_system) {
      alert('System roles cannot be deleted');
      return;
    }

    if (!confirm(`Delete role "${role.name}"? Users with this role will lose their permissions.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', role.id);

      if (error) throw error;
      loadRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Failed to delete role');
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="h-8 w-8 text-orange-500" />
          Access Control
        </h1>
        {activeTab === 'roles' && (
          <button
            onClick={openCreateRole}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Role
          </button>
        )}
      </div>

      <div className="mb-6 flex gap-4 border-b border-gray-700/50">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'roles'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Roles & Permissions
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'assignments'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Role Assignments
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : activeTab === 'roles' ? (
        <div className="grid gap-4">
          {roles.map(role => (
            <div
              key={role.id}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{role.name}</h3>
                    {role.is_system && (
                      <span className="px-2 py-1 bg-blue-900/30 border border-blue-600/30 text-blue-400 text-xs font-medium rounded-full">
                        System
                      </span>
                    )}
                    <span className="px-2 py-1 bg-orange-900/30 border border-orange-600/30 text-orange-400 text-xs font-medium rounded-full flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {getRoleUserCount(role.id)} users
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.includes('*') ? (
                      <span className="px-2 py-1 bg-green-900/30 border border-green-600/30 text-green-400 text-xs rounded-full">
                        All Permissions
                      </span>
                    ) : (
                      role.permissions.map(perm => {
                        const permInfo = AVAILABLE_PERMISSIONS.find(p => p.key === perm);
                        return (
                          <span
                            key={perm}
                            className="px-2 py-1 bg-gray-700/50 border border-gray-600/30 text-gray-300 text-xs rounded-full"
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
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role)}
                      className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
          <p className="text-gray-400 text-center py-8">
            Role assignments management coming soon. This will allow you to assign and revoke roles for specific users.
          </p>
        </div>
      )}

      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingRole ? 'Edit Role' : 'Create Role'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Role Name</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Content Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe this role's purpose"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Permissions</label>
                  <div className="space-y-2">
                    {AVAILABLE_PERMISSIONS.map(perm => (
                      <label
                        key={perm.key}
                        className="flex items-start gap-3 p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={roleForm.permissions.includes(perm.key)}
                          onChange={() => togglePermission(perm.key)}
                          className="mt-1 h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{perm.label}</p>
                          <p className="text-xs text-gray-400">{perm.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveRole}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all"
                >
                  Save Role
                </button>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
