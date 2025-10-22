import { useState } from 'react';
import { Check, Star, Layers, Crown, ArrowRight, CheckCircle } from 'lucide-react';
import BackButton from '../components/BackButton';

interface PricingProps {
  onNavigate: (page: string) => void;
}

export default function Pricing({ onNavigate }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'core',
      name: 'Core',
      icon: Star,
      description: 'Essential health analytics',
      monthlyPrice: 19,
      yearlyPrice: 190,
      categories: '3',
      color: 'orange',
      features: [
        'Any 3 health categories',
        'Basic AI insights',
        '10 GB Model Archive storage',
        'Monthly health reports',
        'Email support',
        'Data encryption',
        'Up to 2 device connections'
      ]
    },
    {
      id: 'daily',
      name: 'Daily',
      icon: Layers,
      description: 'Daily insights & tracking',
      monthlyPrice: 39,
      yearlyPrice: 390,
      categories: '4-10',
      color: 'blue',
      popular: true,
      features: [
        'Everything in Core',
        '4-10 health categories',
        'Advanced analytics',
        '50 GB Model Archive storage',
        'Daily health reports',
        'Priority email support',
        'Up to 5 device connections',
        'AI Health Assistant',
        'Lab results integration',
        'Genetic data analysis'
      ]
    },
    {
      id: 'max',
      name: 'Max',
      icon: Crown,
      description: 'Complete health platform',
      monthlyPrice: 79,
      yearlyPrice: 790,
      categories: 'All 20',
      color: 'slate',
      features: [
        'Everything in Daily',
        'All 20 health categories',
        'Premium AI features',
        '200 GB Model Archive storage',
        'Real-time AI insights',
        '24/7 priority support',
        'Unlimited device connections',
        'Predictive analytics',
        'Custom report generation',
        'Family accounts (up to 5)'
      ]
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const yearlyTotal = plan.monthlyPrice * 12;
    const savings = yearlyTotal - plan.yearlyPrice;
    return savings;
  };

  const getPlanColors = (color: string) => {
    const colors = {
      orange: {
        border: 'border-orange-500',
        bg: 'from-orange-500 to-orange-600',
        icon: 'text-orange-500',
        shadow: 'shadow-orange-500/20',
        hover: 'hover:border-orange-400'
      },
      blue: {
        border: 'border-blue-500',
        bg: 'from-blue-500 to-blue-600',
        icon: 'text-blue-500',
        shadow: 'shadow-blue-500/20',
        hover: 'hover:border-blue-400'
      },
      slate: {
        border: 'border-slate-600',
        bg: 'from-slate-600 to-slate-700',
        icon: 'text-slate-400',
        shadow: 'shadow-slate-500/20',
        hover: 'hover:border-slate-500'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gray-950 transition-colors">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton onNavigate={onNavigate} />

          <section className="py-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Build Your Health Plan
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose from 20 comprehensive health categories and 200+ AI-powered services
            </p>

            <div className="inline-flex items-center bg-gray-900 border border-gray-700 rounded-full p-1.5 shadow-lg">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all relative ${
                  billingPeriod === 'yearly'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Save
                </span>
              </button>
            </div>

            {billingPeriod === 'yearly' && (
              <p className="mt-4 text-green-400 font-semibold animate-in fade-in">
                Save up to 17% with annual billing
              </p>
            )}
          </section>

          <section className="mb-20">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const colors = getPlanColors(plan.color);
                const price = getPrice(plan);
                const savings = getSavings(plan);

                return (
                  <div
                    key={plan.id}
                    className={`group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 rounded-2xl p-8 transition-all duration-500 overflow-hidden ${
                      plan.popular
                        ? `${colors.border} shadow-xl ${colors.shadow}`
                        : `border-gray-700/50 ${colors.hover}`
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="relative">
                      <div className={`w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:${colors.shadow} transition-all`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-400 mb-6">{plan.description}</p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-white">${price}</span>
                          <span className="text-gray-500">
                            /{billingPeriod === 'monthly' ? 'month' : 'year'}
                          </span>
                        </div>
                        {billingPeriod === 'yearly' && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">
                              ${(price / 12).toFixed(2)}/month billed annually
                            </p>
                            <p className="text-xs text-green-400 font-semibold">
                              Save ${savings}/year
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mb-6 p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg">
                        <div className="text-center">
                          <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                            {plan.categories}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">health categories</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate('signup')}
                        className={`w-full py-4 bg-gradient-to-r ${colors.bg} text-white font-bold rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg mb-8 flex items-center justify-center gap-2`}
                      >
                        <span>Get Started</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>

                      <div className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${colors.icon}`} />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-12">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-3">All Plans Include</h2>
                  <p className="text-gray-400">Enterprise-grade features in every subscription</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">5-Day Free Trial</h4>
                    <p className="text-sm text-gray-400">Try before you commit</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">HIPAA Compliant</h4>
                    <p className="text-sm text-gray-400">Your data is secure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Cancel Anytime</h4>
                    <p className="text-sm text-gray-400">No long-term commitment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Data Encryption</h4>
                    <p className="text-sm text-gray-400">Bank-level security</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Easy Upgrades</h4>
                    <p className="text-sm text-gray-400">Switch plans anytime</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">30-Day Refund</h4>
                    <p className="text-sm text-gray-400">Money-back guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-xl text-gray-400">Start building your personalized health platform today</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-orange-400">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Choose Categories</h3>
                  <p className="text-gray-400">Select from 20 health categories that matter to you</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-blue-400">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Connect Data</h3>
                  <p className="text-gray-400">Link your devices and import health records</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-green-400">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Get Insights</h3>
                  <p className="text-gray-400">Receive AI-powered health recommendations</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Health?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users optimizing their health with AI-powered insights
            </p>
            <button
              onClick={() => onNavigate('signup')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              <span>Start Your 5-Day Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="mt-4 text-sm text-gray-500">No credit card required for trial</p>
          </section>
        </div>
      </div>
    </div>
  );
}
