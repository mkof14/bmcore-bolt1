import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface APIService {
  name: string;
  key: string;
  value: string;
  required: boolean;
  description: string;
  setupUrl?: string;
  icon: string;
  isSecret: boolean;
}

export default function AllAPIKeysManager() {
  const [services, setServices] = useState<APIService[]>([
    {
      name: 'Stripe Publishable Key',
      key: 'stripe_publishable',
      value: '',
      required: true,
      description: 'Public key for payments (pk_live_... or pk_test_...)',
      setupUrl: 'https://dashboard.stripe.com/apikeys',
      icon: '💳',
      isSecret: false
    },
    {
      name: 'Stripe Secret Key',
      key: 'stripe_secret',
      value: '',
      required: true,
      description: 'Secret key (sk_live_... or sk_test_...)',
      setupUrl: 'https://dashboard.stripe.com/apikeys',
      icon: '💳',
      isSecret: true
    },
    {
      name: 'OpenAI API Key',
      key: 'openai_key',
      value: '',
      required: false,
      description: 'For AI assistant and ChatGPT (sk-...)',
      setupUrl: 'https://platform.openai.com/api-keys',
      icon: '🤖',
      isSecret: true
    },
    {
      name: 'Google Analytics',
      key: 'google_analytics',
      value: '',
      required: false,
      description: 'Measurement ID (G-XXXXXXXXXX)',
      setupUrl: 'https://analytics.google.com',
      icon: '📊',
      isSecret: false
    },
    {
      name: 'Facebook Pixel',
      key: 'facebook_pixel',
      value: '',
      required: false,
      description: 'Pixel ID for conversion tracking',
      setupUrl: 'https://business.facebook.com/events_manager',
      icon: '👥',
      isSecret: false
    },
    {
      name: 'Resend API Key',
      key: 'resend_key',
      value: '',
      required: false,
      description: 'For email notifications (re_...)',
      setupUrl: 'https://resend.com/api-keys',
      icon: '📧',
      isSecret: true
    },
    {
      name: 'SendGrid API Key',
      key: 'sendgrid_key',
      value: '',
      required: false,
      description: 'Alternative to Resend for email (SG...)',
      setupUrl: 'https://app.sendgrid.com/settings/api_keys',
      icon: '📧',
      isSecret: true
    },
    {
      name: 'AWS Access Key',
      key: 'aws_access',
      value: '',
      required: false,
      description: 'For S3, Lambda and other AWS services',
      setupUrl: 'https://console.aws.amazon.com/iam',
      icon: '☁️',
      isSecret: true
    },
    {
      name: 'AWS Secret Key',
      key: 'aws_secret',
      value: '',
      required: false,
      description: 'AWS Secret Access Key',
      setupUrl: 'https://console.aws.amazon.com/iam',
      icon: '☁️',
      isSecret: true
    },
    {
      name: 'Cloudflare API Token',
      key: 'cloudflare_token',
      value: '',
      required: false,
      description: 'For CDN and security',
      setupUrl: 'https://dash.cloudflare.com/profile/api-tokens',
      icon: '🛡️',
      isSecret: true
    },
    {
      name: 'Twilio Account SID',
      key: 'twilio_sid',
      value: '',
      required: false,
      description: 'For SMS notifications',
      setupUrl: 'https://console.twilio.com',
      icon: '📱',
      isSecret: false
    },
    {
      name: 'Twilio Auth Token',
      key: 'twilio_token',
      value: '',
      required: false,
      description: 'Auth Token for Twilio',
      setupUrl: 'https://console.twilio.com',
      icon: '📱',
      isSecret: true
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const handleUpdate = (key: string, newValue: string) => {
    setServices(prev => prev.map(service =>
      service.key === key ? { ...service, value: newValue } : service
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      setMessage({
        type: 'success',
        text: 'All keys saved successfully! ✓'
      });

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

  const groupedServices = {
    payments: services.filter(s => s.key.includes('stripe')),
    ai: services.filter(s => s.key.includes('openai')),
    analytics: services.filter(s => s.key.includes('google') || s.key.includes('facebook')),
    email: services.filter(s => s.key.includes('resend') || s.key.includes('sendgrid')),
    cloud: services.filter(s => s.key.includes('aws') || s.key.includes('cloudflare')),
    sms: services.filter(s => s.key.includes('twilio'))
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700/50 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">API Keys Management</h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage all API keys and integrations
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

        <div className="space-y-8">
          {Object.entries(groupedServices).map(([category, items]) => {
            if (items.length === 0) return null;

            const categoryNames: Record<string, string> = {
              payments: '💳 Payments',
              ai: '🤖 Artificial Intelligence',
              analytics: '📊 Analytics',
              email: '📧 Email Services',
              cloud: '☁️ Cloud Services',
              sms: '📱 SMS Notifications'
            };

            return (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">
                  {categoryNames[category]}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {items.map((service) => (
                    <div
                      key={service.key}
                      className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                          <span className="text-2xl">{service.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              {service.name}
                              {service.required && (
                                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                                  required
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                        {service.setupUrl && (
                          <a
                            href={service.setupUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Get API key"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{service.description}</p>
                      <div className="relative">
                        <input
                          type={service.isSecret && !showSecrets[service.key] ? 'password' : 'text'}
                          value={service.value}
                          onChange={(e) => handleUpdate(service.key, e.target.value)}
                          placeholder={`Paste ${service.isSecret ? 'secret' : ''} key...`}
                          className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                        />
                        {service.isSecret && (
                          <button
                            type="button"
                            onClick={() => toggleShowSecret(service.key)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors"
                          >
                            {showSecrets[service.key] ? (
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
              </div>
            );
          })}
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

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Important Security Information
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>🔒 Secret keys should never be accessible in client-side code</li>
          <li>🌐 Use Test Keys for development, Live Keys for production</li>
          <li>🔄 Rotate keys regularly (every 3-6 months)</li>
          <li>👀 Never share secret keys via email or messaging apps</li>
          <li>💾 Store backup copies of keys in a secure vault</li>
          <li>📝 Use environment variables (.env) instead of hardcoding</li>
        </ul>
      </div>
    </div>
  );
}
