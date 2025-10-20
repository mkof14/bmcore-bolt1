import { Check, Star, Sparkles, Rocket } from 'lucide-react';

interface ServicesProps {
  onNavigate: (page: string) => void;
}

export default function Services({ onNavigate }: ServicesProps) {
  const plans = [
    {
      name: 'Starter',
      icon: Star,
      price: '$29',
      period: '/month',
      description: 'Perfect for individuals beginning their wellness journey',
      features: [
        'Basic physiological monitoring',
        'Daily wellness score',
        'Weekly insights report',
        'Mobile app access',
        'Data from 1 wearable device',
        'Email support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Pro',
      icon: Sparkles,
      price: '$79',
      period: '/month',
      description: 'For serious health optimizers who want deeper insights',
      features: [
        'Everything in Starter',
        'Advanced biomathematical analysis',
        'Predictive health trends',
        'Integration with lab results',
        'Genomic data analysis',
        'Multiple wearable devices',
        'Priority support',
        'Monthly consultation call'
      ],
      cta: 'Get Started',
      popular: true
    },
    {
      name: 'Enterprise',
      icon: Rocket,
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for organizations and research teams',
      features: [
        'Everything in Pro',
        'Custom API integration',
        'White-label options',
        'Dedicated account manager',
        'Custom analytics dashboard',
        'HIPAA compliance support',
        'Bulk user management',
        'Advanced security features',
        'Research collaboration tools'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const enterpriseFeatures = [
    {
      title: 'Insurance Integration',
      description: 'Seamlessly integrate wellness data into insurance platforms for risk assessment and member engagement.'
    },
    {
      title: 'Corporate Wellness',
      description: 'Deploy BioMath Core across your organization to improve employee health outcomes and reduce healthcare costs.'
    },
    {
      title: 'Research Collaboration',
      description: 'Access anonymized population-level data and advanced analytics for biomathematical research.'
    },
    {
      title: 'Healthcare Systems',
      description: 'Integrate with EHR systems to provide clinicians with actionable patient insights.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Choose Your Plan</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From individual wellness optimization to enterprise-scale deployment, we have a solution for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white scale-105 shadow-2xl'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center space-x-3 mb-4">
                  <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                  <h3 className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {plan.name}
                  </h3>
                </div>

                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}>
                    {plan.period}
                  </span>
                </div>

                <p className={`mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-300'}`}>
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-blue-200' : 'text-blue-600 dark:text-blue-400'
                      }`} />
                      <span className={plan.popular ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onNavigate('signup')}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-12 mb-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Enterprise & B2B Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {enterpriseFeatures.map((feature, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Schedule Enterprise Demo
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Not Sure Which Plan is Right?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start with a 14-day free trial on any plan. No credit card required. Cancel anytime.
            </p>
            <button
              onClick={() => onNavigate('signup')}
              className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
