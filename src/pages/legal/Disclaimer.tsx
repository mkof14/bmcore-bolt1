import { AlertTriangle } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface DisclaimerProps {
  onNavigate: (page: string) => void;
}

export default function Disclaimer({ onNavigate }: DisclaimerProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Medical Disclaimer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Last updated: October 21, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-3 mt-0">CRITICAL NOTICE</h3>
            <p className="text-red-900 dark:text-red-100 font-bold mb-2">
              BioMath Core is NOT a medical device, medical service, or substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p className="text-red-800 dark:text-red-200 mb-0">
              ALWAYS seek the advice of qualified healthcare providers with any questions regarding medical conditions. NEVER disregard professional medical advice or delay seeking it because of information from BioMath Core.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Not Medical Advice</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              ALL information, insights, and recommendations provided by BioMath Core:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Are for informational and educational purposes only</li>
              <li>Do NOT constitute medical advice, diagnosis, or treatment</li>
              <li>Should NOT replace consultations with healthcare professionals</li>
              <li>Are based on algorithms and may contain errors or inaccuracies</li>
              <li>May NOT be suitable for your specific health situation</li>
              <li>Must be verified with qualified healthcare providers before taking action</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Medical Emergencies</h2>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-4">
              <p className="text-red-900 dark:text-red-100 font-medium mb-2">
                If you think you may have a medical emergency, call 911 or your local emergency number immediately.
              </p>
              <p className="text-red-800 dark:text-red-200 mb-0">
                BioMath Core does NOT provide emergency services and should NOT be used for medical emergencies.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Not a Healthcare Provider</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              BioMath Core and its employees:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Are NOT healthcare providers or medical professionals</li>
              <li>Do NOT form doctor-patient relationships</li>
              <li>Do NOT diagnose medical conditions or prescribe treatments</li>
              <li>Are NOT covered entities under HIPAA</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. AI and Algorithm Limitations</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Our AI-powered insights:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Are based on statistical models, NOT clinical evaluation</li>
              <li>May NOT account for individual variations</li>
              <li>May produce errors or inappropriate recommendations</li>
              <li>Cannot replace human clinical judgment</li>
              <li>Require interpretation by qualified professionals</li>
              <li>Should NEVER be the sole basis for medical decisions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Accuracy of Information</h2>
            <p className="text-gray-700 dark:text-gray-300">
              While we strive for accuracy, BioMath Core makes NO WARRANTIES about the completeness, reliability, or accuracy of information. Medical knowledge evolves; information may become outdated. We cannot guarantee specific results or health outcomes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. User Responsibility</h2>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                ANY RELIANCE ON INFORMATION FROM BIOMATH CORE IS STRICTLY AT YOUR OWN RISK.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-0">
                You are solely responsible for decisions made based on information from BioMath Core. Always verify information with qualified healthcare providers.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Regulatory Status</h2>
            <p className="text-gray-700 dark:text-gray-300">
              BioMath Core is NOT regulated as a medical device by the FDA or other regulatory bodies. Our platform has NOT been evaluated by the FDA for safety or efficacy. We are NOT intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Professional Consultation Required</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              ALWAYS consult qualified healthcare professionals:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Before starting any new health regimen or lifestyle change</li>
              <li>Before making changes to existing treatments</li>
              <li>To interpret lab results or health data</li>
              <li>If you experience any health concerns</li>
              <li>Before acting on any information from BioMath Core</li>
            </ul>
          </section>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Questions or Concerns?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Contact us at support@biomathcore.com
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-medium"
            >
              Contact Us →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
