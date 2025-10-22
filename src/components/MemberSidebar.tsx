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
        { id: 'ai-assistant', label: 'AI Advisor', icon: Sparkles },
        { id: 'devices', label: 'Devices', icon: Watch },
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
        { id: 'questionnaires', label: 'Questionnaires', icon: ClipboardList },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'second-opinion', label: 'Second Opinion', icon: Scale },
      ]
    },
    {
      title: 'Data & Documents',
      items: [
        { id: 'medical-files', label: 'Medical Files', icon: FolderLock },
        { id: 'black-box', label: 'Black Box', icon: FolderLock },
      ]
    },
    {
      title: 'Account',
      items: [
        { id: 'referral', label: 'Referral', icon: Users },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800/50 transition-all duration-300 z-40 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto py-6 px-3">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  const isCatalog = item.id === 'catalog';

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-900/30 to-orange-800/20 border border-orange-600/30 text-orange-500'
                          : isCatalog
                          ? 'bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-600/30 text-green-400 hover:from-green-900/30 hover:to-green-800/20'
                          : 'text-gray-400 hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50'
                      }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-orange-500' : isCatalog ? 'text-green-400' : ''}`} />
                      {!isCollapsed && (
                        <span className={`text-sm font-medium ${isActive ? 'font-semibold' : isCatalog ? 'font-semibold' : ''}`}>
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

        <div className="border-t border-gray-800/50 p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-400 hover:bg-gray-800/50 hover:text-gray-300 rounded-lg transition-all duration-300"
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
