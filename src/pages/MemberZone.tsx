import { useState } from 'react';
import { LogOut, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MemberSidebar from '../components/MemberSidebar';
import DashboardSection from './member/DashboardSection';
import PlaceholderSection from './member/PlaceholderSection';
import QuestionnairesSection from './member/QuestionnairesSection';
import ReportSettingsSection from './member/ReportSettingsSection';
import AIHealthAdvisorSection from './member/AIHealthAdvisorSection';
import DevicesSection from './member/DevicesSection';
import SupportSection from './member/SupportSection';
import PersonalInfoSection from './member/PersonalInfoSection';
import MedicalFilesSection from './member/MedicalFilesSection';
import BlackBoxSection from './member/BlackBoxSection';
import SecondOpinionSection from './member/SecondOpinionSection';
import BillingSection from './member/BillingSection';
import SystemSection from './member/SystemSection';
import ReferralSection from './member/ReferralSection';
import MyReportsSection from './member/MyReportsSection';
import CatalogSection from './member/CatalogSection';
import {
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
  Settings
} from 'lucide-react';

interface MemberZoneProps {
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

export default function MemberZone({ onNavigate, onSignOut }: MemberZoneProps) {
  const [currentSection, setCurrentSection] = useState('catalog');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
    onNavigate('home');
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardSection />;

      case 'ai-assistant':
        return <AIHealthAdvisorSection />;

      case 'devices':
        return <DevicesSection />;

      case 'support':
        return <SupportSection />;

      case 'system':
        return <SystemSection />;

      case 'catalog':
        return <CatalogSection onSectionChange={setCurrentSection} />;

      case 'questionnaires':
        return <QuestionnairesSection />;

      case 'reports':
        return <MyReportsSection />;

      case 'second-opinion':
        return <SecondOpinionSection />;

      case 'medical-files':
        return <MedicalFilesSection />;

      case 'black-box':
        return <BlackBoxSection />;

      case 'referral':
        return <ReferralSection />;

      case 'billing':
        return <BillingSection />;

      case 'profile':
        return <PersonalInfoSection />;

      case 'settings':
        return <ReportSettingsSection />;

      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors pt-16">
      <MemberSidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      <div className="ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-orange-600/50 text-gray-300 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-orange-600/50 text-gray-300 rounded-lg transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>

          {renderSection()}
        </div>
      </div>
    </div>
  );
}
