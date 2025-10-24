import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

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

const defaultServices: APIService[] = [
  {
    name: 'Stripe Publishable Key',
    key: 'stripe_publishable',
    value: '',
    required: true,
    description: 'Публичный ключ для оплаты (pk_live_... или pk_test_...)',
    setupUrl: 'https://dashboard.stripe.com/apikeys',
    icon: '💳',
    isSecret: false
  },
  {
    name: 'Stripe Secret Key',
    key: 'stripe_secret',
    value: '',
    required: true,
    description: 'Секретный ключ (sk_live_... или sk_test_...)',
    setupUrl: 'https://dashboard.stripe.com/apikeys',
    icon: '💳',
    isSecret: true
  },
  {
    name: 'Stripe Webhook Secret',
    key: 'stripe_webhook',
    value: '',
    required: true,
    description: 'Webhook secret для обработки событий (whsec_...)',
    setupUrl: 'https://dashboard.stripe.com/webhooks',
    icon: '💳',
    isSecret: true
  },
  {
    name: 'OpenAI API Key',
    key: 'openai_key',
    value: '',
    required: false,
    description: 'Для AI ассистента и ChatGPT (sk-...)',
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
    description: 'Pixel ID для отслеживания конверсий',
    setupUrl: 'https://business.facebook.com/events_manager',
    icon: '👥',
    isSecret: false
  },
  {
    name: 'Resend API Key',
    key: 'resend_key',
    value: '',
    required: false,
    description: 'Для отправки email уведомлений (re_...)',
    setupUrl: 'https://resend.com/api-keys',
    icon: '📧',
    isSecret: true
  },
  {
    name: 'SendGrid API Key',
    key: 'sendgrid_key',
    value: '',
    required: false,
    description: 'Альтернатива Resend для email (SG...)',
    setupUrl: 'https://app.sendgrid.com/settings/api_keys',
    icon: '📧',
    isSecret: true
  },
  {
    name: 'AWS Access Key ID',
    key: 'aws_access',
    value: '',
    required: false,
    description: 'Для S3, Lambda и других AWS сервисов',
    setupUrl: 'https://console.aws.amazon.com/iam',
    icon: '☁️',
    isSecret: true
  },
  {
    name: 'AWS Secret Access Key',
    key: 'aws_secret',
    key: 'STRIPE_PUBLISHABLE',
    required: false,
    description: 'Payment processing',
    setupUrl: 'https://dashboard.stripe.com/apikeys',
  },
  {
    name: 'SendGrid',
    key: 'SENDGRID',
    required: false,
    description: 'Email delivery',
    setupUrl: 'https://app.sendgrid.com/settings/api_keys',
  },
  {
    name: 'Resend',
    key: 'RESEND',
    required: false,
    description: 'Email API (recommended)',
    setupUrl: 'https://resend.com/api-keys',
  },
  {
    name: 'Cloudinary',
    key: 'CLOUDINARY',
    required: false,
    description: 'Image/video management',
    setupUrl: 'https://cloudinary.com/',
  },
  {
    name: 'Apple Health',
    key: 'APPLE_HEALTH',
    required: false,
    description: 'Apple Health integration',
    setupUrl: 'https://developer.apple.com/',
  },
  {
    name: 'Fitbit',
    key: 'FITBIT',
    required: false,
    description: 'Fitbit devices',
    setupUrl: 'https://dev.fitbit.com/apps',
  },
  {
    name: 'Oura Ring',
    key: 'OURA',
    required: false,
    description: 'Sleep & recovery data',
    setupUrl: 'https://cloud.ouraring.com/oauth/applications',
  },
  {
    name: 'WHOOP',
    key: 'WHOOP',
    required: false,
    description: 'Fitness tracking',
    setupUrl: 'https://developer.whoop.com/',
  },
  {
    name: 'Google Analytics',
    key: 'GOOGLE_ANALYTICS',
    required: false,
    description: 'User analytics',
    setupUrl: 'https://analytics.google.com/',
  },
  {
    name: 'Sentry',
    key: 'SENTRY_DSN',
    required: false,
    description: 'Error monitoring',
    setupUrl: 'https://sentry.io/',
  },
];

export default function APIKeysManager() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusColor = (enabled: boolean, required: boolean) => {
    if (enabled) return 'text-green-600';
    if (required) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getStatusIcon = (enabled: boolean, required: boolean) => {
    if (enabled) return <Check className="h-5 w-5" />;
    if (required) return <X className="h-5 w-5" />;
    return <AlertCircle className="h-5 w-5" />;
  };

  const getStatusText = (enabled: boolean, required: boolean) => {
    if (enabled) return 'Configured';
    if (required) return 'Required - Not Set';
    return 'Optional - Not Set';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            API Keys & Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage external service integrations
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Key className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-medium mb-1">Environment Variables Required</p>
            <p className="text-blue-700 dark:text-blue-300">
              Configure these keys in your <code className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">.env</code> file.
              Copy from <code className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">.env.example</code> to get started.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {services.map((service) => {
          const enabled = isServiceEnabled(service.key);
          const keyValue = API_KEYS[service.key];
          const isVisible = showKeys[service.key];

          return (
            <div
              key={service.key}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                    <div
                      className={`flex items-center gap-1.5 ${getStatusColor(
                        enabled,
                        service.required
                      )}`}
                    >
                      {getStatusIcon(enabled, service.required)}
                      <span className="text-sm font-medium">
                        {getStatusText(enabled, service.required)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {service.description}
                  </p>

                  {enabled && (
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded text-sm font-mono text-gray-900 dark:text-white">
                        {isVisible
                          ? keyValue
                          : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(service.key)}
                        className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                      >
                        {isVisible ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  )}

                  {!enabled && service.setupUrl && (
                    <a
                      href={service.setupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Get API Key →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          How to Configure
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>Copy <code className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">.env.example</code> to <code className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">.env</code></li>
          <li>Sign up for each service you need (click "Get API Key" links above)</li>
          <li>Copy API keys from each service's dashboard</li>
          <li>Paste keys into your <code className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">.env</code> file</li>
          <li>Restart your development server</li>
        </ol>
      </div>
    </div>
  );
}
