import { Heart, Leaf, TrendingUp, Brain, Dumbbell, Users, Moon, Home, Eye, Smartphone, HeartPulse, User, Zap, Apple, Flower2, Activity } from 'lucide-react';
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
      icon: Heart,
      gradient: 'from-red-900 to-orange-900',
      iconColor: 'text-orange-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'everyday-wellness',
      name: 'Everyday Wellness',
      icon: Leaf,
      gradient: 'from-orange-900 to-yellow-900',
      iconColor: 'text-green-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'longevity-aging',
      name: 'Longevity & Anti-Aging',
      icon: TrendingUp,
      gradient: 'from-blue-900 to-purple-900',
      iconColor: 'text-pink-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'mental-wellness',
      name: 'Mental Wellness',
      icon: Brain,
      gradient: 'from-purple-900 to-pink-900',
      iconColor: 'text-cyan-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'fitness-performance',
      name: 'Fitness & Performance',
      icon: Dumbbell,
      gradient: 'from-gray-900 to-slate-900',
      iconColor: 'text-yellow-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'womens-health',
      name: "Women's Health",
      icon: Flower2,
      gradient: 'from-pink-900 to-rose-900',
      iconColor: 'text-pink-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'mens-health',
      name: "Men's Health",
      icon: User,
      gradient: 'from-amber-900 to-orange-900',
      iconColor: 'text-blue-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'beauty-skincare',
      name: 'Beauty & Skincare',
      icon: Flower2,
      gradient: 'from-rose-900 to-pink-900',
      iconColor: 'text-pink-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'nutrition-diet',
      name: 'Nutrition & Diet',
      icon: Apple,
      gradient: 'from-green-900 to-emerald-900',
      iconColor: 'text-green-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'sleep-recovery',
      name: 'Sleep & Recovery',
      icon: Moon,
      gradient: 'from-indigo-900 to-blue-900',
      iconColor: 'text-purple-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'environmental-health',
      name: 'Environmental Health',
      icon: Home,
      gradient: 'from-teal-900 to-green-900',
      iconColor: 'text-teal-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'family-health',
      name: 'Family Health',
      icon: Users,
      gradient: 'from-orange-900 to-amber-900',
      iconColor: 'text-orange-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'preventive-medicine',
      name: 'Preventive Medicine & Longevity',
      icon: HeartPulse,
      gradient: 'from-cyan-900 to-blue-900',
      iconColor: 'text-cyan-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'biohacking',
      name: 'Biohacking & Performance',
      icon: Zap,
      gradient: 'from-purple-900 to-violet-900',
      iconColor: 'text-blue-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'senior-care',
      name: 'Senior Care',
      icon: Activity,
      gradient: 'from-slate-900 to-gray-900',
      iconColor: 'text-gray-300',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'eye-health',
      name: 'Eye-Health Suite',
      icon: Eye,
      gradient: 'from-blue-900 to-cyan-900',
      iconColor: 'text-blue-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'digital-therapeutics',
      name: 'Digital Therapeutics Store',
      icon: Smartphone,
      gradient: 'from-violet-900 to-purple-900',
      iconColor: 'text-purple-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'general-sexual',
      name: 'General Sexual Longevity',
      icon: Heart,
      gradient: 'from-red-900 to-rose-900',
      iconColor: 'text-red-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'mens-sexual-health',
      name: "Men's Sexual Health",
      icon: User,
      gradient: 'from-blue-900 to-indigo-900',
      iconColor: 'text-blue-400',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      id: 'womens-sexual-health',
      name: "Women's Sexual Health",
      icon: Flower2,
      gradient: 'from-pink-900 to-fuchsia-900',
      iconColor: 'text-pink-400',
      bgPattern: 'bg-gradient-to-br',
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onNavigate('services-catalog')}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  isDark ? 'shadow-lg' : 'shadow-md'
                }`}
              >
                <div className={`absolute inset-0 ${category.bgPattern} ${category.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>

                <div className="relative p-8 h-48 flex flex-col items-center justify-center text-center">
                  <div className={`mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon className={`h-12 w-12 ${category.iconColor}`} />
                  </div>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {category.name}
                  </h3>
                </div>

                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-all duration-300"></div>
              </button>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => onNavigate('services-catalog')}
            className={`inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
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
