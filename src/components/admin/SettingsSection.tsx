import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Setting {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string;
  is_public: boolean;
  updated_at: string;
}

export default function SettingsSection() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState('general');
  const [settingsForm, setSettingsForm] = useState<Record<string, any>>({});

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'user', label: 'User Management' },
    { id: 'security', label: 'Security' },
    { id: 'system', label: 'System' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category')
        .order('key');

      if (error) throw error;

      const form: Record<string, any> = {};
      (data || []).forEach(setting => {
        form[setting.key] = setting.value;
      });

      setSettings(data || []);
      setSettingsForm(form);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const updates = settings
        .filter(s => s.category === activeCategory)
        .map(setting => ({
          id: setting.id,
          value: settingsForm[setting.key],
          updated_at: new Date().toISOString(),
        }));

      for (const update of updates) {
        const { error } = await supabase
          .from('system_settings')
          .update({ value: update.value, updated_at: update.updated_at })
          .eq('id', update.id);

        if (error) throw error;
      }

      alert('Settings saved successfully');
      loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const renderSettingInput = (setting: Setting) => {
    const value = settingsForm[setting.key];

    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setSettingsForm({ ...settingsForm, [setting.key]: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
          <span className="text-sm text-gray-300">{value ? 'Enabled' : 'Disabled'}</span>
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => setSettingsForm({ ...settingsForm, [setting.key]: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      );
    }

    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => setSettingsForm({ ...settingsForm, [setting.key]: e.target.value })}
        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    );
  };

  const categorySettings = settings.filter(s => s.category === activeCategory);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-orange-500" />
          System Settings
        </h1>
        <div className="flex gap-2">
          <button
            onClick={loadSettings}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Reload
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading settings...</div>
      ) : (
        <div className="space-y-4">
          {categorySettings.map(setting => (
            <div
              key={setting.id}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-white">
                      {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    {setting.is_public && (
                      <span className="px-2 py-1 bg-green-900/30 border border-green-600/30 text-green-400 text-xs font-medium rounded-full">
                        Public
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{setting.description}</p>
                  <div className="max-w-md">
                    {renderSettingInput(setting)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {categorySettings.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No settings in this category
            </div>
          )}
        </div>
      )}
    </div>
  );
}
