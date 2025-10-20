import { HeartPulse, Sparkles, TrendingUp, BrainCircuit, Flame, Flower, Shield, Droplet, Leaf, Moon, Wind, Users, Activity, Zap, Heart, Eye, Laptop, Fingerprint, CircleDot, Blend } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HealthCategoriesProps {
  onNavigate: (page: string) => void;
}

export default function HealthCategories({ onNavigate }: HealthCategoriesProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categories = [
    {
      id: 'critical-health',
      name: 'Critical Health',
      icon: HeartPulse,
      gradient: 'from-red-600/90 via-orange-600/90 to-red-700/90',
      iconColor: 'text-orange-300',
      pattern: 'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(234, 88, 12, 0.2) 0%, transparent 50%)',
    },
    {
      id: 'everyday-wellness',
      name: 'Everyday Wellness',
      icon: Sparkles,
      gradient: 'from-amber-600/90 via-yellow-600/90 to-orange-600/90',
      iconColor: 'text-green-300',
      pattern: 'radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.3) 0%, transparent 60%), linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 100%)',
    },
    {
      id: 'longevity-aging',
      name: 'Longevity & Anti-Aging',
      icon: TrendingUp,
      gradient: 'from-blue-700/90 via-indigo-700/90 to-purple-700/90',
      iconColor: 'text-pink-300',
      pattern: 'radial-gradient(circle at 70% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), linear-gradient(to bottom right, rgba(168, 85, 247, 0.2) 0%, transparent 100%)',
    },
    {
      id: 'mental-wellness',
      name: 'Mental Wellness',
      icon: BrainCircuit,
      gradient: 'from-purple-700/90 via-fuchsia-700/90 to-pink-700/90',
      iconColor: 'text-cyan-300',
      pattern: 'radial-gradient(circle at 40% 60%, rgba(147, 51, 234, 0.3) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
    },
    {
      id: 'fitness-performance',
      name: 'Fitness & Performance',
      icon: Flame,
      gradient: 'from-slate-700/90 via-zinc-700/90 to-gray-800/90',
      iconColor: 'text-yellow-300',
      pattern: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
    },
    {
      id: 'womens-health',
      name: "Women's Health",
      icon: Flower,
      gradient: 'from-pink-600/90 via-rose-600/90 to-pink-700/90',
      iconColor: 'text-pink-200',
      pattern: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 60%), linear-gradient(to top, rgba(244, 114, 182, 0.2) 0%, transparent 100%)',
    },
    {
      id: 'mens-health',
      name: "Men's Health",
      icon: Shield,
      gradient: 'from-amber-700/90 via-orange-700/90 to-red-700/90',
      iconColor: 'text-blue-300',
      pattern: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, transparent 70%), radial-gradient(circle at 30% 70%, rgba(234, 88, 12, 0.25) 0%, transparent 50%)',
    },
    {
      id: 'beauty-skincare',
      name: 'Beauty & Skincare',
      icon: Droplet,
      gradient: 'from-rose-600/90 via-pink-600/90 to-fuchsia-600/90',
      iconColor: 'text-pink-200',
      pattern: 'radial-gradient(circle at 60% 40%, rgba(244, 63, 94, 0.3) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(232, 121, 249, 0.2) 0%, transparent 50%)',
    },
    {
      id: 'nutrition-diet',
      name: 'Nutrition & Diet',
      icon: Leaf,
      gradient: 'from-green-700/90 via-emerald-700/90 to-teal-700/90',
      iconColor: 'text-green-200',
      pattern: 'radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.3) 0%, transparent 60%), linear-gradient(to bottom right, rgba(20, 184, 166, 0.2) 0%, transparent 100%)',
    },
    {
      id: 'sleep-recovery',
      name: 'Sleep & Recovery',
      icon: Moon,
      gradient: 'from-indigo-800/90 via-blue-800/90 to-purple-800/90',
      iconColor: 'text-purple-200',
      pattern: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 70%), linear-gradient(to bottom, rgba(147, 51, 234, 0.2) 0%, transparent 100%)',
    },
    {
      id: 'environmental-health',
      name: 'Environmental Health',
      icon: Wind,
      gradient: 'from-teal-700/90 via-cyan-700/90 to-emerald-700/90',
      iconColor: 'text-teal-200',
      pattern: 'radial-gradient(circle at 40% 60%, rgba(20, 184, 166, 0.3) 0%, transparent 60%), linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, transparent 100%)',
    },
    {
      id: 'family-health',
      name: 'Family Health',
      icon: Users,
      gradient: 'from-orange-600/90 via-amber-600/90 to-yellow-600/90',
      iconColor: 'text-orange-200',
      pattern: 'radial-gradient(circle at 60% 40%, rgba(251, 146, 60, 0.3) 0%, transparent 60%), linear-gradient(to top right, rgba(245, 158, 11, 0.2) 0%, transparent 100%)',
    },
    {
      id: 'preventive-medicine',
      name: 'Preventive Medicine',
      icon: Activity,
      gradient: 'from-cyan-700/90 via-blue-700/90 to-sky-700/90',
      iconColor: 'text-cyan-200',
      pattern: 'radial-gradient(circle at 30% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 60%), linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%)',
    },
    {
      id: 'biohacking',
      name: 'Biohacking',
      icon: Zap,
      gradient: 'from-violet-700/90 via-purple-700/90 to-fuchsia-700/90',
      iconColor: 'text-blue-300',
      pattern: 'radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 60%), linear-gradient(to bottom, rgba(147, 51, 234, 0.25) 0%, transparent 100%)',
    },
    {
      id: 'senior-care',
      name: 'Senior Care',
      icon: Heart,
      gradient: 'from-slate-600/90 via-gray-700/90 to-zinc-700/90',
      iconColor: 'text-slate-200',
      pattern: 'linear-gradient(135deg, rgba(148, 163, 184, 0.3) 0%, transparent 70%), radial-gradient(circle at 50% 50%, rgba(113, 113, 122, 0.2) 0%, transparent 60%)',
    },
    {
      id: 'eye-health',
      name: 'Eye Health',
      icon: Eye,
      gradient: 'from-blue-700/90 via-cyan-700/90 to-teal-700/90',
      iconColor: 'text-blue-200',
      pattern: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 60%), linear-gradient(to bottom right, rgba(6, 182, 212, 0.2) 0%, transparent 100%)',
    },
    {
      id: 'digital-therapeutics',
      name: 'Digital Therapeutics',
      icon: Laptop,
      gradient: 'from-violet-700/90 via-purple-700/90 to-indigo-700/90',
      iconColor: 'text-purple-200',
      pattern: 'radial-gradient(circle at 60% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 60%), linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, transparent 100%)',
    },
    {
      id: 'general-sexual',
      name: 'Sexual Longevity',
      icon: Fingerprint,
      gradient: 'from-red-700/90 via-rose-700/90 to-pink-700/90',
      iconColor: 'text-red-200',
      pattern: 'radial-gradient(circle at 40% 60%, rgba(239, 68, 68, 0.3) 0%, transparent 60%), linear-gradient(to top, rgba(244, 63, 94, 0.2) 0%, transparent 100%)',
    },
    {
      id: 'mens-sexual-health',
      name: "Men's Sexual Health",
      icon: CircleDot,
      gradient: 'from-blue-700/90 via-indigo-700/90 to-cyan-700/90',
      iconColor: 'text-blue-200',
      pattern: 'radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 60%), linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, transparent 100%)',
    },
    {
      id: 'womens-sexual-health',
      name: "Women's Sexual Health",
      icon: Blend,
      gradient: 'from-pink-700/90 via-fuchsia-700/90 to-purple-700/90',
      iconColor: 'text-pink-200',
      pattern: 'radial-gradient(circle at 60% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 60%), linear-gradient(to bottom right, rgba(192, 38, 211, 0.2) 0%, transparent 100%)',
    },
  ];

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Health Categories
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Explore 200+ AI-powered services across 20 comprehensive health categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onNavigate('services-catalog')}
                className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1"
                style={{ aspectRatio: '1' }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} transition-all duration-300`}
                  style={{ backgroundImage: category.pattern }}
                ></div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                </div>

                <div className="relative h-full p-4 flex flex-col items-center justify-end text-center">
                  <div className="mb-auto mt-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className={`h-8 w-8 ${category.iconColor} drop-shadow-lg`} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white font-bold text-sm leading-tight drop-shadow-md">
                    {category.name}
                  </h3>
                </div>

                <div className="absolute inset-0 border border-white/0 group-hover:border-white/30 rounded-xl transition-all duration-300"></div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]"></div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('services-catalog')}
            className={`inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/50'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <span>View All Services</span>
            <TrendingUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
