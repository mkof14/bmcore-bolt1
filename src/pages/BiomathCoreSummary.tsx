import { Activity, Brain, Zap, Target, Globe, Shield, TrendingUp, Sparkles, ArrowRight, Cpu, Lock } from 'lucide-react';
import BackButton from '../components/BackButton';

interface BiomathCoreSummaryProps {
  onNavigate: (page: string) => void;
}

export default function BiomathCoreSummary({ onNavigate }: BiomathCoreSummaryProps) {
  return (
    <div className="min-h-screen bg-gray-950 transition-colors">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/30 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/20 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <BackButton onNavigate={onNavigate} />

          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight">
                BIOMATH CORE
              </h1>
              <div className="h-1 w-48 bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500 mx-auto mb-8"></div>
            </div>
            <p className="text-2xl md:text-3xl text-blue-400 font-semibold mb-4">
              Intelligent Health Operating System
            </p>
            <p className="text-xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
              A new category in digital health: intelligence-led personal health navigation
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-12 border-2 border-blue-500/30 shadow-2xl">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-blue-500/20 p-4 rounded-xl">
                <Brain className="h-10 w-10 text-blue-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                The Core Principle
              </h2>
            </div>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              BioMath Core is designed to give people <span className="text-blue-400 font-semibold">mastery over their health</span> through understanding, interpretation, and guided decision-making. Unlike traditional wellness apps, medical systems, or wearable dashboards, BioMath Core is not built around metrics or treatment but around <span className="text-orange-500 font-semibold">meaning</span>.
            </p>
            <p className="text-xl text-gray-300 leading-relaxed">
              It does not track more—<span className="text-blue-400 font-semibold">it explains better</span>. Users do not simply receive data; they learn how to read and govern their own biology with clarity and continuity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              THE AI TUTOR
            </h2>
            <div className="h-1 w-32 bg-orange-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto">
              The foundation of the system and primary interface to the platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="h-8 w-8 text-orange-500" />
                <h3 className="text-2xl font-bold text-white">Contextual Leadership</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Instead of forcing users to search for insight, navigate menus, or configure settings, the Tutor <span className="text-orange-500 font-semibold">leads them contextually</span>, presenting the right service, interpretation, or next step at the right time.
              </p>
            </div>

            <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="h-8 w-8 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Active Decision-Making</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                This converts the user from a <span className="text-gray-500">passive recipient</span> of health information into an <span className="text-blue-400 font-semibold">active decision-maker</span>. The first screen shows "what matters now" and "what to do next."
              </p>
            </div>

            <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="h-8 w-8 text-yellow-500" />
                <h3 className="text-2xl font-bold text-white">AI-Guided Dashboard</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                The dashboard is AI-guided rather than user-assembled; it <span className="text-yellow-500 font-semibold">reorganizes itself dynamically</span> based on relevance, personal risk signals, and actionable insight.
              </p>
            </div>

            <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <h3 className="text-2xl font-bold text-white">Direction Over Status</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                The first screen is not about status but <span className="text-green-400 font-semibold">direction</span>—showing what matters now and guiding the next intelligent action.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              THREE-PHASE SERVICE FLOW
            </h2>
            <div className="h-1 w-32 bg-blue-500 mx-auto mb-8"></div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/40 to-gray-900/40 backdrop-blur border-l-4 border-blue-500 rounded-r-2xl p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">READINESS</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Before a report is generated, the system performs a <span className="text-blue-400 font-semibold">guided preparation check</span> to ensure that key contextual data is present and that the user understands what influences accuracy.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-900/40 to-gray-900/40 backdrop-blur border-l-4 border-orange-500 rounded-r-2xl p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-500 text-white font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">DUAL-INTELLIGENCE GENERATION</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    BioMath Core uses a <span className="text-orange-500 font-semibold">dual-model framework</span> where two AI reasoning engines independently produce assessments and the system compares them, surfacing alignment or divergence. A second opinion becomes a <span className="text-orange-400 font-semibold">validation layer that exposes reasoning</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/40 to-gray-900/40 backdrop-blur border-l-4 border-green-500 rounded-r-2xl p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 text-white font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">INTERPRETATION</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    After generation, the Tutor <span className="text-green-400 font-semibold">interprets meaning</span>—not just output—and directs the user toward next actions, learning context, or longitudinal tracking. Each service becomes a <span className="text-green-400 font-semibold">living module</span> rather than a single-use tool.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              HYBRID MONETIZATION MODEL
            </h2>
            <div className="h-1 w-32 bg-orange-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto">
              Base subscription with depth-based add-ons — conversion through demonstration, not restriction
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-900/70 backdrop-blur border-2 border-blue-500/50 rounded-2xl p-8 text-center">
              <div className="bg-blue-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">CORE</h3>
              <p className="text-gray-400 text-lg">Awareness</p>
            </div>

            <div className="bg-gray-900/70 backdrop-blur border-2 border-orange-500/50 rounded-2xl p-8 text-center">
              <div className="bg-orange-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">DAILY</h3>
              <p className="text-gray-400 text-lg">Active Guidance</p>
            </div>

            <div className="bg-gray-900/70 backdrop-blur border-2 border-green-500/50 rounded-2xl p-8 text-center">
              <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">MAX</h3>
              <p className="text-gray-400 text-lg">Anticipatory Intelligence</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border border-gray-800">
            <p className="text-xl text-gray-300 leading-relaxed text-center">
              The three-tier structure is not based on <span className="text-gray-500">feature gating</span> but <span className="text-blue-400 font-semibold">capability evolution</span>. Add-ons are not transactions but <span className="text-orange-500 font-semibold">accelerators</span>—extensions of interpretive depth surfaced contextually when most relevant.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              DATA PHILOSOPHY
            </h2>
            <div className="h-1 w-32 bg-blue-500 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="h-8 w-8 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Minimal & Meaning-Driven</h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Data collection is intentionally minimal and meaning-driven. The platform does not ask for completeness but for <span className="text-blue-400 font-semibold">relevance</span>.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Questionnaires feed precision rather than bureaucracy: data is requested only when it <span className="text-blue-400 font-semibold">changes interpretation</span>.
              </p>
            </div>

            <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Cpu className="h-8 w-8 text-orange-500" />
                <h3 className="text-2xl font-bold text-white">Cumulative Intelligence</h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Personalization operates at the <span className="text-orange-500 font-semibold">routing level</span>, not the cosmetic level—what the user sees, learns, and is guided toward shifts dynamically based on their ongoing health signals.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The value is <span className="text-orange-500 font-semibold">cumulative</span>: the longer the user stays inside the system, the more intelligent the platform becomes about them.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              STRATEGIC POSITIONING
            </h2>
            <div className="h-1 w-32 bg-orange-500 mx-auto mb-8"></div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-12 border-2 border-orange-500/30 shadow-2xl mb-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-orange-500/20 p-4 rounded-xl">
                <Globe className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-4xl font-bold text-white">Category Creator</h3>
            </div>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              BioMath Core does not compete with telemedicine, wellness apps, or wearables—<span className="text-orange-500 font-semibold">it completes them</span>. It becomes the <span className="text-blue-400 font-semibold">reasoning layer</span> that modern health technology has been missing.
            </p>
            <p className="text-xl text-gray-300 leading-relaxed">
              The core market narrative frames the platform as the <span className="text-orange-500 font-semibold">bridge between health data and health understanding</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-8 w-8 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Not Reports — Literacy</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Users are not purchasing reports, but <span className="text-blue-400 font-semibold">literacy</span>—the ability to navigate their own wellbeing with agency and foresight.
              </p>
            </div>

            <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="h-8 w-8 text-orange-500" />
                <h3 className="text-2xl font-bold text-white">Identity Transformation</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                <span className="text-orange-500 font-semibold">"You become someone who can read your body and act on understanding, not guesswork."</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900/40 via-gray-900 to-orange-900/40 rounded-3xl p-16 border-2 border-blue-500/50 shadow-2xl text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              NOT AN APP
            </h2>
            <div className="h-1 w-48 bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500 mx-auto mb-8"></div>
            <p className="text-2xl md:text-3xl text-gray-200 leading-relaxed mb-8">
              BioMath Core is a <span className="text-blue-400 font-bold">personal health intelligence infrastructure</span>
            </p>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              It stays with the user across time, adapts as they evolve, and transforms what health means from something reactive to something <span className="text-orange-500 font-semibold">consciously governed</span>.
            </p>
            <div className="bg-gray-950/50 backdrop-blur rounded-2xl p-8 border border-gray-800">
              <p className="text-2xl text-white leading-relaxed">
                <span className="text-blue-400 font-semibold">Understanding</span> is the highest form of health empowerment. BioMath Core exists to deliver that understanding <span className="text-orange-500 font-semibold">continuously, intelligently, and personally</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Explore the Platform
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => onNavigate('services')}
              className="group flex items-center justify-center space-x-2 text-blue-400 hover:text-blue-300 text-lg font-semibold transition-colors"
            >
              <span>View Services</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="group flex items-center justify-center space-x-2 text-orange-500 hover:text-orange-400 text-lg font-semibold transition-colors"
            >
              <span>See Pricing</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="group flex items-center justify-center space-x-2 text-green-400 hover:text-green-300 text-lg font-semibold transition-colors"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
