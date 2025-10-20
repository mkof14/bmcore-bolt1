import {
  LayoutDashboard,
  Sparkles,
  Watch,
  HeadphonesIcon,
  Settings2,
  BookOpen,
  ClipboardList,
  FileText,
  Scale,
  FolderLock,
  Users,
  CreditCard,
  User,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface MemberSidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function MemberSidebar({ currentSection, onSectionChange }: MemberSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuSections = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'ai-assistant', label: 'AI Health Advisor', icon: Sparkles },
        { id: 'devices', label: 'Connect Devices', icon: Watch },
      ]
    },
    {
      title: 'Support & Services',
      items: [
        { id: 'support', label: 'Support', icon: HeadphonesIcon },
        { id: 'system', label: 'System', icon: Settings2 },
        { id: 'catalog', label: 'Catalog', icon: BookOpen },
      ]
    },
    {
      title: 'Health & Analysis',
      items: [
        { id: 'questionnaires', label: 'Health Questionnaires', icon: ClipboardList },
        { id: 'reports', label: 'Reports & AI Analysis', icon: FileText },
        { id: 'second-opinion', label: 'AI Health Second Opinion', icon: Scale },
      ]
    },
    {
      title: 'Data & Documents',
      items: [
        { id: 'medical-files', label: 'Medical Files & Documents', icon: FolderLock },
        { id: 'black-box', label: 'Black Box (Storage)', icon: FolderLock },
      ]
    },
    {
      title: 'Account',
      items: [
        { id: 'referral', label: 'Referral Program', icon: Users },
        { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto py-6 px-3">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                      {!isCollapsed && (
                        <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
