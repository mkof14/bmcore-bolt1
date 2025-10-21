import {  Settings, Users, FileText, Newspaper, Briefcase, FolderOpen, BarChart3, Shield, Menu, X, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import BackButton from '../components/BackButton';
import BlogManager from '../components/admin/BlogManager';
import NewsManager from '../components/admin/NewsManager';
import CareersManager from '../components/admin/CareersManager';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'blog', label: 'Blog Management', icon: FileText },
    { id: 'news', label: 'News Management', icon: Newspaper },
    { id: 'careers', label: 'Careers Management', icon: Briefcase },
    { id: 'marketing', label: 'Marketing Documents', icon: FolderOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'access', label: 'Access Control', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="flex h-screen pt-16">
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col`}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            {sidebarOpen && (
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <BackButton onNavigate={onNavigate} />

            {activeSection === 'dashboard' && <DashboardSection />}
            {activeSection === 'users' && <UserManagementSection />}
            {activeSection === 'blog' && <BlogManager />}
            {activeSection === 'news' && <NewsManager />}
            {activeSection === 'careers' && <CareersManager />}
            {activeSection === 'marketing' && <MarketingDocumentsSection />}
            {activeSection === 'analytics' && <AnalyticsSection />}
            {activeSection === 'access' && <AccessControlSection />}
            {activeSection === 'settings' && <SettingsSection />}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">1,247</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Published Posts</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">42</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
        </div>
      </div>
    </div>
  );
}

function UserManagementSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">User Management</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Manage user accounts, roles, and permissions</p>
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <p className="text-gray-600 dark:text-gray-400">User management interface coming soon...</p>
      </div>
    </div>
  );
}


function MarketingDocumentsSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Marketing Documents</h1>
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors">
          Upload Document
        </button>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <p className="text-gray-600 dark:text-gray-400">Marketing materials library. Upload and manage documents, presentations, and assets.</p>
      </div>
    </div>
  );
}

function AnalyticsSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Analytics</h1>
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <p className="text-gray-600 dark:text-gray-400">Detailed analytics dashboard. View engagement, conversions, and performance metrics.</p>
      </div>
    </div>
  );
}

function AccessControlSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Access Control</h1>
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Role Management</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Super Admin</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full system access</p>
              </div>
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">
                3 users
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Admin</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage content and users</p>
              </div>
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">
                7 users
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Editor</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create and edit content</p>
              </div>
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">
                12 users
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <p className="text-gray-600 dark:text-gray-400">System configuration and preferences.</p>
      </div>
    </div>
  );
}
