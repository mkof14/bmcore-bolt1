import { useState, useEffect } from 'react';
import { Search, ChevronRight, Heart, Brain, Users, Activity, Sparkles, Moon, Shield, Zap, Apple, Leaf, Eye, Tablet, Hourglass, ArrowLeft } from 'lucide-react';
import { serviceCategories } from '../data/services';
import BackButton from '../components/BackButton';

interface ServicesCatalogProps {
  onNavigate: (page: string, categoryId?: string) => void;
  initialCategory?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
  Hourglass
};

export default function ServicesCatalog({ onNavigate, initialCategory }: ServicesCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredCategories = serviceCategories.filter(category => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query) ||
      category.services.some(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      )
    );
  });

  const selectedCategoryData = selectedCategory
    ? serviceCategories.find(c => c.id === selectedCategory)
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="max-w-7xl mx-auto">
          <BackButton onNavigate={onNavigate} />

          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedCategoryData ? selectedCategoryData.name : 'Complete Services Catalog'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              {selectedCategoryData
                ? selectedCategoryData.description
                : 'Explore our comprehensive suite of 200+ biomathematical health services across 20 specialized categories'
              }
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={selectedCategoryData ? "Search services..." : "Search categories or services..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {selectedCategoryData && (
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Back to All Categories</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!selectedCategoryData ? (
            <div>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 dark:text-gray-400">No categories found matching your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category) => {
                    const IconComponent = iconMap[category.icon] || Activity;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className="group p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all text-left bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="flex-shrink-0 w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <IconComponent className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                              {category.name}
                            </h3>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {category.services.length} Services
                            </p>
                          </div>
                          <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0 transition-colors" />
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
              {selectedCategoryData.services.filter(service => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  service.name.toLowerCase().includes(query) ||
                  service.description.toLowerCase().includes(query)
                );
              }).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 dark:text-gray-400">No services found matching your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCategoryData.services
                    .filter(service => {
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return (
                        service.name.toLowerCase().includes(query) ||
                        service.description.toLowerCase().includes(query)
                      );
                    })
                    .map((service) => (
                      <button
                        key={service.id}
                        onClick={() => onNavigate('service-detail', `${selectedCategoryData.id}/${service.id}`)}
                        className="group p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all text-left bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-2">
                            {service.name}
                          </h3>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0 transition-colors" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
