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
      'price_daily_monthly_test': '📅 Daily Plan - Monthly ($25/month)',
      'price_daily_yearly_test': '📅 Daily Plan - Yearly ($250/year)',
      'price_core_monthly_test': '⭐ Core Plan - Monthly ($55/month)',
      'price_core_yearly_test': '⭐ Core Plan - Yearly ($550/year)',
      'price_max_monthly_test': '🚀 Max Plan - Monthly ($99/month)',
      'price_max_yearly_test': '🚀 Max Plan - Yearly ($990/year)',
    };
    return labels[key] || key;
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
              Вставьте ваши ключи из Stripe Dashboard
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

        <div className="space-y-4">
          {configs.map((config) => (
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
                  placeholder="Вставьте сюда ваш ключ..."
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
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Сохранить все ключи</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Где взять эти ключи?
        </h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <strong className="text-white">1. Publishable Key:</strong>
            <p className="text-gray-400 mt-1">
              Откройте{' '}
              <a
                href="https://dashboard.stripe.com/test/apikeys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Stripe Dashboard → API Keys
              </a>
              {' '}и скопируйте "Publishable key" (начинается с pk_test_)
            </p>
          </div>
          <div>
            <strong className="text-white">2. Price IDs:</strong>
            <p className="text-gray-400 mt-1">
              Откройте{' '}
              <a
                href="https://dashboard.stripe.com/test/products"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Stripe Dashboard → Products
              </a>
              , создайте продукты и скопируйте Price IDs (начинаются с price_)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
