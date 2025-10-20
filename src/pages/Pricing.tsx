import { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, Shield, TrendingUp, Zap, ArrowRight } from 'lucide-react';

// Updated: 2025-10-20 01:42 - FORCE REFRESH

interface PricingProps {
  onNavigate: (page: string) => void;
}

export default function Pricing({ onNavigate }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const plans = [
    {
      id: 'core',
      name: 'CORE',
      description: 'Essential health analytics for individuals',
      monthlyPrice: 19,
      yearlyPrice: 19 * 10,
      icon: Shield,
      color: 'gray',
      features: [
        'Basic health dashboard',
        '3 service categories access',
        '10 GB Model Archive storage',
        'Monthly health reports',
        'Email support',
        'Data encryption',
        'Device connectivity (up to 2 devices)'
      ]
    },
    {
      id: 'daily',
      name: 'Daily',
      description: 'Daily insights and comprehensive tracking',
      monthlyPrice: 39,
      yearlyPrice: 39 * 10,
      icon: TrendingUp,
      color: 'blue',
      popular: true,
      features: [
        'Everything in Core',
        'Customizable categories',
        '50 GB Model Archive storage',
        'Daily health reports',
        'Priority email support',
        'Device connectivity (up to 5 devices)',
        'AI Assistant access',
        'Lab results integration',
        'Genetic data analysis'
      ]
    },
    {
      id: 'max',
      name: 'MAX',
      description: 'Complete health intelligence platform',
      monthlyPrice: 79,
      yearlyPrice: 79 * 10,
      icon: Zap,
      color: 'purple',
      features: [
        'Everything in Daily',
        'All 20 service categories',
        '200 GB Model Archive storage',
        'Real-time AI insights',
        '24/7 priority support',
        'Unlimited device connectivity',
        'Predictive analytics',
        'Custom report generation',
        'Family accounts (up to 5 members)'
      ]
    }
  ];

  const comparisonFeatures = [
    { name: 'Health dashboard', core: 'Basic', daily: 'Advanced', max: 'Advanced' },
    { name: 'Service categories', core: '3', daily: 'Customizable', max: 'All 20' },
    { name: 'Model Archive storage', core: '10 GB', daily: '50 GB', max: '200 GB' },
    { name: 'Health reports', core: 'Monthly', daily: 'Daily', max: 'Real-time' },
    { name: 'Support', core: 'Email', daily: 'Priority email', max: '24/7 priority' },
    { name: 'Data encryption', core: true, daily: true, max: true },
    { name: 'Device connectivity', core: 'Up to 2', daily: 'Up to 5', max: 'Unlimited' },
    { name: 'AI Assistant', core: false, daily: true, max: true },
    { name: 'Lab results integration', core: false, daily: true, max: true },
    { name: 'Genetic data analysis', core: false, daily: true, max: true },
    { name: 'Predictive analytics', core: false, daily: false, max: true },
    { name: 'Custom report generation', core: false, daily: false, max: true },
    { name: 'Family accounts', core: false, daily: false, max: 'Up to 5' }
  ];

  const faqs = [
    {
      question: 'Can I switch plans at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the cost accordingly.'
    },
    {
      question: 'What happens after the 5-day trial?',
      answer: 'After your 5-day trial ends, you\'ll be automatically charged based on your selected plan and billing period. You can cancel anytime during the trial without being charged.'
    },
    {
      question: 'Is my health data secure?',
      answer: 'Absolutely. All plans include enterprise-grade encryption, secure data storage, and compliance with HIPAA regulations. Your health data is never shared with third parties without your explicit consent.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support for a full refund within the first 30 days of your subscription.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Annual billing saves you approximately 17% compared to monthly payments. You\'ll see the discounted price when you select yearly billing above.'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getPlanColorClasses = (color: string, isPopular: boolean = false) => {
    const colors = {
      gray: {
        bg: 'from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-850',
        border: 'border-gray-300 dark:border-gray-700',
        button: 'bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500',
        icon: 'text-gray-600 dark:text-gray-400'
      },
      blue: {
        bg: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
        border: 'border-blue-400 dark:border-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
        icon: 'text-blue-600 dark:text-blue-400'
      },
      purple: {
        bg: 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30',
        border: 'border-purple-400 dark:border-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600',
        icon: 'text-purple-600 dark:text-purple-400'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      {/* VERSION MARKER - TEMPORARY */}
      <div className="bg-red-600 text-white text-center py-2 font-bold text-sm">
        🔴 NEW VERSION LOADED - 2025-10-20 01:45 - CORE $19 / Daily $39 / MAX $79
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 tracking-wide uppercase">
            PRICING PLANS
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your <span className="text-blue-600 dark:text-blue-400">Plan</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Each plan expands the Human Data Model. More categories = deeper insights.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white dark:bg-gray-900 rounded-full p-1 border border-gray-300 dark:border-gray-700 shadow-sm">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const colors = getPlanColorClasses(plan.color, plan.popular);
              const price = getPrice(plan);

              return (
                <div
                  key={plan.id}
                  className={`relative bg-gradient-to-br ${colors.bg} rounded-xl p-6 border-2 ${colors.border} transition-all hover:shadow-xl ${
                    plan.popular ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-950' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <Icon className={`h-8 w-8 ${colors.icon} mb-3`} />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${price}
                      </span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        /{billingPeriod === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ${(price / 12).toFixed(0)}/month billed annually
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigate('signup')}
                    className={`w-full py-2.5 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2 mb-6 ${colors.button}`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="space-y-2.5">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${colors.icon}`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compare All Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Compare All Features
          </h2>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Core
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Daily
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-600 dark:text-purple-400">
                      Max
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {feature.name}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {typeof feature.core === 'boolean' ? (
                          feature.core ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 dark:text-gray-700 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">{feature.core}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {typeof feature.daily === 'boolean' ? (
                          feature.daily ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 dark:text-gray-700 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">{feature.daily}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {typeof feature.max === 'boolean' ? (
                          feature.max ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 dark:text-gray-700 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">{feature.max}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trial Notice */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All plans include a <span className="font-bold text-blue-600 dark:text-blue-400">5-day trial</span> with payment details required upfront.
            </p>
            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              <span>Learn more about our platform</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
