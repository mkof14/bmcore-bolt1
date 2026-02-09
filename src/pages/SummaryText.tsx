import { useTheme } from '../contexts/ThemeContext';
import BackButton from '../components/BackButton';

interface SummaryTextProps {
  onNavigate: (page: string) => void;
}

export default function SummaryText({ onNavigate }: SummaryTextProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark
          ? 'bg-gray-950'
          : 'bg-gradient-to-b from-white via-orange-50/40 to-white'
      }`}
    >
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <BackButton onNavigate={onNavigate} />
          </div>

          <div className="text-center mb-14">
            <span
              className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                isDark
                  ? 'border-white/20 text-white/70'
                  : 'border-orange-200 text-orange-700 bg-white/80'
              }`}
            >
              Platform Summary
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight">
              <span className="text-blue-500">BioMath</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}> Core</span>
            </h1>
            <p className={`mt-4 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Health intelligence built on meaning, context, and continuous understanding.
            </p>
          </div>

          <div className="space-y-8">
            <div
              className={`rounded-3xl border px-8 py-10 shadow-xl ${
                isDark
                  ? 'border-gray-800 bg-gray-900/60'
                  : 'border-slate-200 bg-white/90 backdrop-blur'
              }`}
            >
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                BioMath Core is designed to give people{' '}
                <span className="text-blue-500 font-semibold">mastery over their health</span> through
                understanding, interpretation, and guided decision-making. Unlike traditional wellness
                apps, medical systems, or wearable dashboards, BioMath Core is not built around metrics
                or treatment but around <span className="text-orange-500 font-semibold">meaning</span>.
              </p>
              <p className={`mt-4 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                It does not track more—<span className="text-blue-500 font-semibold">it explains better</span>.
                Users do not simply receive data; they learn how to read and govern their own biology with
                clarity and continuity.
              </p>
            </div>

            <div
              className={`rounded-3xl border px-8 py-10 shadow-xl ${
                isDark
                  ? 'border-gray-800 bg-gray-900/60'
                  : 'border-slate-200 bg-white/90 backdrop-blur'
              }`}
            >
              <h2 className={`text-2xl md:text-3xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                The AI Health Advisor
              </h2>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Instead of forcing users to search for insight, navigate menus, or configure settings, the
                AI Health Advisor <span className="text-orange-500 font-semibold">leads them contextually</span>,
                presenting the right service, interpretation, or next step at the right time.
              </p>
              <p className={`mt-4 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                This converts the user from a passive recipient of health information into an{' '}
                <span className="text-blue-500 font-semibold">active decision-maker</span>. The first screen
                shows what matters now and what to do next.
              </p>
            </div>

            <div
              className={`rounded-3xl border px-8 py-10 shadow-xl ${
                isDark
                  ? 'border-gray-800 bg-gray-900/60'
                  : 'border-slate-200 bg-white/90 backdrop-blur'
              }`}
            >
              <h2 className={`text-2xl md:text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Three-Phase Service Flow
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className={`rounded-2xl border p-6 ${isDark ? 'border-gray-800 bg-gray-900/40' : 'border-slate-200 bg-slate-50'}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">01. Readiness</p>
                  <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Guided preparation ensures key context is present and the user understands what influences accuracy.
                  </p>
                </div>
                <div className={`rounded-2xl border p-6 ${isDark ? 'border-gray-800 bg-gray-900/40' : 'border-slate-200 bg-slate-50'}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                    02. Dual-Intelligence
                  </p>
                  <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Two independent AI reasoning engines produce assessments, compared for alignment or divergence.
                  </p>
                </div>
                <div className={`rounded-2xl border p-6 ${isDark ? 'border-gray-800 bg-gray-900/40' : 'border-slate-200 bg-slate-50'}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
                    03. Interpretation
                  </p>
                  <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    The advisor interprets meaning, then directs next actions, learning, and longitudinal tracking.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-3xl border px-8 py-10 shadow-xl ${
                isDark
                  ? 'border-gray-800 bg-gray-900/60'
                  : 'border-slate-200 bg-white/90 backdrop-blur'
              }`}
            >
              <h2 className={`text-2xl md:text-3xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Hybrid Monetization Model
              </h2>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Base subscription with depth-based add-ons — conversion through demonstration, not restriction.
              </p>
              <p className={`mt-4 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                The three-tier structure is not based on feature gating but{' '}
                <span className="text-blue-500 font-semibold">capability evolution</span>. Add-ons are not
                transactions but <span className="text-orange-500 font-semibold">accelerators</span>—extensions of
                interpretive depth surfaced contextually when most relevant.
              </p>
            </div>

            <div
              className={`rounded-3xl border px-8 py-10 shadow-xl ${
                isDark
                  ? 'border-gray-800 bg-gray-900/60'
                  : 'border-slate-200 bg-white/90 backdrop-blur'
              }`}
            >
              <h2 className={`text-2xl md:text-3xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Data Philosophy
              </h2>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Data collection is intentionally minimal and meaning-driven. The platform does not ask for
                completeness but for <span className="text-blue-500 font-semibold">relevance</span>. Questionnaires
                feed precision rather than bureaucracy: data is requested only when it{' '}
                <span className="text-blue-500 font-semibold">changes interpretation</span>.
              </p>
              <p className={`mt-4 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Personalization operates at the routing level, not the cosmetic level—what the user sees, learns,
                and is guided toward shifts dynamically based on their ongoing health signals. The value is{' '}
                <span className="text-orange-500 font-semibold">cumulative</span>: the longer the user stays inside
                the system, the more intelligent the platform becomes about them.
              </p>
            </div>

            <div
              className={`rounded-3xl border px-8 py-10 shadow-xl ${
                isDark
                  ? 'border-gray-800 bg-gray-900/60'
                  : 'border-slate-200 bg-white/90 backdrop-blur'
              }`}
            >
              <h2 className={`text-2xl md:text-3xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Strategic Positioning
              </h2>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                BioMath Core does not compete with telemedicine, wellness apps, or wearables—{' '}
                <span className="text-orange-500 font-semibold">it completes them</span>. It becomes the{' '}
                <span className="text-blue-500 font-semibold">reasoning layer</span> that modern health technology
                has been missing.
              </p>
              <p className={`mt-4 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                The core market narrative frames the platform as the{' '}
                <span className="text-orange-500 font-semibold">bridge between health data and health understanding</span>.
              </p>
              <p className={`mt-4 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Users are not purchasing reports, but <span className="text-blue-500 font-semibold">literacy</span>—
                the ability to navigate their own wellbeing with agency and foresight.
              </p>
            </div>

            <div
              className={`rounded-3xl border p-10 text-center shadow-xl ${
                isDark
                  ? 'border-gray-800 bg-gradient-to-br from-blue-900/40 to-orange-900/40'
                  : 'border-orange-100 bg-gradient-to-br from-blue-50 to-orange-50'
              }`}
            >
              <h2 className={`text-3xl md:text-4xl font-semibold mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                NOT AN APP
              </h2>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                BioMath Core is a <span className="text-blue-500 font-semibold">personal health intelligence infrastructure</span>.
              </p>
              <p className={`mt-4 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                It stays with the user across time, adapts as they evolve, and transforms what health means from
                something reactive to something <span className="text-orange-500 font-semibold">consciously governed</span>.
              </p>
              <p className={`mt-4 text-lg leading-relaxed ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-blue-500 font-semibold">Understanding</span> is the highest form of health
                empowerment. BioMath Core exists to deliver that understanding{' '}
                <span className="text-orange-500 font-semibold">continuously, intelligently, and personally</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
