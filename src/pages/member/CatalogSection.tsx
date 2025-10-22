import { useState, useEffect } from 'react';
import { Check, X, TrendingUp, Sparkles, Zap, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { Heart, Brain, Users, Activity, Moon, Shield, Apple, Leaf, Eye, Tablet, Hourglass, Dumbbell, Flower2, User, Droplets, HeartHandshake, Smartphone, Fingerprint, Target, Blend } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { serviceCategories } from '../../data/services';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Brain, Users, Activity, Sparkles, Moon, Shield, Zap, Apple, Leaf,
  Eye, Tablet, Hourglass, TrendingUp, Dumbbell, Flower2, User, Droplets,
  HeartHandshake, Smartphone, Fingerprint, Target, Blend
};

const categoryColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  'critical-health': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', icon: 'text-orange-400' },
  'everyday-wellness': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', icon: 'text-green-400' },
  'longevity': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', icon: 'text-pink-400' },
  'mental-wellness': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', icon: 'text-cyan-400' },
  'fitness-performance': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: 'text-yellow-400' },
  'womens-health': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', icon: 'text-pink-400' },
  'mens-health': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: 'text-blue-400' },
  'beauty-skincare': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', icon: 'text-pink-400' },
  'nutrition-diet': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', icon: 'text-green-400' },
  'sleep-recovery': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', icon: 'text-indigo-400' },
  'environmental-health': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', icon: 'text-teal-400' },
  'family-health': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', icon: 'text-orange-400' },
  'preventive-medicine': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', icon: 'text-cyan-400' },
  'biohacking': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: 'text-blue-400' },
  'senior-care': { bg: 'bg-slate-500/10', text: 'text-slate-300', border: 'border-slate-500/30', icon: 'text-slate-300' },
  'eye-health': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: 'text-blue-400' },
  'digital-therapeutics': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', icon: 'text-indigo-400' },
  'general-sexual': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: 'text-red-400' },
  'mens-sexual-health': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: 'text-blue-400' },
  'womens-sexual-health': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', icon: 'text-pink-400' },
};

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  tier_level: number;
  monthly_price_cents: number;
  value_message: string;
}

export default function CatalogSection() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<any>(null);

  useEffect(() => {
    loadPlansAndSubscription();
  }, []);

  const loadPlansAndSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: plansData } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('tier_level');

      if (plansData) {
        setPlans(plansData);
      }

      if (user) {
        const { data: subData } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        setUserSubscription(subData);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const selectedCount = selectedCategories.size;
  const corePrice = 1900;
  const dailyPrice = 3900;
  const maxPrice = 7900;

  let currentPlan = 'Free';
  let currentPrice = 0;
  let progress = 0;

  if (selectedCount === 0) {
    currentPlan = 'Free';
    currentPrice = 0;
    progress = 0;
  } else if (selectedCount <= 3) {
    currentPlan = 'Core';
    currentPrice = corePrice;
    progress = (selectedCount / 3) * 33;
  } else if (selectedCount <= 10) {
    currentPlan = 'Daily';
    currentPrice = dailyPrice;
    progress = 33 + ((selectedCount - 3) / 7) * 33;
  } else {
    currentPlan = 'Max';
    currentPrice = maxPrice;
    progress = 66 + ((selectedCount - 10) / 10) * 34;
  }

  progress = Math.min(100, progress);

  const getPlanIcon = (plan: string) => {
    if (plan === 'Core') return <Sparkles className="h-6 w-6" />;
    if (plan === 'Daily') return <TrendingUp className="h-6 w-6" />;
    if (plan === 'Max') return <Zap className="h-6 w-6" />;
    return null;
  };

  const getPlanColor = (plan: string) => {
    if (plan === 'Core') return 'from-orange-500 to-orange-600';
    if (plan === 'Daily') return 'from-blue-500 to-blue-600';
    if (plan === 'Max') return 'from-slate-700 to-slate-800';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-8">
      <section className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">
          Build Your Health Plan
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-2">
          Choose from 20 comprehensive health categories and 200+ AI-powered services
        </p>
        <p className="text-gray-400">
          Start with any 3 categories for just $19/month
        </p>
      </section>

      <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Your Plan Calculator</h2>
              <p className="text-gray-400">Watch your plan evolve as you select categories</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                ${(currentPrice / 100).toFixed(0)}
              </div>
              <div className="text-sm text-gray-500">per month</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">
                {selectedCount} of 20 categories selected
              </span>
              <span className={`text-sm font-bold ${currentPlan === 'Free' ? 'text-gray-500' : 'bg-gradient-to-r ' + getPlanColor(currentPlan) + ' bg-clip-text text-transparent'}`}>
                {currentPlan} Plan
              </span>
            </div>
            <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getPlanColor(currentPlan)} transition-all duration-500 ease-out shadow-lg`}
                style={{ width: `${progress}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-bold">
                <span className={selectedCount > 0 ? 'text-white drop-shadow-lg' : 'text-gray-600'}>Core</span>
                <span className={selectedCount > 3 ? 'text-white drop-shadow-lg' : 'text-gray-600'}>Daily</span>
                <span className={selectedCount > 10 ? 'text-white drop-shadow-lg' : 'text-gray-600'}>Max</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`group/card relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-2 rounded-xl p-6 transition-all duration-300 overflow-hidden ${selectedCount <= 3 && selectedCount > 0 ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-gray-700/40 hover:border-orange-600/40'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gray-900 border border-orange-600/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover/card:border-orange-500/50 group-hover/card:shadow-lg group-hover/card:shadow-orange-600/20 transition-all">
                  <Sparkles className={`h-8 w-8 ${selectedCount <= 3 && selectedCount > 0 ? 'text-orange-400' : 'text-orange-500'}`} />
                </div>
                <h3 className={`text-center font-bold text-2xl mb-2 ${selectedCount <= 3 && selectedCount > 0 ? 'text-orange-400' : 'text-white'}`}>Core</h3>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${selectedCount <= 3 && selectedCount > 0 ? 'text-white' : 'text-gray-400'}`}>$19</div>
                  <p className="text-sm text-gray-500 mb-4">per month</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span>Any 3 categories</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span>Basic AI insights</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`group/card relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-2 rounded-xl p-6 transition-all duration-300 overflow-hidden ${selectedCount > 3 && selectedCount <= 10 ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-700/40 hover:border-blue-600/40'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/0 to-blue-900/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gray-900 border border-blue-600/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover/card:border-blue-500/50 group-hover/card:shadow-lg group-hover/card:shadow-blue-600/20 transition-all">
                  <TrendingUp className={`h-8 w-8 ${selectedCount > 3 && selectedCount <= 10 ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <h3 className={`text-center font-bold text-2xl mb-2 ${selectedCount > 3 && selectedCount <= 10 ? 'text-blue-400' : 'text-white'}`}>Daily</h3>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${selectedCount > 3 && selectedCount <= 10 ? 'text-white' : 'text-gray-400'}`}>$39</div>
                  <p className="text-sm text-gray-500 mb-4">per month</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>4-10 categories</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Advanced analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`group/card relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-2 rounded-xl p-6 transition-all duration-300 overflow-hidden ${selectedCount > 10 ? 'border-slate-600 shadow-lg shadow-slate-500/20' : 'border-gray-700/40 hover:border-slate-600/40'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/0 to-slate-900/10 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gray-900 border border-slate-600/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover/card:border-slate-500/50 group-hover/card:shadow-lg group-hover/card:shadow-slate-600/20 transition-all">
                  <Zap className={`h-8 w-8 ${selectedCount > 10 ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
                <h3 className={`text-center font-bold text-2xl mb-2 ${selectedCount > 10 ? 'text-slate-300' : 'text-white'}`}>Max</h3>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${selectedCount > 10 ? 'text-white' : 'text-gray-400'}`}>$79</div>
                  <p className="text-sm text-gray-500 mb-4">per month</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      <span>All 20 categories</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      <span>Premium AI features</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedCount > 0 && (
            <div className={`relative p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
              currentPlan === 'Core' ? 'border-orange-500 bg-orange-500/10' :
              currentPlan === 'Daily' ? 'border-blue-500 bg-blue-500/10' :
              'border-slate-600 bg-slate-500/10'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getPlanIcon(currentPlan)}
                  <div>
                    <div className="font-bold text-xl text-white">{currentPlan} Plan Selected</div>
                    <div className="text-sm text-gray-300">{selectedCount} categories • ${(currentPrice / 100).toFixed(0)}/month</div>
                  </div>
                </div>
                <button className={`flex items-center space-x-2 px-8 py-4 bg-gradient-to-r ${getPlanColor(currentPlan)} text-white font-bold rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg`}>
                  <span>Upgrade Now</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">Select Your Health Categories</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Click on categories to add them to your plan. Each category includes multiple AI-powered services.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {serviceCategories.map((category) => {
            const Icon = iconMap[category.icon] || Activity;
            const colors = categoryColors[category.id] || categoryColors['critical-health'];
            const isSelected = selectedCategories.has(category.id);

            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`group/item relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-2 rounded-xl p-5 transition-all duration-300 hover:scale-105 overflow-hidden ${
                  isSelected
                    ? `${colors.border} shadow-lg`
                    : 'border-gray-700/40 hover:border-gray-600/60'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>

                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                <div className="relative flex flex-col items-center text-center space-y-3">
                  <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center group-hover/item:shadow-lg transition-all`}>
                    <Icon className={`h-7 w-7 ${colors.icon}`} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm mb-1 ${isSelected ? colors.text : 'text-gray-300'}`}>
                      {category.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {category.services.length} services
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {selectedCount > 0 && (
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Your Selected Categories</h3>
              <p className="text-gray-400">Review your selections before upgrading</p>
            </div>
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
              <span className="text-green-400 font-bold">{selectedCount} selected</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {Array.from(selectedCategories).map((categoryId) => {
              const category = serviceCategories.find(c => c.id === categoryId);
              if (!category) return null;

              const Icon = iconMap[category.icon] || Activity;
              const colors = categoryColors[categoryId] || categoryColors['critical-health'];

              return (
                <div
                  key={categoryId}
                  className={`group flex items-center space-x-3 pl-4 pr-3 py-3 rounded-full ${colors.bg} border ${colors.border} hover:shadow-lg transition-all`}
                >
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                  <span className={`text-sm font-semibold ${colors.text}`}>{category.name}</span>
                  <button
                    onClick={() => toggleCategory(categoryId)}
                    className="ml-2 p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400 group-hover:text-gray-300" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Next Steps</h3>
            <p className="text-gray-400 leading-relaxed">
              After selecting your categories and upgrading your plan, you'll be guided to complete health questionnaires. These help our AI provide personalized insights tailored to your specific health goals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
