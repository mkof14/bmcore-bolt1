import { Target, MapPin, Users, Sparkles, Shield, Users2, TrendingUp } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-orange-600 dark:text-orange-500 mb-3 tracking-wide uppercase">
              MISSION-DRIVEN INNOVATION
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="text-orange-600 dark:text-orange-500">BioMath</span> Core
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
              Digital health and biomath analytics platform engineered for precision, transparency,
              and human-centered intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-orange-100 dark:bg-orange-500/10 p-3 rounded-lg">
                  <Target className="h-8 w-8 text-orange-600 dark:text-orange-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h2>
                </div>
              </div>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  We build trustworthy, practical wellness intelligence at the intersection of{' '}
                  <span className="font-bold text-gray-900 dark:text-white">biomathematics</span>,{' '}
                  <span className="font-bold text-gray-900 dark:text-white">computational biology</span>, and{' '}
                  <span className="font-bold text-gray-900 dark:text-white">AI</span>. BioMath Core helps people and professionals navigate complex health questions with precise, explainable guidance — focused on prevention, wellness, and long-term resilience.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-orange-100 dark:bg-orange-500/10 p-3 rounded-lg">
                  <MapPin className="h-8 w-8 text-orange-600 dark:text-orange-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Our Founder</h2>
                </div>
              </div>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  <span className="font-bold text-gray-900 dark:text-white">Michael Kofman</span> is a visionary technology entrepreneur and creator of BioMath Core — a platform uniting advanced analytics, AI, and human health.
                </p>
                <p>
                  Through{' '}
                  <a
                    href="https://digitalinvest.com/#home"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-semibold underline transition-colors"
                  >
                    Digital Invest Inc.
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://biomathlife.com/#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-semibold underline transition-colors"
                  >
                    BioMath Life
                  </a>, he turns rigorous science into usable systems that scale.
                </p>
                <p>
                  Recognized by <span className="text-orange-600 dark:text-orange-500 font-semibold">Healthcare Tech Outlook</span>.{' '}
                  <a
                    href="https://www.healthcaretechoutlook.com/digital-invest-inc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 underline transition-colors"
                  >
                    Read the interview →
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gray-100 dark:bg-gray-900/30 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-8">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Our platform spans{' '}
              <span className="font-bold text-gray-900 dark:text-white">20 categories with 200+ services</span>{' '}
              (and growing). We expand only when the signal is strong — based on real user needs and evidence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-300 dark:text-gray-800/40">
              BioMath Core
            </h2>
            <p className="text-lg text-gray-400 dark:text-gray-700/30 mt-2">
              Where data meets daily life
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-orange-100 dark:bg-orange-500/10 p-3 rounded-lg">
              <Users className="h-8 w-8 text-orange-600 dark:text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Team</h2>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <p>
              We began our journey in <span className="font-bold text-gray-900 dark:text-white">2008</span>, working in digital healthcare and biomathematical modeling across different countries worldwide. Over these years, we have gained{' '}
              <span className="font-bold text-gray-900 dark:text-white">tremendous practical experience</span>, deep understanding of user needs, and expertise in integrating science, technology, and human health.
            </p>

            <p>
              By studying real people's needs — from patients to clinicians, from families to corporate programs — we arrived at{' '}
              <span className="font-bold text-gray-900 dark:text-white">today's understanding</span> of what is truly necessary for preventive medicine, wellness management, and long-term health. This understanding became the foundation of our{' '}
              <span className="font-bold text-gray-900 dark:text-white">Human Data Model</span>, which forms the core of the BioMath Core platform.
            </p>

            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 my-6">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-bold text-gray-900 dark:text-white">BioMath Core Platform</span> is not just a set of tools. It is a{' '}
                <span className="font-bold text-gray-900 dark:text-white">living ecosystem</span> capable of incorporating multiple services, implementing innovations, and leveraging achievements from various sciences — from biomathematics and epidemiology to machine learning and behavioral psychology —{' '}
                <span className="font-bold text-gray-900 dark:text-white">for the benefit of users</span>.
              </p>
            </div>

            <p>
              We continuously work on <span className="font-bold text-gray-900 dark:text-white">platform improvement</span>: enhancing model accuracy, expanding health category coverage, increasing algorithm transparency, and deepening personalization. We have{' '}
              <span className="font-bold text-gray-900 dark:text-white">big plans</span> — from integrating advanced wearable devices to implementing genomic analytics and predictive horizons.
            </p>

            <p>
              We are <span className="font-bold text-gray-900 dark:text-white">full of energy and enthusiasm</span>, passionate about our work, and convinced of its value. This endeavor has been shaped by years of applied experience, hundreds of consultations with users and professionals, thousands of hours of research and development.
            </p>

            <div className="border-l-4 border-orange-600 dark:border-orange-500 pl-6 py-2 my-6">
              <p className="text-gray-700 dark:text-gray-300">
                Throughout our journey, we have assembled and collaborated with{' '}
                <span className="font-bold text-gray-900 dark:text-white">talented specialists</span> — engineers, biomathematicians, clinicians, data analysts, designers, and researchers — who share our vision,{' '}
                <span className="font-bold text-gray-900 dark:text-white">goals, and plans</span>.
              </p>
            </div>

            <p>
              Today, we are <span className="font-bold text-gray-900 dark:text-white">one large team of passionate professionals</span>, experts in our field, committed to innovation and ready for{' '}
              <span className="font-bold text-gray-900 dark:text-white">a great path of development</span>. We are building the future of digital healthcare — transparent, human-centered, and science-based.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-500/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-500" />
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-500 tracking-wide uppercase">Technology</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              The BioMath Core <span className="text-orange-600 dark:text-orange-500">AI Engine</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
              A layered system that unifies biological priors, time-series, and context into a single, inspectable pipeline:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-orange-600 dark:hover:border-orange-500 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Model-first design</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Biomathematical structures guide learning — reducing overfitting and improving stability
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-orange-600 dark:hover:border-orange-500 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Multi-modal fusion</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Lab results, lifestyle inputs, wearable data, and clinical knowledge aligned into explainable insights
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-orange-600 dark:hover:border-orange-500 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Quality gates</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Validation, uncertainty flags, and human-in-the-loop review for sensitive areas
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-orange-600 dark:hover:border-orange-500 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Outcome orientation</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Recommendations aim at wellness, prevention, and performance — not treatment
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-500/10 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-orange-600 dark:text-orange-500" />
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-500 tracking-wide uppercase">Philosophy</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our <span className="text-orange-600 dark:text-orange-500">Philosophy</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-100 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Data belongs to you</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Only you decide what to share. Your privacy is paramount.
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Knowledge is power</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Understanding your biomarkers gives you the chance to prevent problems early.
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI is an assistant</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Not a doctor. We provide insights to support your health conversations.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/10 dark:to-orange-600/10 border border-orange-300 dark:border-orange-500/30 rounded-xl p-6 text-center">
              <div className="bg-orange-200 dark:bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-orange-700 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI-Powered Insights</h3>
              <p className="text-gray-700 dark:text-gray-400 text-sm">
                Advanced machine learning algorithms analyze your health data
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-500/10 dark:to-green-600/10 border border-green-300 dark:border-green-500/30 rounded-xl p-6 text-center">
              <div className="bg-green-200 dark:bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-700 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">HIPAA Compliant</h3>
              <p className="text-gray-700 dark:text-gray-400 text-sm">
                Enterprise-grade security with end-to-end encryption
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-500/10 dark:to-purple-600/10 border border-purple-300 dark:border-purple-500/30 rounded-xl p-6 text-center">
              <div className="bg-purple-200 dark:bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users2 className="h-8 w-8 text-purple-700 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Family Focused</h3>
              <p className="text-gray-700 dark:text-gray-400 text-sm">
                Manage health analytics for your entire family
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/10 dark:to-orange-600/10 border border-orange-300 dark:border-orange-500/30 rounded-xl p-6 text-center">
              <div className="bg-orange-200 dark:bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-700 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Real-Time Analytics</h3>
              <p className="text-gray-700 dark:text-gray-400 text-sm">
                Instant insights from connected devices
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Who We <span className="text-orange-600 dark:text-orange-500">Serve</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:border-orange-600 dark:hover:border-orange-500 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-500 mt-2"></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Individual Users</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Those who want to understand their health metrics and track progress
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:border-orange-600 dark:hover:border-orange-500 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-500 mt-2"></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Families</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    For caring about loved ones' health, including children and elderly relatives
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:border-orange-600 dark:hover:border-orange-500 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-500 mt-2"></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Clinics & Corporate Clients</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Supporting wellness programs and preventive care initiatives
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:border-orange-600 dark:hover:border-orange-500 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-500 mt-2"></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Investors & Partners</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Participating in the development of a digital health ecosystem
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
