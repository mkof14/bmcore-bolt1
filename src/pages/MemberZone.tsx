import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MemberSidebar from '../components/MemberSidebar';
import DashboardSection from './member/DashboardSection';
import PlaceholderSection from './member/PlaceholderSection';
import QuestionnairesSection from './member/QuestionnairesSection';
import ReportSettingsSection from './member/ReportSettingsSection';
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
  const [currentSection, setCurrentSection] = useState('dashboard');
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
        return (
          <PlaceholderSection
            title="AI Health Advisor"
            description="Your personal AI health advisor with multi-persona support and dual opinion capability"
            icon={Sparkles}
            features={[
              'Chat with AI Health Advisor in real-time',
              'Switch between Doctor, Nurse, and Coach personas',
              'Get dual expert opinions on health questions',
              'Voice input and text-to-speech responses',
              'Generate reports directly from chat',
              'Set goals based on AI recommendations'
            ]}
          />
        );

      case 'devices':
        return (
          <PlaceholderSection
            title="Connect Devices"
            description="Connect your wearables and health sensors for automatic data sync"
            icon={Watch}
            features={[
              'Support for 10+ popular devices (Apple Watch, Oura, Fitbit, etc.)',
              'Simple 3-step connection process',
              'Automatic daily sync or real-time for CGM',
              'Manage connected devices and sync frequency',
              'View device data history',
              'Privacy-first token storage'
            ]}
          />
        );

      case 'support':
        return (
          <PlaceholderSection
            title="Support"
            description="Get help from our support team"
            icon={HeadphonesIcon}
            comingSoon
            features={[
              '24/7 customer support chat',
              'Knowledge base and FAQs',
              'Video tutorials',
              'Submit support tickets',
              'Priority support for Pro users'
            ]}
          />
        );

      case 'system':
        return (
          <PlaceholderSection
            title="System"
            description="System settings and integrations"
            icon={Settings2}
            comingSoon
            features={[
              'API keys management',
              'Webhooks configuration',
              'Integration settings',
              'Data export options',
              'System logs'
            ]}
          />
        );

      case 'catalog':
        return (
          <PlaceholderSection
            title="Services Catalog"
            description="Browse all available health services and analyses"
            icon={BookOpen}
            features={[
              'Browse 100+ health services',
              'Filter by category and price',
              'View service details and requirements',
              'Purchase individual services',
              'Track order status'
            ]}
          />
        );

      case 'questionnaires':
        return <QuestionnairesSection />;

      case 'reports':
        onNavigate('reports');
        return null;

      case 'second-opinion':
        return (
          <PlaceholderSection
            title="AI Health Second Opinion"
            description="Get dual expert AI opinions on your health data and questions"
            icon={Scale}
            features={[
              'Parallel analysis from two AI models',
              'Evidence-based vs contextual perspectives',
              'Side-by-side comparison view',
              'Diff analysis of recommendations',
              'Merge opinions into actionable plan'
            ]}
          />
        );

      case 'medical-files':
        return (
          <PlaceholderSection
            title="Medical Files & Documents"
            description="Store and organize your medical records securely"
            icon={FolderLock}
            comingSoon
            features={[
              'Upload medical documents',
              'Organize by category and date',
              'OCR text extraction',
              'Share with healthcare providers',
              'Encrypted storage'
            ]}
          />
        );

      case 'black-box':
        return (
          <PlaceholderSection
            title="Black Box Storage"
            description="Secure encrypted storage for your sensitive health data"
            icon={FolderLock}
            comingSoon
            features={[
              'End-to-end encrypted storage',
              'Biometric access control',
              'Emergency access delegation',
              'Data inheritance planning',
              'Tamper-proof audit logs'
            ]}
          />
        );

      case 'referral':
        return (
          <PlaceholderSection
            title="Referral Program"
            description="Invite friends and earn rewards"
            icon={Users}
            comingSoon
            features={[
              'Unique referral link',
              'Track referrals and earnings',
              'Earn credits for each referral',
              'Bonus tiers for multiple referrals',
              'Referral leaderboard'
            ]}
          />
        );

      case 'billing':
        return (
          <PlaceholderSection
            title="Billing & Subscription"
            description="Manage your subscription and payment methods"
            icon={CreditCard}
            comingSoon
            features={[
              'View current plan and usage',
              'Upgrade or downgrade plans',
              'Manage payment methods',
              'View billing history',
              'Download invoices'
            ]}
          />
        );

      case 'profile':
        return (
          <PlaceholderSection
            title="Profile"
            description="Manage your personal information and preferences"
            icon={User}
            comingSoon
            features={[
              'Edit personal information',
              'Upload profile photo',
              'Health profile setup',
              'Emergency contacts',
              'Privacy settings'
            ]}
          />
        );

      case 'settings':
        return <ReportSettingsSection />;

      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors pt-16">
      <MemberSidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      <div className="ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-end mb-6">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
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
