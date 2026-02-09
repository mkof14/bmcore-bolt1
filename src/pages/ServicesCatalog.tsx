import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronRight, Heart, Brain, Users, Activity, Sparkles, Moon, Shield, Zap, Apple, Leaf, Eye, Tablet, Hourglass, ArrowLeft, TrendingUp, Dumbbell, Flower2, User, Droplets, HeartHandshake, Smartphone, Fingerprint, Target, Blend, X } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { serviceCategories } from '../data/services';
import BackButton from '../components/BackButton';
import SEO from '../components/SEO';

interface ServicesCatalogProps {
  onNavigate: (page: string, categoryId?: string) => void;
  initialCategory?: string;
}

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Heart,
  Brain,
  Users,
  Activity,
  Sparkles,
  Moon,
  Shield,
  Zap,
  Apple,
  Leaf,
  Eye,
  Tablet,
  Hourglass,
  TrendingUp,
  Dumbbell,
  Flower2,
  User,
  Droplets,
  HeartHandshake,
  Smartphone,
  Fingerprint,
  Target,
  Blend
};

const categoryHeroData: Record<string, { bgImage: string; iconColor: string; textColor: string }> = {
  'critical-health': {
    bgImage: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-orange-400',
    textColor: 'text-orange-400'
  },
  'everyday-wellness': {
    bgImage: 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-green-400',
    textColor: 'text-green-400'
  },
  'longevity': {
    bgImage: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-pink-400',
    textColor: 'text-pink-400'
  },
  'mental-wellness': {
    bgImage: 'https://images.pexels.com/photos/7592370/pexels-photo-7592370.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-cyan-400',
    textColor: 'text-cyan-400'
  },
  'fitness-performance': {
    bgImage: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-yellow-400',
    textColor: 'text-yellow-400'
  },
  'womens-health': {
    bgImage: 'https://images.pexels.com/photos/3737169/pexels-photo-3737169.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-pink-400',
    textColor: 'text-pink-400'
  },
  'mens-health': {
    bgImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-400'
  },
  'beauty-skincare': {
    bgImage: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-pink-400',
    textColor: 'text-pink-400'
  },
  'nutrition-diet': {
    bgImage: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-green-400',
    textColor: 'text-green-400'
  },
  'sleep-recovery': {
    bgImage: 'https://images.pexels.com/photos/6942086/pexels-photo-6942086.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-purple-400',
    textColor: 'text-purple-400'
  },
  'environmental-health': {
    bgImage: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-teal-400',
    textColor: 'text-teal-400'
  },
  'family-health': {
    bgImage: 'https://images.pexels.com/photos/4259140/pexels-photo-4259140.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-orange-400',
    textColor: 'text-orange-400'
  },
  'preventive-medicine': {
    bgImage: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-cyan-400',
    textColor: 'text-cyan-400'
  },
  'biohacking': {
    bgImage: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-400'
  },
  'senior-care': {
    bgImage: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-slate-300',
    textColor: 'text-slate-300'
  },
  'eye-health': {
    bgImage: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-400'
  },
  'digital-therapeutics': {
    bgImage: 'https://images.pexels.com/photos/5632379/pexels-photo-5632379.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-purple-400',
    textColor: 'text-purple-400'
  },
  'general-sexual': {
    bgImage: 'https://images.pexels.com/photos/3259580/pexels-photo-3259580.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-red-400',
    textColor: 'text-red-400'
  },
  'mens-sexual-health': {
    bgImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-400'
  },
  'womens-sexual-health': {
    bgImage: 'https://images.pexels.com/photos/3894378/pexels-photo-3894378.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-pink-400',
    textColor: 'text-pink-400'
  }
};

export default function ServicesCatalog({ onNavigate, initialCategory }: ServicesCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return serviceCategories;
    return serviceCategories.filter((category) => (
      category.name.toLowerCase().includes(normalizedQuery) ||
      category.description.toLowerCase().includes(normalizedQuery) ||
      category.services.some(service =>
        service.name.toLowerCase().includes(normalizedQuery) ||
        service.description.toLowerCase().includes(normalizedQuery)
      )
    ));
  }, [normalizedQuery]);

  const selectedCategoryData = selectedCategory
    ? serviceCategories.find(c => c.id === selectedCategory)
    : null;

  const heroData = selectedCategoryData ? categoryHeroData[selectedCategoryData.id] : null;
  const IconComponent = selectedCategoryData ? iconMap[selectedCategoryData.icon] : null;
  const filteredServices = useMemo(() => {
    if (!selectedCategoryData) return [];
    if (!normalizedQuery) return selectedCategoryData.services;
    return selectedCategoryData.services.filter(service => (
      service.name.toLowerCase().includes(normalizedQuery) ||
      service.description.toLowerCase().includes(normalizedQuery)
    ));
  }, [selectedCategoryData, normalizedQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <SEO
        title="Services Catalog - 200+ Health Analytics Services"
        description="Explore BioMath Core’s full catalog of health analytics services across 20 categories. Find the right wellness insights for your goals."
        keywords={['health services catalog', 'biomath core services', 'wellness categories', 'AI health insights', 'biomathematics services']}
        url="/services-catalog"
      />
      {selectedCategoryData && heroData && IconComponent ? (
        <section className="relative h-80 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroData.bgImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

          <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className="absolute top-6 left-6 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Categories</span>
            </button>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gray-900/50 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center ${heroData.iconColor} drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]`}>
                  <IconComponent className="h-12 w-12" strokeWidth={2} />
                </div>
              </div>

              <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${heroData.textColor} drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]`}>
                {selectedCategoryData.name}
              </h1>

              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {selectedCategoryData.description}
              </p>

              <div className={`inline-block px-6 py-3 rounded-full bg-gray-900/50 backdrop-blur-sm border border-white/20 ${heroData.textColor} font-semibold text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`}>
                {selectedCategoryData.services.length} services available
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top,_#fff6ed,_transparent_55%),linear-gradient(135deg,#f8fafc,white)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%),linear-gradient(135deg,#0f172a,#020617)] relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-20 left-10 w-56 h-56 rounded-full bg-orange-400/20 blur-3xl"></div>
            <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <BackButton onNavigate={onNavigate} />

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200/80 bg-white/70 text-[11px] font-semibold uppercase tracking-[0.32em] text-orange-700 backdrop-blur dark:bg-white/10 dark:text-orange-200 dark:border-orange-300/20 mb-5">
                All Services
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-4">
                <div className="text-center lg:text-left">
                  <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
                    Complete Services Catalog
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                    Explore 200+ biomathematical health services across 20 specialized categories.
                  </p>
                </div>
                <img
                  src="/Copilot_20251022_202220.png"
                  alt="BioMath Services"
                  className="w-40 h-40 object-contain"
                />
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories or services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                      aria-label="Clear search"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedCategoryData && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                    aria-label="Clear search"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          {!selectedCategoryData ? (
            <div>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-500 dark:text-gray-400">No categories found matching your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category) => {
                    const IconComponent = iconMap[category.icon] || Activity;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900/50 backdrop-blur hover:shadow-2xl hover:shadow-orange-500/20 transition-all text-left"
                      >
                        <div className="flex items-start space-x-4 mb-4">
                          <div className={`flex-shrink-0 w-14 h-14 bg-gray-100 dark:bg-gray-800/50 rounded-xl flex items-center justify-center`}>
                            <IconComponent className={`h-7 w-7 ${categoryHeroData[category.id]?.iconColor || 'text-orange-400'}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold ${categoryHeroData[category.id]?.textColor || 'text-orange-400'} mb-1`}>
                              {category.name}
                            </h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {category.services.length} Services
                            </p>
                          </div>
                          <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-orange-500 flex-shrink-0 transition-colors" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {filteredServices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-500 dark:text-gray-400">No services found matching your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => onNavigate('service-detail', `${selectedCategoryData.id}/${service.id}`)}
                      className="group p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900/50 backdrop-blur hover:shadow-2xl hover:shadow-orange-500/20 transition-all text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-orange-400 transition-colors pr-2">
                          {service.name}
                        </h3>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 flex-shrink-0 transition-colors" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          Multi-Model Mode
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Choose a plan that matches your needs and get instant access to our comprehensive health analytics platform.
          </p>
          <button
            onClick={() => onNavigate('pricing')}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg shadow-2xl shadow-orange-500/50 transition-all transform hover:scale-105"
          >
            View Pricing Plans
            <ChevronRight className="h-6 w-6" />
          </button>
          <p className="mt-6 text-sm text-gray-400">
            All plans include a 5-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
