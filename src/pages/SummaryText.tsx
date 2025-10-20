import BackButton from '../components/BackButton';

interface SummaryTextProps {
  onNavigate: (page: string) => void;
}

export default function SummaryText({ onNavigate }: SummaryTextProps) {
  return (
    <div className="min-h-screen bg-gray-950 transition-colors">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <BackButton onNavigate={onNavigate} />

          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-blue-500">BioMath</span>
              <span className="text-white"> Core</span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-white mx-auto mb-8"></div>
            <p className="text-xl text-gray-400">Platform Summary</p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 md:p-12 space-y-6">
              <p className="text-gray-300 leading-relaxed text-lg">
                BioMath Core is designed to give people <span className="text-blue-400 font-semibold">mastery over their health</span> through understanding, interpretation, and guided decision-making. Unlike traditional wellness apps, medical systems, or wearable dashboards, BioMath Core is not built around metrics or treatment but around <span className="text-orange-500 font-semibold">meaning</span>.
              </p>

              <p className="text-gray-300 leading-relaxed text-lg">
                It does not track more—<span className="text-blue-400 font-semibold">it explains better</span>. Users do not simply receive data; they learn how to read and govern their own biology with clarity and continuity.
              </p>

              <div className="border-t border-gray-700 my-8 pt-8">
                <h2 className="text-3xl font-bold text-white mb-6">The AI Tutor</h2>
                <p className="text-gray-300 leading-relaxed text-lg mb-4">
                  Instead of forcing users to search for insight, navigate menus, or configure settings, the Tutor <span className="text-orange-500 font-semibold">leads them contextually</span>, presenting the right service, interpretation, or next step at the right time.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg">
                  This converts the user from a passive recipient of health information into an <span className="text-blue-400 font-semibold">active decision-maker</span>. The first screen shows "what matters now" and "what to do next."
                </p>
              </div>

              <div className="border-t border-gray-700 my-8 pt-8">
                <h2 className="text-3xl font-bold text-white mb-6">Three-Phase Service Flow</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-blue-400 mb-2">1. Readiness</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Before a report is generated, the system performs a guided preparation check to ensure that key contextual data is present and that the user understands what influences accuracy.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-orange-500 mb-2">2. Dual-Intelligence Generation</h3>
                    <p className="text-gray-300 leading-relaxed">
                      BioMath Core uses a dual-model framework where two AI reasoning engines independently produce assessments and the system compares them, surfacing alignment or divergence. A second opinion becomes a validation layer that exposes reasoning.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-2">3. Interpretation</h3>
                    <p className="text-gray-300 leading-relaxed">
                      After generation, the Tutor interprets meaning—not just output—and directs the user toward next actions, learning context, or longitudinal tracking. Each service becomes a living module rather than a single-use tool.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 my-8 pt-8">
                <h2 className="text-3xl font-bold text-white mb-6">Hybrid Monetization Model</h2>
                <p className="text-gray-300 leading-relaxed text-lg mb-4">
                  Base subscription with depth-based add-ons — conversion through demonstration, not restriction.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg">
                  The three-tier structure is not based on feature gating but <span className="text-blue-400 font-semibold">capability evolution</span>. Add-ons are not transactions but <span className="text-orange-500 font-semibold">accelerators</span>—extensions of interpretive depth surfaced contextually when most relevant.
                </p>
              </div>

              <div className="border-t border-gray-700 my-8 pt-8">
                <h2 className="text-3xl font-bold text-white mb-6">Data Philosophy</h2>
                <p className="text-gray-300 leading-relaxed text-lg mb-4">
                  Data collection is intentionally minimal and meaning-driven. The platform does not ask for completeness but for <span className="text-blue-400 font-semibold">relevance</span>. Questionnaires feed precision rather than bureaucracy: data is requested only when it <span className="text-blue-400 font-semibold">changes interpretation</span>.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Personalization operates at the routing level, not the cosmetic level—what the user sees, learns, and is guided toward shifts dynamically based on their ongoing health signals. The value is <span className="text-orange-500 font-semibold">cumulative</span>: the longer the user stays inside the system, the more intelligent the platform becomes about them.
                </p>
              </div>

              <div className="border-t border-gray-700 my-8 pt-8">
                <h2 className="text-3xl font-bold text-white mb-6">Strategic Positioning</h2>
                <p className="text-gray-300 leading-relaxed text-lg mb-4">
                  BioMath Core does not compete with telemedicine, wellness apps, or wearables—<span className="text-orange-500 font-semibold">it completes them</span>. It becomes the <span className="text-blue-400 font-semibold">reasoning layer</span> that modern health technology has been missing.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg mb-4">
                  The core market narrative frames the platform as the <span className="text-orange-500 font-semibold">bridge between health data and health understanding</span>.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Users are not purchasing reports, but <span className="text-blue-400 font-semibold">literacy</span>—the ability to navigate their own wellbeing with agency and foresight.
                </p>
              </div>

              <div className="border-t border-gray-700 my-8 pt-8">
                <div className="bg-gradient-to-br from-blue-900/40 to-orange-900/40 rounded-xl p-8 text-center">
                  <h2 className="text-4xl font-bold text-white mb-6">NOT AN APP</h2>
                  <p className="text-xl text-gray-200 leading-relaxed mb-4">
                    BioMath Core is a <span className="text-blue-400 font-bold">personal health intelligence infrastructure</span>
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed mb-4">
                    It stays with the user across time, adapts as they evolve, and transforms what health means from something reactive to something <span className="text-orange-500 font-semibold">consciously governed</span>.
                  </p>
                  <p className="text-xl text-white leading-relaxed">
                    <span className="text-blue-400 font-semibold">Understanding</span> is the highest form of health empowerment. BioMath Core exists to deliver that understanding <span className="text-orange-500 font-semibold">continuously, intelligently, and personally</span>.
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
