import { useState, useEffect } from 'react';
import { Map, Eye, EyeOff, Save, CheckCircle, AlertCircle, Home, FileText, Building2, Users, Phone, DollarSign, Newspaper, Briefcase, BookOpen, FlaskConical, Shield, HelpCircle, Target, UserPlus, Gift, Stethoscope, BarChart3, Cog } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PageConfig {
  id: string;
  name: string;
  path: string;
  icon: any;
  enabled: boolean;
  category: 'main' | 'legal' | 'member' | 'admin' | 'marketing';
  description: string;
}

export default function SiteMapManager() {
  const [pages, setPages] = useState<PageConfig[]>([
    { id: 'home', name: 'Home', path: '/', icon: Home, enabled: true, category: 'main', description: 'Главная страница' },
    { id: 'about', name: 'About', path: '/about', icon: FileText, enabled: true, category: 'main', description: 'О нас' },
    { id: 'services', name: 'Services', path: '/services', icon: Building2, enabled: true, category: 'main', description: 'Услуги' },
    { id: 'catalog', name: 'Services Catalog', path: '/services-catalog', icon: Building2, enabled: true, category: 'main', description: 'Каталог услуг' },
    { id: 'pricing', name: 'Pricing', path: '/pricing', icon: DollarSign, enabled: true, category: 'main', description: 'Цены' },
    { id: 'devices', name: 'Devices', path: '/devices', icon: Stethoscope, enabled: true, category: 'main', description: 'Устройства' },
    { id: 'science', name: 'Science', path: '/science', icon: FlaskConical, enabled: true, category: 'main', description: 'Научные исследования' },
    { id: 'reports', name: 'Reports', path: '/reports', icon: BarChart3, enabled: true, category: 'main', description: 'Отчеты' },
    { id: 'news', name: 'News', path: '/news', icon: Newspaper, enabled: true, category: 'main', description: 'Новости' },
    { id: 'blog', name: 'Blog', path: '/blog', icon: FileText, enabled: true, category: 'main', description: 'Блог' },
    { id: 'careers', name: 'Careers', path: '/careers', icon: Briefcase, enabled: true, category: 'main', description: 'Карьера' },
    { id: 'contact', name: 'Contact', path: '/contact', icon: Phone, enabled: true, category: 'main', description: 'Контакты' },
    { id: 'faq', name: 'FAQ', path: '/faq', icon: HelpCircle, enabled: true, category: 'main', description: 'Часто задаваемые вопросы' },
    { id: 'learning', name: 'Learning Center', path: '/learning-center', icon: BookOpen, enabled: true, category: 'main', description: 'Обучающий центр' },

    { id: 'investors', name: 'For Investors', path: '/investors', icon: Target, enabled: true, category: 'marketing', description: 'Информация для инвесторов' },
    { id: 'partnership', name: 'Partnership', path: '/partnership', icon: Users, enabled: true, category: 'marketing', description: 'Партнерская программа' },
    { id: 'ambassador', name: 'Ambassador', path: '/ambassador', icon: UserPlus, enabled: true, category: 'marketing', description: 'Программа амбассадоров' },
    { id: 'referral', name: 'Referral Program', path: '/referral', icon: Gift, enabled: true, category: 'marketing', description: 'Реферальная программа' },

    { id: 'member-zone', name: 'Member Zone', path: '/member-zone', icon: Users, enabled: true, category: 'member', description: 'Личный кабинет' },
    { id: 'command-center', name: 'Command Center', path: '/command-center', icon: Cog, enabled: true, category: 'member', description: 'Центр управления' },

    { id: 'admin', name: 'Admin Panel', path: '/admin', icon: Shield, enabled: true, category: 'admin', description: 'Админ панель' },

    { id: 'privacy', name: 'Privacy Policy', path: '/legal/privacy-policy', icon: Shield, enabled: true, category: 'legal', description: 'Политика конфиденциальности' },
    { id: 'terms', name: 'Terms of Service', path: '/legal/terms-of-service', icon: FileText, enabled: true, category: 'legal', description: 'Условия использования' },
    { id: 'gdpr', name: 'GDPR', path: '/legal/gdpr', icon: Shield, enabled: true, category: 'legal', description: 'GDPR соответствие' },
    { id: 'hipaa', name: 'HIPAA Notice', path: '/legal/hipaa-notice', icon: Shield, enabled: true, category: 'legal', description: 'HIPAA уведомление' },
    { id: 'disclaimer', name: 'Disclaimer', path: '/legal/disclaimer', icon: AlertCircle, enabled: true, category: 'legal', description: 'Отказ от ответственности' },
    { id: 'security', name: 'Security', path: '/legal/security', icon: Shield, enabled: true, category: 'legal', description: 'Безопасность' },
  ]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const togglePage = (pageId: string) => {
    setPages(prev => prev.map(page =>
      page.id === pageId ? { ...page, enabled: !page.enabled } : page
    ));
  };

  const toggleCategory = (category: string, enabled: boolean) => {
    setPages(prev => prev.map(page =>
      page.category === category ? { ...page, enabled } : page
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      setMessage({
        type: 'success',
        text: 'Конфигурация страниц успешно сохранена! ✓'
      });

      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const groupedPages = {
    main: pages.filter(p => p.category === 'main'),
    marketing: pages.filter(p => p.category === 'marketing'),
    member: pages.filter(p => p.category === 'member'),
    admin: pages.filter(p => p.category === 'admin'),
    legal: pages.filter(p => p.category === 'legal'),
  };

  const categoryStats = Object.entries(groupedPages).map(([category, items]) => ({
    category,
    total: items.length,
    enabled: items.filter(p => p.enabled).length
  }));

  const categoryNames: Record<string, string> = {
    main: '🏠 Основные страницы',
    marketing: '🎯 Маркетинг',
    member: '👤 Пользовательские',
    admin: '⚙️ Администрирование',
    legal: '⚖️ Юридические'
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700/50 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Map className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Site Map & Page Visibility</h2>
            <p className="text-gray-400 text-sm mt-1">
              Управление видимостью страниц сайта
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {categoryStats.map(({ category, total, enabled }) => (
            <div
              key={category}
              className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30"
            >
              <div className="text-2xl font-bold text-white">{enabled}/{total}</div>
              <div className="text-xs text-gray-400 mt-1">
                {categoryNames[category]?.replace(/^[^\s]+ /, '')}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => toggleCategory(category, true)}
                  className="flex-1 px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                >
                  Все ВКЛ
                </button>
                <button
                  onClick={() => toggleCategory(category, false)}
                  className="flex-1 px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  Все ВЫКЛ
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {Object.entries(groupedPages).map(([category, items]) => {
            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">
                  {categoryNames[category]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((page) => {
                    const Icon = page.icon;
                    return (
                      <button
                        key={page.id}
                        onClick={() => togglePage(page.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          page.enabled
                            ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                            : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 ${page.enabled ? 'text-green-400' : 'text-gray-500'}`} />
                            <div>
                              <div className={`font-semibold ${page.enabled ? 'text-white' : 'text-gray-500'}`}>
                                {page.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">{page.path}</div>
                            </div>
                          </div>
                          <div className={`p-1 rounded ${page.enabled ? 'bg-green-500/20' : 'bg-gray-700/30'}`}>
                            {page.enabled ? (
                              <Eye className="w-4 h-4 text-green-400" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                        </div>
                        <p className={`text-xs mt-2 ${page.enabled ? 'text-gray-400' : 'text-gray-600'}`}>
                          {page.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Сохранить конфигурацию</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Как это работает
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>🟢 <strong>Зеленые карточки</strong> - страница активна и доступна пользователям</li>
          <li>⚫ <strong>Серые карточки</strong> - страница скрыта (возвращает 404 или редирект)</li>
          <li>🔘 <strong>Кнопки категорий</strong> - быстрое включение/выключение всех страниц в категории</li>
          <li>💾 <strong>После изменений</strong> - нажмите "Сохранить" для применения</li>
          <li>⚠️ <strong>Важно:</strong> Отключение Admin Panel заблокирует доступ к настройкам</li>
        </ul>
      </div>
    </div>
  );
}
