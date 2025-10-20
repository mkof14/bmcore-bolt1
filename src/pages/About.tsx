import { Target, Heart, Shield, BookOpen, Lightbulb, Users } from 'lucide-react';

export default function About() {
  const trustPrinciples = [
    {
      icon: Lightbulb,
      title: 'Interprets Signals, Does Not Diagnose',
      description: 'We help you understand patterns and trends. This is educational wellness support, not clinical diagnosis.'
    },
    {
      icon: Heart,
      title: 'Educational, Supportive, Calm Tone',
      description: 'No alarmist language. No fear-based framing. You are learning, never failing. Guidance is invitational, not prescriptive.'
    },
    {
      icon: Shield,
      title: 'Wellness-First, Non-Clinical',
      description: 'We focus on preventive wellness and self-regulation. Our platform improves clarity and emotional safety without clinical pressure.'
    },
    {
      icon: Users,
      title: 'User Controls Data Visibility',
      description: 'You own your data completely. Connections are optional and revocable. Data deletion available on request.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">About BioMath Core</h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A wellness intelligence platform built on reassurance, not urgency
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Purpose</h2>
            <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300">
              <p>
                BioMath Core helps you understand how your body is responding day-to-day and guides you with
                clear, gentle, personalized actions. Rather than tracking numbers, we convert signals into meaning,
                then into supportive daily guidance.
              </p>
              <p>
                We improve clarity, emotional safety, and proactive self-care without clinical pressure.
                This is not a diagnostic or medical platform — it focuses on interpretation, education,
                and preventive wellness through personalized AI insights.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Approach</h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Understanding, Not Overwhelm
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Traditional wellness platforms can create anxiety by presenting endless data without context.
                    We focus on what matters to you today, explained in a way that empowers rather than overwhelms.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Reassurance, Not Urgency
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Our UX is built on emotional safety. You are learning about your body, not being told what's "wrong."
                    Every insight is designed to increase your confidence and reduce stress.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Interpretation, Not Diagnosis
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We help you recognize patterns, understand trends, and learn what your body might be signaling.
                    When something needs professional attention, we guide you clearly — but we never diagnose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trust & Safety Principles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your wellbeing and data privacy are our highest priorities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {trustPrinciples.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Who We Serve
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              BioMath Core is designed for people who:
            </p>
            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
                <span>Seek <strong>clarity, not diagnosis</strong> — wanting to understand their body without medical overwhelm</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
                <span>Value <strong>early wellness optimization</strong> before symptoms escalate</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
                <span>Need guidance for <strong>stress, fatigue, and recovery</strong></span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
                <span>Are interested in <strong>longevity and self-regulation</strong></span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
                <span>Want <strong>understanding, not overwhelm</strong> from their health data</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
                <span>Prefer <strong>proactive self-care without clinical pressure</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 text-white">
            <div className="flex items-start space-x-4 mb-6">
              <BookOpen className="h-8 w-8 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">UX Tone Commitment</h2>
                <div className="space-y-3 text-white/90">
                  <p className="flex items-start space-x-2">
                    <span className="text-white font-bold">•</span>
                    <span><strong>Supportive, not directive</strong> — We guide, we don't command</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-white font-bold">•</span>
                    <span><strong>Simple, not technical</strong> — Clear language, not jargon</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-white font-bold">•</span>
                    <span><strong>No fear-based framing</strong> — Health improvements without anxiety</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-white font-bold">•</span>
                    <span><strong>You never "fail"</strong> — You are learning and growing</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-white font-bold">•</span>
                    <span><strong>Guidance is invitational</strong> — Not prescriptive or demanding</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Data Security & Privacy
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <span><strong>User owns their data:</strong> You have complete ownership and control over all your health information.</span>
              </p>
              <p className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <span><strong>Optional connections:</strong> Wearables and device integrations are completely optional and revocable at any time.</span>
              </p>
              <p className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <span><strong>Interpretation layer only:</strong> We don't store clinical records. We interpret data to provide wellness insights.</span>
              </p>
              <p className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <span><strong>Data deletion on request:</strong> You can delete all your data at any time, no questions asked.</span>
              </p>
              <p className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <span><strong>No resale or profiling:</strong> We never sell your data or allow third-party profiling. Your privacy is absolute.</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
