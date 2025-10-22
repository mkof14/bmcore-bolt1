import { useState, useEffect } from 'react';
import { Check, X, TrendingUp, Sparkles, Zap } from 'lucide-react';
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
  'sleep-recovery': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', icon: 'text-purple-400' },
  'environmental-health': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', icon: 'text-teal-400' },
  'family-health': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', icon: 'text-orange-400' },
  'preventive-medicine': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', icon: 'text-cyan-400' },
  'biohacking': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: 'text-blue-400' },
  'senior-care': { bg: 'bg-slate-500/10', text: 'text-slate-300', border: 'border-slate-500/30', icon: 'text-slate-300' },
  'eye-health': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: 'text-blue-400' },
  'digital-therapeutics': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', icon: 'text-purple-400' },
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
    if (plan === 'Max') return 'from-purple-500 to-purple-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Service Catalog</h2>
        <p className="text-gray-400">Choose your health categories and build your personalized plan</p>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Your Plan Calculator</h3>
            <p className="text-gray-400">Select categories to see your plan</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              ${(currentPrice / 100).toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-400">
              {selectedCount} of 20 categories selected
            </span>
            <span className={`text-sm font-bold ${currentPlan === 'Free' ? 'text-gray-500' : 'bg-gradient-to-r ' + getPlanColor(currentPlan) + ' bg-clip-text text-transparent'}`}>
              {currentPlan} Plan
            </span>
          </div>
          <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getPlanColor(currentPlan)} transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-bold">
              <span className={selectedCount > 0 ? 'text-white' : 'text-gray-600'}>Core</span>
              <span className={selectedCount > 3 ? 'text-white' : 'text-gray-600'}>Daily</span>
              <span className={selectedCount > 10 ? 'text-white' : 'text-gray-600'}>Max</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-xl border-2 transition-all ${selectedCount <= 3 && selectedCount > 0 ? 'border-orange-500 bg-orange-500/10' : 'border-gray-700 bg-gray-800/30'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className={selectedCount <= 3 && selectedCount > 0 ? 'text-orange-400' : 'text-gray-500'} />
              <h4 className={`font-bold ${selectedCount <= 3 && selectedCount > 0 ? 'text-orange-400' : 'text-gray-500'}`}>Core</h4>
            </div>
            <div className={`text-2xl font-bold mb-1 ${selectedCount <= 3 && selectedCount > 0 ? 'text-white' : 'text-gray-600'}`}>$19</div>
            <p className="text-xs text-gray-500">Any 3 categories</p>
          </div>

          <div className={`p-4 rounded-xl border-2 transition-all ${selectedCount > 3 && selectedCount <= 10 ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800/30'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className={selectedCount > 3 && selectedCount <= 10 ? 'text-blue-400' : 'text-gray-500'} />
              <h4 className={`font-bold ${selectedCount > 3 && selectedCount <= 10 ? 'text-blue-400' : 'text-gray-500'}`}>Daily</h4>
            </div>
            <div className={`text-2xl font-bold mb-1 ${selectedCount > 3 && selectedCount <= 10 ? 'text-white' : 'text-gray-600'}`}>$39</div>
            <p className="text-xs text-gray-500">4-10 categories</p>
          </div>

          <div className={`p-4 rounded-xl border-2 transition-all ${selectedCount > 10 ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-800/30'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Zap className={selectedCount > 10 ? 'text-purple-400' : 'text-gray-500'} />
              <h4 className={`font-bold ${selectedCount > 10 ? 'text-purple-400' : 'text-gray-500'}`}>Max</h4>
            </div>
            <div className={`text-2xl font-bold mb-1 ${selectedCount > 10 ? 'text-white' : 'text-gray-600'}`}>$79</div>
            <p className="text-xs text-gray-500">All 20 categories</p>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className={`p-4 rounded-xl bg-gradient-to-r ${getPlanColor(currentPlan)} bg-opacity-10 border border-current/30`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getPlanIcon(currentPlan)}
                <div>
                  <div className="font-bold text-white">{currentPlan} Plan Selected</div>
                  <div className="text-sm text-gray-300">{selectedCount} categories included</div>
                </div>
              </div>
              <button className={`px-6 py-3 bg-gradient-to-r ${getPlanColor(currentPlan)} text-white font-bold rounded-lg hover:opacity-90 transition-opacity`}>
                Upgrade to {currentPlan}
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Select Your Health Categories</h3>
        <p className="text-gray-400 mb-6">Choose any 3 categories to get started with the Core plan at $19/month</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {serviceCategories.map((category) => {
            const Icon = iconMap[category.icon] || Activity;
            const colors = categoryColors[category.id] || categoryColors['critical-health'];
            const isSelected = selectedCategories.has(category.id);

            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                  isSelected
                    ? `${colors.border} ${colors.bg} shadow-lg`
                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${isSelected ? colors.text : 'text-gray-300'}`}>
                      {category.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {category.services.length} services
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-3">Your Selected Categories</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedCategories).map((categoryId) => {
              const category = serviceCategories.find(c => c.id === categoryId);
              if (!category) return null;

              const Icon = iconMap[category.icon] || Activity;
              const colors = categoryColors[categoryId] || categoryColors['critical-health'];

              return (
                <div
                  key={categoryId}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${colors.bg} border ${colors.border}`}
                >
                  <Icon className={`h-4 w-4 ${colors.icon}`} />
                  <span className={`text-sm font-medium ${colors.text}`}>{category.name}</span>
                  <button
                    onClick={() => toggleCategory(categoryId)}
                    className="ml-1 hover:bg-white/10 rounded-full p-1"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
