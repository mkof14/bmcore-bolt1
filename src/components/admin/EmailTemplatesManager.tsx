import { useState, useEffect, useMemo } from 'react';
import { Mail, Plus, Edit2, Trash2, Send, Search, Filter, Download, Upload, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminDb } from '../../lib/adminApi';
import { seedEmailTemplatesAdmin } from '../../lib/emailTemplates';
import { sendEmail, renderTemplate, htmlToPlainText } from '../../lib/emailProvider';
import { notifyError, notifyInfo, notifySuccess } from '../../lib/adminNotify';
import StateCard from '../ui/StateCard';
import ErrorBanner from '../ui/ErrorBanner';
import ModalShell from '../ui/ModalShell';

interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  subject_en: string;
  subject_ru: string | null;
  body_en: string;
  body_ru: string | null;
  variable_schema: Array<{ key: string; type: string; required: boolean }>;
  status: 'draft' | 'active' | 'archived';
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface EmailLog {
  id: string;
  template_id: string | null;
  recipient_email: string;
  subject: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: 'welcome', label: 'Welcome' },
  { value: 'payment_success', label: 'Payment Success' },
  { value: 'payment_failed', label: 'Payment Failed' },
  { value: 'password_reset', label: 'Password Reset' },
  { value: 'billing_invoice', label: 'Billing Invoice' },
  { value: 'subscription_update', label: 'Subscription Update' },
  { value: 'general', label: 'General' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'notification', label: 'Notification' },
];

export default function EmailTemplatesManager() {
  const [activeTab, setActiveTab] = useState<'templates' | 'logs'>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'general',
    subject_en: '',
    body_en: '',
    variables: '',
    status: 'draft',
    description: '',
  });
  const [sendFormData, setSendFormData] = useState({
    recipientEmail: '',
    customSubject: '',
    customBody: '',
  });

  useEffect(() => {
    Promise.all([loadTemplates(), loadLogs()]).finally(() => setLoading(false));
  }, []);

  const handleSeedTemplates = async () => {
    if (!confirm('This will add/update all 38 default email templates. Continue?')) return;

    try {
      setLoading(true);
      const results = await seedEmailTemplatesAdmin();
      const successCount = results.filter(r => r.success).length;
      notifySuccess(`Seeded ${successCount}/${results.length} templates`);
      await loadTemplates();
    } catch (error) {
      notifyError('Template seed failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExportTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*');

      if (error) throw error;

      const exportData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        templates: data,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-templates-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      notifyError('Template export failed');
    }
  };

  const handleImportTemplates = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.templates || !Array.isArray(importData.templates)) {
        throw new Error('Invalid template file format');
      }

      const result = await adminDb({
        table: 'email_templates',
        action: 'upsert',
        data: importData.templates,
        onConflict: 'slug',
      });

      if (!result.ok) throw new Error(result.error || 'Template import failed');

      notifySuccess(`Imported ${importData.templates.length} templates`);
      loadTemplates();
    } catch (error) {
      notifyError('Template import failed');
    }

    // Reset file input
    event.target.value = '';
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
      setError(null);
    } catch (error) {
      notifyError('Template load failed');
      setError('Unable to load email templates.');
    }
  };

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('email_sends')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      notifyError('Email log load failed');
      setError('Unable to load email logs.');
    }
  };

  const openCreateModal = () => {
    setSelectedTemplate(null);
    setFormData({
      name: '',
      slug: '',
      category: 'general',
      subject_en: '',
      body_en: '',
      variables: '',
      status: 'draft',
      description: '',
    });
    setShowTemplateModal(true);
  };

  const openEditModal = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    const variableKeys = template.variable_schema?.map(v => v.key).join(', ') || '';
    setFormData({
      name: template.name,
      slug: template.slug,
      category: template.category,
      subject_en: template.subject_en,
      body_en: template.body_en,
      variables: variableKeys,
      status: template.status,
      description: template.description || '',
    });
    setShowTemplateModal(true);
  };

  const openSendModal = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setSendFormData({
      recipientEmail: '',
      customSubject: template.subject_en,
      customBody: template.body_en,
    });
    setShowSendModal(true);
  };

  const handleSaveTemplate = async () => {
    try {
      const variablesArray = formData.variables
        .split(',')
        .map(v => v.trim())
        .filter(v => v);

      const variableSchema = variablesArray.map(key => ({
        key,
        type: 'string',
        required: true
      }));

      const templateData = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        subject_en: formData.subject_en,
        subject_ru: null,
        body_en: formData.body_en,
        body_ru: null,
        variable_schema: variableSchema,
        status: formData.status,
        description: formData.description || null,
      };

      if (selectedTemplate) {
        const result = await adminDb({
          table: 'email_templates',
          action: 'update',
          data: templateData,
          match: { id: selectedTemplate.id },
        });

        if (!result.ok) throw new Error(result.error || 'Template update failed');
      } else {
        const result = await adminDb({
          table: 'email_templates',
          action: 'insert',
          data: templateData,
        });

        if (!result.ok) throw new Error(result.error || 'Template create failed');
      }

      setShowTemplateModal(false);
      loadTemplates();
    } catch (error) {
      notifyError('Template save failed');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const result = await adminDb({
        table: 'email_templates',
        action: 'delete',
        match: { id },
      });

      if (!result.ok) throw new Error(result.error || 'Template delete failed');
      loadTemplates();
    } catch (error) {
      notifyError('Template delete failed');
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate || !sendFormData.recipientEmail) {
      notifyInfo('Please provide recipient email');
      return;
    }

    try {
      const result = await sendEmail({
        to: sendFormData.recipientEmail,
        subject: sendFormData.customSubject,
        html: sendFormData.customBody,
        text: htmlToPlainText(sendFormData.customBody),
      });

      // Log the send attempt
      const logResult = await adminDb({
        table: 'email_sends',
        action: 'insert',
        data: {
          template_id: selectedTemplate.id,
          recipient_email: sendFormData.recipientEmail,
          subject: sendFormData.customSubject,
          body_html: sendFormData.customBody,
          body_text: htmlToPlainText(sendFormData.customBody),
          variables_used: {},
          send_type: 'test',
          status: result.success ? 'sent' : 'failed',
          provider: result.provider || "edge",
          provider_message_id: result.messageId,
          sent_at: result.success ? new Date().toISOString() : null,
          error_message: result.error || null,
        },
      });


      if (result.success) {
        notifySuccess(`Email sent via ${result.provider || "edge"}`);
        setShowSendModal(false);
        loadLogs();
      } else {
        notifyError(`Email send failed: ${result.error}`);
      }
    } catch (error) {
      notifyError('Email send failed');
    }
  };

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesSearch =
        !q ||
        template.name.toLowerCase().includes(q) ||
        template.slug.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, categoryFilter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
          <Mail className="h-8 w-8 text-orange-500" />
          Email Templates
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleSeedTemplates}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-300 flex items-center gap-2"
            title="Seed 38 default templates"
          >
            <RefreshCw className="h-5 w-5" />
            Seed Templates
          </button>
          <button
            onClick={handleExportTemplates}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Export
          </button>
          <label className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 cursor-pointer">
            <Upload className="h-5 w-5" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportTemplates}
              className="hidden"
            />
          </label>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Template
          </button>
        </div>
      </div>

      {error && <ErrorBanner message={error} className="mb-4" />}

      <div className="mb-6 flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'templates'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'logs'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Email Logs
        </button>
      </div>

      {activeTab === 'templates' && (
        <div>
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <StateCard title="Loading templates..." description="Fetching your latest email templates." />
          ) : filteredTemplates.length === 0 ? (
            <StateCard title="No templates found" description="Try adjusting filters or create a new template." />
          ) : (
            <div className="grid gap-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          template.status === 'active'
                            ? 'bg-green-900/30 border border-green-600/30 text-green-400'
                            : template.status === 'draft'
                            ? 'bg-yellow-900/30 border border-yellow-600/30 text-yellow-400'
                            : 'bg-slate-50 border border-slate-200 text-gray-600'
                        }`}>
                          {template.status}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-900/30 border border-orange-600/30 text-orange-400">
                          {CATEGORIES.find(c => c.value === template.category)?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.slug}</p>
                      {template.description && (
                        <p className="text-sm text-gray-500">{template.description}</p>
                      )}
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Subject:</span> {template.subject_en}
                        </p>
                        {template.variable_schema && template.variable_schema.length > 0 && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Variables:</span> {template.variable_schema.map(v => v.key).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openSendModal(template)}
                        className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(template)}
                        className="p-2 text-orange-400 hover:bg-orange-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white/90 border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-gray-600">
                        <p className="text-base font-semibold text-gray-900 mb-1">No email logs found</p>
                        <p className="text-sm text-gray-500">Once emails are sent, delivery logs will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{log.recipient_email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{log.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          log.status === 'sent'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            : log.status === 'failed'
                            ? 'bg-red-50 border border-red-200 text-red-700'
                            : 'bg-amber-50 border border-amber-200 text-amber-700'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {log.sent_at ? new Date(log.sent_at).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <ModalShell
          title={selectedTemplate ? 'Edit Template' : 'Create Template'}
          icon={<Mail className="h-6 w-6 text-orange-500" />}
          onClose={() => setShowTemplateModal(false)}
          panelClassName="max-w-4xl"
        >
          <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Template Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject_en}
                    onChange={(e) => setFormData({ ...formData, subject_en: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Body (HTML)</label>
                  <textarea
                    value={formData.body_en}
                    onChange={(e) => setFormData({ ...formData, body_en: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="<!DOCTYPE html><html><body>...</body></html>"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Variables (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.variables}
                    onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                    placeholder="user_name, user_email, amount"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveTemplate}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all"
            >
              Save Template
            </button>
            <button
              onClick={() => setShowTemplateModal(false)}
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </ModalShell>
      )}

      {showSendModal && selectedTemplate && (
        <ModalShell
          title="Send Email"
          icon={<Send className="h-6 w-6 text-blue-400" />}
          onClose={() => setShowSendModal(false)}
          panelClassName="max-w-2xl"
        >
          <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Recipient Email</label>
                  <input
                    type="email"
                    value={sendFormData.recipientEmail}
                    onChange={(e) => setSendFormData({ ...sendFormData, recipientEmail: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Subject</label>
                  <input
                    type="text"
                    value={sendFormData.customSubject}
                    onChange={(e) => setSendFormData({ ...sendFormData, customSubject: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Body</label>
                  <textarea
                    value={sendFormData.customBody}
                    onChange={(e) => setSendFormData({ ...sendFormData, customBody: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                  <p className="text-sm text-blue-400">
                    Available variables: {selectedTemplate.variable_schema?.map(v => v.key).join(', ') || 'none'}
                  </p>
                </div>
              </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSendEmail}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
              Send Email
            </button>
            <button
              onClick={() => setShowSendModal(false)}
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
