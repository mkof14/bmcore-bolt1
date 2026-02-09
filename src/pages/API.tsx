import { Code, Key, Database, Shield, Zap, CheckCircle } from 'lucide-react';

interface APIProps {
  onNavigate: (page: string) => void;
}

export default function API({ onNavigate }: APIProps) {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/user/profile',
      description: 'Retrieve user profile and physiological model parameters'
    },
    {
      method: 'GET',
      path: '/api/v1/user/metrics',
      description: 'Get current wellness metrics and scores'
    },
    {
      method: 'GET',
      path: '/api/v1/user/insights',
      description: 'Access personalized insights and recommendations'
    },
    {
      method: 'POST',
      path: '/api/v1/data/sync',
      description: 'Submit new physiological data from external sources'
    },
    {
      method: 'GET',
      path: '/api/v1/predictions',
      description: 'Retrieve predictive health trajectories'
    },
    {
      method: 'GET',
      path: '/api/v1/reports',
      description: 'Generate comprehensive health reports'
    }
  ];

  const features = [
    {
      icon: Key,
      title: 'API Key Authentication',
      description: 'Secure authentication using API keys with configurable permissions and rate limits.'
    },
    {
      icon: Database,
      title: 'RESTful Architecture',
      description: 'Clean, predictable REST API design with comprehensive documentation and examples.'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Enterprise-grade security with encryption at rest and in transit, full audit logs.'
    },
    {
      icon: Zap,
      title: 'Real-Time Webhooks',
      description: 'Receive instant notifications when new insights or alerts are generated.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top,_#fff6ed,_transparent_55%),linear-gradient(135deg,#f8fafc,white)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%),linear-gradient(135deg,#0f172a,#020617)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200/80 bg-white/70 text-[11px] font-semibold uppercase tracking-[0.32em] text-orange-700 backdrop-blur dark:bg-white/10 dark:text-orange-200 dark:border-orange-300/20 mb-6">
              API
            </div>
            <h1 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">API Documentation</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Integrate BioMath Core's biomathematical intelligence into your applications, platforms, and workflows.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-white mb-12 text-center">API Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 border border-blue-200 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-gray-950 rounded-2xl p-12 border border-gray-200 dark:border-gray-800">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 text-center">Core Endpoints</h2>
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <div className="flex items-center space-x-3 mb-3 md:mb-0">
                      <span className={`px-3 py-1 rounded-md text-sm font-semibold ${
                        endpoint.method === 'GET'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-gray-900 dark:text-white font-mono">{endpoint.path}</code>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 md:flex-1">{endpoint.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-white mb-12 text-center">Quick Start Example</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Authentication</h3>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-6 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <code>{`curl -X GET \\
  https://api.biomathcore.com/v1/user/metrics \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
                </pre>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 dark:text-gray-300">Get your API key from the developer dashboard</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 dark:text-gray-300">Include the key in the Authorization header</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 dark:text-gray-300">All requests must use HTTPS</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Example Response</h3>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-6 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <code>{`{
  "user_id": "usr_12345",
  "timestamp": "2025-10-19T10:30:00Z",
  "metrics": {
    "overall_wellness": 78,
    "stress_level": 45,
    "recovery_score": 82,
    "energy_availability": 71,
    "inflammatory_load": 32
  },
  "insights": [
    "Recovery is strong today",
    "Consider light activity"
  ]
}`}</code>
                </pre>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
                >
                  Request API Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-white mb-12 text-center">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Insurance Platforms',
                description: 'Integrate wellness data for risk assessment, policy pricing, and member engagement programs.'
              },
              {
                title: 'Healthcare Apps',
                description: 'Enhance patient monitoring with biomathematical insights and predictive analytics.'
              },
              {
                title: 'Research Studies',
                description: 'Access population-level analytics and individual participant data for clinical research.'
              },
              {
                title: 'Corporate Wellness',
                description: 'Deploy wellness tracking across your organization with custom dashboards and reporting.'
              },
              {
                title: 'Fitness Platforms',
                description: 'Augment training programs with physiological state monitoring and recovery optimization.'
              },
              {
                title: 'Clinical Decision Support',
                description: 'Provide clinicians with actionable patient insights integrated into EHR workflows.'
              }
            ].map((useCase, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{useCase.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Code className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl font-semibold mb-6">Ready to Build?</h2>
          <p className="text-xl text-slate-200 mb-8">
            Get started with our API today. Enterprise support and custom integrations available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 font-semibold rounded-lg transition-colors"
            >
              Contact Sales
            </button>
            <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors border border-gray-700">
              View Full Documentation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
