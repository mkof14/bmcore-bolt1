import { Activity, Brain, Shield, Heart, Lightbulb, Sparkles, ArrowRight, Check, BookOpen } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const coreValues = [
    {
      icon: Brain,
      title: 'Understanding, Not Overwhelm',
      description: 'We convert signals into meaning, then into gentle, supportive daily guidance. Clarity without pressure.'
    },
    {
      icon: Heart,
      title: 'Reassurance, Not Urgency',
      description: 'Built on a foundation of emotional safety. You are learning, never failing. Guidance is invitational, not prescriptive.'
    },
    {
      icon: Lightbulb,
      title: 'Interpretation, Not Diagnosis',
      description: 'We help you understand how your body is responding day-to-day. Educational, supportive, wellness-first.'
    }
  ];

  const howItWorks = [
    { step: '1', title: 'Join', description: 'Create your account and set your wellness focus' },
    { step: '2', title: 'Activate Services', description: 'Choose from 200+ AI services across 20 health categories' },
    { step: '3', title: 'Receive Daily Insights', description: 'Get personalized guidance that helps you understand what your body needs' }
  ];

  const whoItsFor = [
    'Seeking clarity, not diagnosis',
    'Early wellness optimization',
    'Stress, fatigue, and recovery guidance',
    'Longevity and self-regulation',
    'Understanding before symptoms escalate',
    'Proactive self-care without clinical pressure'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900 dark:bg-gray-950">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Welcome to BioMath Core
            </h1>
            <p className="text-3xl md:text-4xl lg:text-5xl font-medium text-yellow-500 mb-8">
              Where data meets daily life.
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-400 mb-12">
              All of Health. One Platform.
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed">
              From sleep to cognition, from movement to mood — BioMath Core brings clarity to your
              health journey. Track, understand, and optimize your wellbeing through intelligent, real-time insights tailored to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <span
                onClick={() => onNavigate('signup')}
                className="text-blue-500 text-lg font-semibold cursor-pointer hover:text-blue-400 transition-colors"
              >
                Start Free Today
              </span>
              <span className="text-gray-500 text-2xl">•</span>
              <span
                onClick={() => onNavigate('learning')}
                className="text-orange-500 text-lg font-semibold cursor-pointer hover:text-orange-400 transition-colors"
              >
                Explore Learning Center
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              From Signals to Meaning to Support
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Rather than tracking numbers, BioMath Core focuses on interpretation, education,
              and preventive wellness through personalized AI insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple, supportive, effective
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 h-full">
                  <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Who Is This For?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              BioMath Core is designed for people who want understanding, not overwhelm
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {whoItsFor.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20">
            <div className="flex items-start space-x-4">
              <Shield className="h-8 w-8 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Your Data, Your Control
                </h3>
                <div className="space-y-2 text-white/90">
                  <p className="flex items-start space-x-2">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>You own your data completely</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Device connections are optional and revocable</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Interpretation layer only — no clinical record storage</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Data deletion available on request</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>No resale or third-party profiling</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <img
              src="/Screenshot 2025-10-19 at 22.52.11.png"
              alt="AI Health with Two Expert Opinions"
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
          <div>
            <img
              src="/Screenshot 2025-10-19 at 22.52.28.png"
              alt="Model Archive - Your Secure Vault"
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
