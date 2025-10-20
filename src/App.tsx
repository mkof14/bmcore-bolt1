import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import AIAssistantButton from './components/AIAssistantButton';
import AIHealthAssistant from './components/AIHealthAssistantV2';
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

type Page = 'home' | 'about' | 'services' | 'pricing' | 'investors' | 'science' | 'api' | 'contact' | 'signin' | 'signup' | 'member' | 'member-zone' | 'services-catalog' | 'service-detail' | 'devices' | 'reports' | 'faq' | 'referral' | 'ambassador' | 'learning' | 'learning-center' | 'biomath-core-summary' | 'summary-text';

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
    </div>
  );
}

export default App;
