import { Brain, Microscope, Shield, Zap } from 'lucide-react';

export default function WhyTwoModels() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/40 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <span className="inline-flex items-center rounded-full border border-orange-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-700 dark:border-white/15 dark:bg-gray-900/60 dark:text-orange-300">
            Dual Intelligence
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Why Two AI Models?
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our dual-engine approach combines mathematical precision with clinical expertise to provide the most
            comprehensive health analysis available.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900/60">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 dark:bg-blue-900/30">
              <Microscope className="w-7 h-7 text-blue-600 dark:text-blue-300" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Mathematical Model
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Pure data-driven analysis using advanced mathematical algorithms and statistical methods.
            </p>
            <div className="grid gap-3 text-sm text-gray-700 dark:text-gray-300">
              <span>Unbiased pattern recognition</span>
              <span>Complex correlation analysis</span>
              <span>Predictive modeling</span>
              <span>Anomaly detection</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900/60">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 dark:bg-orange-900/30">
              <Brain className="w-7 h-7 text-orange-600 dark:text-orange-300" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Clinical Model
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Evidence-based analysis using medical knowledge and clinical guidelines.
            </p>
            <div className="grid gap-3 text-sm text-gray-700 dark:text-gray-300">
              <span>Medical context interpretation</span>
              <span>Evidence-based recommendations</span>
              <span>Clinical guideline adherence</span>
              <span>Risk factor assessment</span>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            The Power of Dual Analysis
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900/60">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 mx-auto dark:bg-emerald-900/30">
                <Shield className="w-7 h-7 text-emerald-600 dark:text-emerald-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Higher Accuracy
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cross-validation between models reduces false positives and ensures reliable insights
              </p>
            </div>

            <div className="text-center rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900/60">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 mx-auto dark:bg-orange-900/30">
                <Brain className="w-7 h-7 text-orange-600 dark:text-orange-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Comprehensive View
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                See both data-driven patterns and clinical interpretations side by side
              </p>
            </div>

            <div className="text-center rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900/60">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto dark:bg-blue-900/30">
                <Zap className="w-7 h-7 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Better Decisions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Make informed choices with insights backed by both mathematics and medicine
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-900/90 bg-gradient-to-r from-gray-900 to-gray-800 p-10 text-white shadow-2xl">
          <h2 className="text-3xl font-semibold mb-4">The Second Opinion Advantage</h2>
          <p className="text-lg opacity-90 mb-8 max-w-3xl">
            Just like seeking a second medical opinion, our dual AI approach provides you with two independent analyses of your health data. When both models agree, you can have high confidence. When they differ, it highlights areas that may need additional attention or professional consultation.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-sm opacity-85">
            <div>
              <h4 className="font-semibold mb-2 text-base opacity-100">Mathematical Model Strengths</h4>
              <div className="grid gap-1">
                <span>Discovers hidden patterns</span>
                <span>Processes vast amounts of data</span>
                <span>Identifies subtle correlations</span>
                <span>Predicts future trends</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-base opacity-100">Clinical Model Strengths</h4>
              <div className="grid gap-1">
                <span>Applies medical expertise</span>
                <span>Considers clinical context</span>
                <span>Follows evidence-based guidelines</span>
                <span>Prioritizes safety and efficacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
