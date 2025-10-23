import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import AIAssistantButton from './components/AIAssistantButton';
import AIHealthAssistant from './components/AIHealthAssistantV2';
import CookieBanner from './components/CookieBanner';
import PWAInstallPrompt, { PWAUpdatePrompt } from './components/PWAInstallPrompt';
import { LoadingPage } from './components/LoadingSpinner';
import { analytics, identifyUser } from './lib/analytics';
import { performanceMonitor } from './lib/performance';
import { useServiceWorker } from './hooks/useServiceWorker';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Investors = lazy(() => import('./pages/Investors'));
const Science = lazy(() => import('./pages/Science'));
const API = lazy(() => import('./pages/API'));
const Contact = lazy(() => import('./pages/Contact'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const MemberZone = lazy(() => import('./pages/MemberZone'));
const ServicesCatalog = lazy(() => import('./pages/ServicesCatalog'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Devices = lazy(() => import('./pages/Devices'));
const Reports = lazy(() => import('./pages/Reports'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Referral = lazy(() => import('./pages/Referral'));
const Ambassador = lazy(() => import('./pages/Ambassador'));
const LearningCenter = lazy(() => import('./pages/LearningCenter'));
const BiomathCoreSummary = lazy(() => import('./pages/BiomathCoreSummary'));
const SummaryText = lazy(() => import('./pages/SummaryText'));
const Blog = lazy(() => import('./pages/Blog'));
const News = lazy(() => import('./pages/News'));
const Careers = lazy(() => import('./pages/Careers'));
const CommandCenter = lazy(() => import('./pages/CommandCenter'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));
const Disclaimer = lazy(() => import('./pages/legal/Disclaimer'));
const HIPAANotice = lazy(() => import('./pages/legal/HIPAANotice'));
const Security = lazy(() => import('./pages/legal/Security'));
const GDPR = lazy(() => import('./pages/legal/GDPR'));
const DataPrivacy = lazy(() => import('./pages/legal/DataPrivacy'));
const TrustSafety = lazy(() => import('./pages/legal/TrustSafety'));
const Partnership = lazy(() => import('./pages/Partnership'));

type Page = 'home' | 'about' | 'services' | 'pricing' | 'investors' | 'science' | 'api' | 'contact' | 'signin' | 'signup' | 'member' | 'member-zone' | 'services-catalog' | 'service-detail' | 'devices' | 'reports' | 'faq' | 'referral' | 'ambassador' | 'learning' | 'learning-center' | 'biomath-core-summary' | 'summary-text' | 'blog' | 'news' | 'careers' | 'command-center' | 'admin-panel' | 'privacy-policy' | 'terms-of-service' | 'disclaimer' | 'hipaa-notice' | 'security' | 'gdpr' | 'data-privacy' | 'trust-safety' | 'partnership';

function App() {
  // VERSION: 2025-10-20-01:48 - Force HMR refresh
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [serviceDetailId, setServiceDetailId] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        identifyUser(session.user.id, {
          email: session.user.email
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        identifyUser(session.user.id, {
          email: session.user.email
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    analytics.page(currentPage);
  }, [currentPage]);

  const handleNavigate = (page: string, data?: string) => {
    if (page === 'member' && !isAuthenticated) {
      setCurrentPage('signin');
    } else if (page === 'service-detail' && data) {
      setServiceDetailId(data);
      setCurrentPage('service-detail');
    } else if (page === 'services-catalog' && data) {
      setCategoryFilter(data);
      setCurrentPage('services-catalog');
    } else {
      setCategoryFilter('');
      setCurrentPage(page as Page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'about':
        return <About />;
      case 'services':
        return <Services onNavigate={handleNavigate} />;
      case 'pricing':
        return <Pricing onNavigate={handleNavigate} />;
      case 'services-catalog':
        return <ServicesCatalog onNavigate={handleNavigate} initialCategory={categoryFilter} />;
      case 'service-detail':
        return <ServiceDetail onNavigate={handleNavigate} serviceId={serviceDetailId} />;
      case 'investors':
        return <Investors onNavigate={handleNavigate} />;
      case 'science':
        return <Science />;
      case 'api':
        return <API onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact />;
      case 'faq':
        return <FAQ onNavigate={handleNavigate} />;
      case 'signin':
        return <SignIn onNavigate={handleNavigate} onSignIn={handleSignIn} />;
      case 'signup':
        return <SignUp onNavigate={handleNavigate} />;
      case 'member':
      case 'member-zone':
        return isAuthenticated ? (
          <MemberZone onNavigate={handleNavigate} onSignOut={handleSignOut} />
        ) : (
          <SignIn onNavigate={handleNavigate} onSignIn={handleSignIn} />
        );
      case 'devices':
        return isAuthenticated ? (
          <Devices onNavigate={handleNavigate} />
        ) : (
          <SignIn onNavigate={handleNavigate} onSignIn={handleSignIn} />
        );
      case 'reports':
        return isAuthenticated ? (
          <Reports onNavigate={handleNavigate} />
        ) : (
          <SignIn onNavigate={handleNavigate} onSignIn={handleSignIn} />
        );
      case 'referral':
        return <Referral onNavigate={handleNavigate} />;
      case 'ambassador':
        return <Ambassador onNavigate={handleNavigate} />;
      case 'learning':
      case 'learning-center':
        return <LearningCenter onNavigate={handleNavigate} />;
      case 'biomath-core-summary':
        return <BiomathCoreSummary onNavigate={handleNavigate} />;
      case 'summary-text':
        return <SummaryText onNavigate={handleNavigate} />;
      case 'blog':
        return <Blog onNavigate={handleNavigate} />;
      case 'news':
        return <News onNavigate={handleNavigate} />;
      case 'careers':
        return <Careers onNavigate={handleNavigate} />;
      case 'command-center':
        return <CommandCenter onNavigate={handleNavigate} />;
      case 'admin-panel':
        return <AdminPanel onNavigate={handleNavigate} />;
      case 'privacy-policy':
        return <PrivacyPolicy onNavigate={handleNavigate} />;
      case 'terms-of-service':
        return <TermsOfService onNavigate={handleNavigate} />;
      case 'disclaimer':
        return <Disclaimer onNavigate={handleNavigate} />;
      case 'hipaa-notice':
        return <HIPAANotice onNavigate={handleNavigate} />;
      case 'security':
        return <Security onNavigate={handleNavigate} />;
      case 'gdpr':
        return <GDPR onNavigate={handleNavigate} />;
      case 'data-privacy':
        return <DataPrivacy onNavigate={handleNavigate} />;
      case 'trust-safety':
        return <TrustSafety onNavigate={handleNavigate} />;
      case 'partnership':
        return <Partnership onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  const showHeaderFooter = currentPage !== 'signin' && currentPage !== 'signup';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {showHeaderFooter && <Header onNavigate={handleNavigate} currentPage={currentPage} />}
      <main>
        <Suspense fallback={<LoadingPage text="Loading..." />}>
          {renderPage()}
        </Suspense>
      </main>
      {showHeaderFooter && <Footer onNavigate={handleNavigate} />}

      <AIAssistantButton
        onClick={() => setIsAssistantOpen(!isAssistantOpen)}
        isOpen={isAssistantOpen}
      />

      <AIHealthAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      <CookieBanner />

      <PWAInstallPrompt />

      {isUpdateAvailable && (
        <PWAUpdatePrompt onUpdate={updateServiceWorker} />
      )}
    </div>
  );
}

export default App;
