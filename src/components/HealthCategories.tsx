import { Heart, Sparkles, TrendingUp, Brain, Dumbbell, Flower2, User, Droplets, Apple, Moon, Leaf, Users, Activity, Zap, HeartHandshake, Eye, Smartphone, Fingerprint, Target, Blend } from 'lucide-react';
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
      gradient: 'from-red-950/95 via-black/90 to-black/95',
      iconColor: 'text-orange-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]',
      bgImage: 'https://images.pexels.com/photos/7108344/pexels-photo-7108344.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'everyday-wellness',
      name: 'Everyday Wellness',
      icon: Sparkles,
      gradient: 'from-amber-950/95 via-black/90 to-black/95',
      iconColor: 'text-green-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]',
      bgImage: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'longevity-aging',
      name: 'Longevity & Anti-Aging',
      icon: TrendingUp,
      gradient: 'from-blue-950/95 via-black/90 to-black/95',
      iconColor: 'text-pink-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]',
      bgImage: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'mental-wellness',
      name: 'Mental Wellness',
      icon: Brain,
      gradient: 'from-purple-950/95 via-black/90 to-black/95',
      iconColor: 'text-cyan-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]',
      bgImage: 'https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'fitness-performance',
      name: 'Fitness & Performance',
      icon: Dumbbell,
      gradient: 'from-slate-950/95 via-black/90 to-black/95',
      iconColor: 'text-yellow-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]',
      bgImage: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'womens-health',
      name: "Women's Health",
      icon: Flower2,
      gradient: 'from-pink-950/95 via-black/90 to-black/95',
      iconColor: 'text-pink-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]',
      bgImage: 'https://images.pexels.com/photos/3760259/pexels-photo-3760259.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'mens-health',
      name: "Men's Health",
      icon: User,
      gradient: 'from-orange-950/95 via-black/90 to-black/95',
      iconColor: 'text-blue-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]',
      bgImage: 'https://images.pexels.com/photos/1547248/pexels-photo-1547248.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'beauty-skincare',
      name: 'Beauty & Skincare',
      icon: Droplets,
      gradient: 'from-rose-950/95 via-black/90 to-black/95',
      iconColor: 'text-pink-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]',
      bgImage: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'nutrition-diet',
      name: 'Nutrition & Diet',
      icon: Apple,
      gradient: 'from-green-950/95 via-black/90 to-black/95',
      iconColor: 'text-green-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]',
      bgImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'sleep-recovery',
      name: 'Sleep & Recovery',
      icon: Moon,
      gradient: 'from-indigo-950/95 via-black/90 to-black/95',
      iconColor: 'text-purple-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]',
      bgImage: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'environmental-health',
      name: 'Environmental Health',
      icon: Leaf,
      gradient: 'from-teal-950/95 via-black/90 to-black/95',
      iconColor: 'text-teal-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(45,212,191,0.8)]',
      bgImage: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'family-health',
      name: 'Family Health',
      icon: Users,
      gradient: 'from-orange-950/95 via-black/90 to-black/95',
      iconColor: 'text-orange-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]',
      bgImage: 'https://images.pexels.com/photos/1648387/pexels-photo-1648387.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'preventive-medicine',
      name: 'Preventive Medicine & Longevity',
      icon: Activity,
      gradient: 'from-cyan-950/95 via-black/90 to-black/95',
      iconColor: 'text-cyan-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]',
      bgImage: 'https://images.pexels.com/photos/7108337/pexels-photo-7108337.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'biohacking',
      name: 'Biohacking & Performance',
      icon: Zap,
      gradient: 'from-violet-950/95 via-black/90 to-black/95',
      iconColor: 'text-blue-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]',
      bgImage: 'https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'senior-care',
      name: 'Senior Care',
      icon: HeartHandshake,
      gradient: 'from-slate-950/95 via-black/90 to-black/95',
      iconColor: 'text-slate-300',
      glowColor: 'drop-shadow-[0_0_15px_rgba(203,213,225,0.8)]',
      bgImage: 'https://images.pexels.com/photos/6032877/pexels-photo-6032877.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'eye-health',
      name: 'Eye-Health Suite',
      icon: Eye,
      gradient: 'from-blue-950/95 via-black/90 to-black/95',
      iconColor: 'text-blue-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]',
      bgImage: 'https://images.pexels.com/photos/1841645/pexels-photo-1841645.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'digital-therapeutics',
      name: 'Digital Therapeutics Store',
      icon: Smartphone,
      gradient: 'from-violet-950/95 via-black/90 to-black/95',
      iconColor: 'text-purple-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]',
      bgImage: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'general-sexual',
      name: 'General Sexual Longevity',
      icon: Fingerprint,
      gradient: 'from-red-950/95 via-black/90 to-black/95',
      iconColor: 'text-red-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(248,113,113,0.8)]',
      bgImage: 'https://images.pexels.com/photos/3259580/pexels-photo-3259580.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'mens-sexual-health',
      name: "Men's Sexual Health",
      icon: Target,
      gradient: 'from-blue-950/95 via-black/90 to-black/95',
      iconColor: 'text-blue-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]',
      bgImage: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'womens-sexual-health',
      name: "Women's Sexual Health",
      icon: Blend,
      gradient: 'from-pink-950/95 via-black/90 to-black/95',
      iconColor: 'text-pink-400',
      glowColor: 'drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]',
      bgImage: 'https://images.pexels.com/photos/3894378/pexels-photo-3894378.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Health Categories
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Explore 200+ AI-powered services across 20 comprehensive health categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onNavigate('services-catalog')}
                className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src={category.bgImage}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient}`}></div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                </div>

                <div className="relative h-full px-3 py-4 flex flex-col items-center justify-between text-center">
                  <div className={`transform group-hover:scale-110 transition-all duration-300 ${category.glowColor}`}>
                    <Icon className={`h-10 w-10 ${category.iconColor}`} strokeWidth={2} />
                  </div>
                  <h3 className="text-white font-bold text-xs leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {category.name}
                  </h3>
                </div>

                <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-lg transition-all duration-300"></div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
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
