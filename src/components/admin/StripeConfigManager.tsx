import { useState, useEffect } from 'react';
import { CreditCard, Save, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StripeConfig {
  key: string;
  value: string;
  description: string;
  is_secret: boolean;
}

export default function StripeConfigManager() {
  const [configs, setConfigs] = useState<StripeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stripe_configuration')
        .select('*')
        .eq('environment', 'test')
        .order('key');

      if (error) throw error;

      const importantKeys = [
        'publishable_key_test',
        'price_daily_monthly_test',
        'price_daily_yearly_test',
        'price_core_monthly_test',
        'price_core_yearly_test',
        'price_max_monthly_test',
        'price_max_yearly_test',
      ];

      const filtered = (data || []).filter(config => importantKeys.includes(config.key));
      setConfigs(filtered);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key: string, newValue: string) => {
    const updatedConfigs = configs.map(config =>
      config.key === key ? { ...config, value: newValue } : config
    );
    setConfigs(updatedConfigs);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      for (const config of configs) {
        const { error } = await supabase
          .from('stripe_configuration')
          .update({ value: config.value })
          .eq('key', config.key);

        if (error) throw error;
      }

      setMessage({ type: 'success', text: 'All keys saved successfully!' });
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const toggleShowSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getFriendlyLabel = (key: string) => {
    const labels: Record<string, string> = {
      'publishable_key_test': '🔑 Publishable Key (pk_test_...)',
      'price_daily_monthly_test': 'Monthly Price ID (price_...)',
      'price_daily_yearly_test': 'Yearly Price ID (price_...)',
      'price_core_monthly_test': 'Monthly Price ID (price_...)',
      'price_core_yearly_test': 'Yearly Price ID (price_...)',
      'price_max_monthly_test': 'Monthly Price ID (price_...)',
      'price_max_yearly_test': 'Yearly Price ID (price_...)',
    };
    return labels[key] || key;
  };

  const getGroupedConfigs = () => {
    return {
      api: configs.filter(c => c.key === 'publishable_key_test'),
      daily: configs.filter(c => c.key.includes('daily')),
      core: configs.filter(c => c.key.includes('core')),
      max: configs.filter(c => c.key.includes('max'))
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700/50 p-8">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Stripe Configuration</h2>
            <p className="text-gray-400 text-sm mt-1">
              Paste your keys from Stripe Dashboard
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* API Keys Section */}
          {getGroupedConfigs().api.map((config) => (
            <div key={config.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {getFriendlyLabel(config.key)}
              </label>
              <p className="text-xs text-gray-500 mb-2">{config.description}</p>
              <div className="relative">
                <input
                  type={config.is_secret && !showSecrets[config.key] ? 'password' : 'text'}
                  value={config.value}
                  onChange={(e) => handleUpdate(config.key, e.target.value)}
                  placeholder="Paste your key here..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                {config.is_secret && (
                  <button
                    type="button"
                    onClick={() => toggleShowSecret(config.key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    {showSecrets[config.key] ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Daily Plan */}
          {getGroupedConfigs().daily.length > 0 && (
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                📅 Daily Plan - $39/month or $374/year
              </h3>
              <div className="space-y-4">
                {getGroupedConfigs().daily.map((config) => (
                  <div key={config.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {getFriendlyLabel(config.key)}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">{config.description}</p>
                    <input
                      type="text"
                      value={config.value}
                      onChange={(e) => handleUpdate(config.key, e.target.value)}
                      placeholder="Paste Price ID here..."
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Plan */}
          {getGroupedConfigs().core.length > 0 && (
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                ⭐ Core Plan - $19/month or $182/year
              </h3>
              <div className="space-y-4">
                {getGroupedConfigs().core.map((config) => (
                  <div key={config.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {getFriendlyLabel(config.key)}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">{config.description}</p>
                    <input
                      type="text"
                      value={config.value}
                      onChange={(e) => handleUpdate(config.key, e.target.value)}
                      placeholder="Paste Price ID here..."
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Max Plan */}
          {getGroupedConfigs().max.length > 0 && (
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                🚀 Max Plan - $79/month or $758/year
              </h3>
              <div className="space-y-4">
                {getGroupedConfigs().max.map((config) => (
                  <div key={config.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {getFriendlyLabel(config.key)}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">{config.description}</p>
                    <input
                      type="text"
                      value={config.value}
                      onChange={(e) => handleUpdate(config.key, e.target.value)}
                      placeholder="Paste Price ID here..."
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save all keys</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Where to get these keys?
        </h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <strong className="text-white">1. Publishable Key:</strong>
            <p className="text-gray-400 mt-1">
              Open{' '}
              <a
                href="https://dashboard.stripe.com/test/apikeys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Stripe Dashboard → API Keys
              </a>
              {' '}and copy "Publishable key" (starts with pk_test_)
            </p>
          </div>
          <div>
            <strong className="text-white">2. Price IDs:</strong>
            <p className="text-gray-400 mt-1">
              Open{' '}
              <a
                href="https://dashboard.stripe.com/test/products"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Stripe Dashboard → Products
              </a>
              , create products and copy Price IDs (start with price_)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
