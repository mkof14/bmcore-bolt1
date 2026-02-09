import { Target, MapPin, Users, Sparkles, Shield, Users2, TrendingUp, CheckCircle, Globe } from 'lucide-react';
import BackButton from '../components/BackButton';
import SEO from '../components/SEO';
import CTASection from '../components/CTASection';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  const platformStats = [
    { label: 'Health Categories', value: '20' },
    { label: 'Active Services', value: '200+' },
    { label: 'Research Journey', value: 'Since 2008' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <SEO
        title="About Us - Mission, Vision & Team"
        description="Learn about BioMath Core's mission to build trustworthy wellness intelligence through biomathematics, computational biology, and AI. Discover our founder's journey and our commitment to preventive health."
        keywords={['about biomath core', 'health technology mission', 'computational biology', 'biomathematics', 'preventive wellness', 'health AI company']}
        url="/about"
      />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton onNavigate={onNavigate} />

          <section className="relative py-20 text-center overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_top,_#fff6ed,_transparent_55%),linear-gradient(135deg,#f8fafc,white)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%),linear-gradient(135deg,#0f172a,#020617)] border border-gray-100 dark:border-gray-800">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -top-16 left-12 w-56 h-56 rounded-full bg-orange-400/20 blur-3xl"></div>
              <div className="absolute top-8 right-12 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"></div>
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200/80 bg-white/70 text-[11px] font-semibold uppercase tracking-[0.32em] text-orange-700 backdrop-blur dark:bg-white/10 dark:text-orange-200 dark:border-orange-300/20">
                About BioMath Core
              </div>
              <h1 className="mt-6 text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
                Mission, vision, and the people behind the platform
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-2">
                Digital health and biomath analytics engineered for precision, transparency, and human‑centered intelligence.
              </p>
            </div>
          </section>

          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  We build trustworthy, practical wellness intelligence at the intersection of{' '}
                  <span className="font-semibold text-gray-900">biomathematics</span>,{' '}
                  <span className="font-semibold text-gray-900">computational biology</span>, and{' '}
                  <span className="font-semibold text-gray-900">AI</span>. BioMath Core helps people and professionals navigate complex health questions with precise, explainable guidance — focused on prevention, wellness, and long‑term resilience.
                </p>
              </div>

              <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center mb-6">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Founder</h2>
                <div className="text-gray-600 space-y-3 leading-relaxed">
                  <p>
                    <span className="font-semibold text-gray-900">Michael Kofman</span> is a visionary technology entrepreneur and creator of BioMath Core — a platform uniting advanced analytics, AI, and human health.
                  </p>
                  <p>
                    Through{' '}
                    <a
                      href="https://digitalinvest.com/#home"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500 font-semibold underline transition-colors"
                    >
                      Digital Invest Inc.
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://biomathlife.com/#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500 font-semibold underline transition-colors"
                    >
                      BioMath Life
                    </a>, he turns rigorous science into usable systems that scale.
                  </p>
                  <p>
                    Recognized by <span className="text-blue-600 font-semibold">Healthcare Tech Outlook</span>.{' '}
                    <a
                      href="https://www.healthcaretechoutlook.com/digital-invest-inc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500 underline transition-colors"
                    >
                      Read the interview →
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 text-white">
              <p className="text-gray-200 text-lg">
                Our platform expands only when the signal is strong — based on real user needs, evidence, and long‑term health impact.
              </p>
            </div>
          </section>

          <section className="mb-20">
            <div className="grid md:grid-cols-3 gap-6">
              {platformStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm"
                >
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Our Team</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Building the future of digital healthcare together</p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
              <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  We began our journey in <span className="font-semibold text-gray-900 dark:text-white">2008</span>, working in digital healthcare and biomathematical modeling across different countries worldwide. Over these years, we have gained{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">tremendous practical experience</span>, deep understanding of user needs, and expertise in integrating science, technology, and human health.
                </p>

                <p>
                  By studying real people's needs — from patients to clinicians, from families to corporate programs — we arrived at{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">today's understanding</span> of what is truly necessary for preventive medicine, wellness management, and long-term health. This understanding became the foundation of our{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">Human Data Model</span>, which forms the core of the BioMath Core platform.
                </p>

                <div className="bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">BioMath Core Platform</span> is not just a set of tools. It is a{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">living ecosystem</span> capable of incorporating multiple services, implementing innovations, and leveraging achievements from various sciences — from biomathematics and epidemiology to machine learning and behavioral psychology —{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">for the benefit of users</span>.
                  </p>
                </div>

                <p>
                  We continuously work on <span className="font-semibold text-gray-900 dark:text-white">platform improvement</span>: enhancing model accuracy, expanding health category coverage, increasing algorithm transparency, and deepening personalization. We have{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">big plans</span> — from integrating advanced wearable devices to implementing genomic analytics and predictive horizons.
                </p>

                <p>
                  We are <span className="font-semibold text-gray-900 dark:text-white">full of energy and enthusiasm</span>, passionate about our work, and convinced of its value. This endeavor has been shaped by years of applied experience, hundreds of consultations with users and professionals, thousands of hours of research and development.
                </p>

                <div className="border-l-4 border-orange-500 pl-6 py-2 my-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Throughout our journey, we have assembled and collaborated with{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">talented specialists</span> — engineers, biomathematicians, clinicians, data analysts, designers, and researchers — who share our vision,{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">goals, and plans</span>.
                  </p>
                </div>

                <p>
                  Today, we are <span className="font-semibold text-gray-900 dark:text-white">one large team of passionate professionals</span>, experts in our field, committed to innovation and ready for{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">a great path of development</span>. We are building the future of digital healthcare — transparent, human-centered, and science-based.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">The BioMath Core AI Engine</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">A layered system that unifies biological priors, time-series, and context into a single, inspectable pipeline</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">Model-first design</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Biomathematical structures guide learning — reducing overfitting and improving stability
                </p>
              </div>

              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">Multi-modal fusion</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Lab results, lifestyle inputs, wearable data, and clinical knowledge aligned into explainable insights
                </p>
              </div>

              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">Quality gates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Validation, uncertainty flags, and human-in-the-loop review for sensitive areas
                </p>
              </div>

              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">Outcome orientation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Recommendations aim at wellness, prevention, and performance — not treatment
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Our Philosophy</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Core principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Data belongs to you</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Only you decide what to share. Your privacy is paramount.
                </p>
              </div>

              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Knowledge is power</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Understanding your biomarkers gives you the chance to prevent problems early.
                </p>
              </div>

              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">AI is an assistant</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Not a doctor. We provide insights to support your health conversations.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Platform Highlights</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">What makes BioMath Core unique</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">AI-Powered Insights</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advanced machine learning algorithms analyze your health data
                </p>
              </div>

              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">HIPAA Compliant</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enterprise-grade security with end-to-end encryption
                </p>
              </div>

              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users2 className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">Family Focused</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage health analytics for your entire family
                </p>
              </div>

              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">Real-Time Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Instant insights from connected devices
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Who We Serve</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Empowering diverse communities with health intelligence</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Individual Users</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Those who want to understand their health metrics and track progress</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Families</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">For caring about loved ones' health, including children and elderly relatives</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Clinics & Corporate Clients</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Supporting wellness programs and preventive care initiatives</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Investors & Partners</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Participating in the development of a digital health ecosystem</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <CTASection
            variant="secondary"
            title="Ready to explore BioMath Core?"
            description="See how our multi‑model intelligence turns health signals into clear, human guidance."
            primaryButtonText="View Services"
            secondaryButtonText="See Pricing"
            onPrimaryClick={() => onNavigate('services')}
            onSecondaryClick={() => onNavigate('pricing')}
            showStats={false}
          />
        </div>
      </div>
    </div>
  );
}
