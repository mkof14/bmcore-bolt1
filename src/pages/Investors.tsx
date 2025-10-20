import { TrendingUp, DollarSign, Globe, Users, Shield, Zap } from 'lucide-react';

interface InvestorsProps {
  onNavigate: (page: string) => void;
}

export default function Investors({ onNavigate }: InvestorsProps) {
  const marketData = [
    { label: 'Global Wellness Market', value: '$5.6T', growth: '+9.9% CAGR' },
    { label: 'Digital Health Users', value: '500M+', growth: '+23% YoY' },
    { label: 'Wearable Device Market', value: '$116B', growth: '+15.9% CAGR' },
    { label: 'Precision Medicine Market', value: '$88B', growth: '+12.5% CAGR' }
  ];

  const advantages = [
    {
      icon: Shield,
      title: 'Defensible Technology',
      description: 'Proprietary biomathematical models backed by peer-reviewed research and patents pending.'
    },
    {
      icon: Users,
      title: 'Market Validation',
      description: '50,000+ active users, 95% satisfaction rate, and partnerships with leading insurers.'
    },
    {
      icon: Zap,
      title: 'Multiple Revenue Streams',
      description: 'B2C subscriptions, B2B enterprise licenses, API access, and research partnerships.'
    },
    {
      icon: Globe,
      title: 'Global Scalability',
      description: 'Cloud-native architecture with multi-language support and regulatory compliance frameworks.'
    }
  ];

  const milestones = [
    { year: '2023', event: 'Founded', detail: 'Company established by biomedical engineering team' },
    { year: '2023 Q3', event: 'Beta Launch', detail: '1,000 early adopters enrolled' },
    { year: '2024 Q1', event: 'Series A', detail: '$10M raised from leading health tech investors' },
    { year: '2024 Q2', event: 'Enterprise Launch', detail: 'First B2B partnerships with insurers' },
    { year: '2024 Q4', event: 'Platform Scale', detail: '50,000+ active users across 25 countries' },
    { year: '2025', event: 'Series B', detail: 'Currently raising $30M to accelerate growth' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Invest in the Future of Health</h1>
          <p className="text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            BioMath Core is revolutionizing wellness through biomathematical intelligence. Join us in building the next generation of health technology.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors inline-flex items-center space-x-2"
          >
            <span>Request Investor Deck</span>
            <TrendingUp className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Market Opportunity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {marketData.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.label}</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{item.value}</div>
                <div className="text-sm text-green-600 dark:text-green-400 font-semibold">{item.growth}</div>
              </div>
            ))}
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-4xl mx-auto">
            The wellness technology market is experiencing unprecedented growth as consumers and enterprises seek data-driven health solutions. BioMath Core sits at the intersection of multiple high-growth sectors.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Competitive Advantages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-8 border-2 border-gray-200 dark:border-gray-700">
                <advantage.icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">{advantage.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Growth Trajectory</h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 dark:bg-blue-900 -translate-x-1/2"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="inline-block bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{milestone.event}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{milestone.detail}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full -translate-x-1/2 border-4 border-white dark:border-gray-950"></div>
                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Financial Highlights</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Revenue Growth</h3>
                    <p className="text-gray-600 dark:text-gray-300">300% year-over-year growth with strong unit economics and 85% gross margins.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">User Retention</h3>
                    <p className="text-gray-600 dark:text-gray-300">92% annual retention rate with Net Promoter Score of 72.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Expansion Strategy</h3>
                    <p className="text-gray-600 dark:text-gray-300">Proven B2C model with clear path to high-margin B2B enterprise revenue.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Use of Funds</h3>
              <div className="space-y-4">
                {[
                  { category: 'Product Development', percentage: 40 },
                  { category: 'Go-to-Market', percentage: 30 },
                  { category: 'Operations & Infrastructure', percentage: 20 },
                  { category: 'Research & IP', percentage: 10 }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Ready to Learn More?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            We're currently raising our Series B round. Connect with us to receive our full investor deck and financial projections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              Schedule Meeting
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg border-2 border-gray-200 dark:border-gray-700 transition-colors"
            >
              Request Materials
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
