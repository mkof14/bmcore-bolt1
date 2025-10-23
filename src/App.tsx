import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import AIAssistantButton from './components/AIAssistantButton';
import AIHealthAssistant from './components/AIHealthAssistantV2';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Investors from './pages/Investors';
import Science from './pages/Science';
import API from './pages/API';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MemberZone from './pages/MemberZone';
import ServicesCatalog from './pages/ServicesCatalog';
import ServiceDetail from './pages/ServiceDetail';
import Devices from './pages/Devices';
import Reports from './pages/Reports';
import FAQ from './pages/FAQ';
import Referral from './pages/Referral';
import Ambassador from './pages/Ambassador';
import LearningCenter from './pages/LearningCenter';
import BiomathCoreSummary from './pages/BiomathCoreSummary';
import SummaryText from './pages/SummaryText';
import Blog from './pages/Blog';
import News from './pages/News';
import Careers from './pages/Careers';
import CommandCenter from './pages/CommandCenter';
import AdminPanel from './pages/AdminPanel';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import Disclaimer from './pages/legal/Disclaimer';
import HIPAANotice from './pages/legal/HIPAANotice';
import Security from './pages/legal/Security';
import GDPR from './pages/legal/GDPR';
import DataPrivacy from './pages/legal/DataPrivacy';
import TrustSafety from './pages/legal/TrustSafety';
import Partnership from './pages/Partnership';

type Page = 'home' | 'about' | 'services' | 'pricing' | 'investors' | 'science' | 'api' | 'contact' | 'signin' | 'signup' | 'member' | 'member-zone' | 'services-catalog' | 'service-detail' | 'devices' | 'reports' | 'faq' | 'referral' | 'ambassador' | 'learning' | 'learning-center' | 'biomath-core-summary' | 'summary-text' | 'blog' | 'news' | 'careers' | 'command-center' | 'admin-panel' | 'privacy-policy' | 'terms-of-service' | 'disclaimer' | 'hipaa-notice' | 'security' | 'gdpr' | 'data-privacy' | 'trust-safety' | 'partnership';

function App() {
  // VERSION: 2025-10-20-01:48 - Force HMR refresh
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [serviceDetailId, setServiceDetailId] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        {renderPage()}
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
    </div>
  );
}

export default App;
