import { FileText } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface TermsOfServiceProps {
  onNavigate: (page: string) => void;
}

export default function TermsOfService({ onNavigate }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Last updated: October 21, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300 mb-0">
              By accessing or using BioMath Core, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">
              By creating an account, accessing, or using BioMath Core's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              BioMath Core provides:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>AI-powered health analytics and insights</li>
              <li>Personalized wellness recommendations</li>
              <li>Health data tracking and reporting</li>
              <li>Educational resources and guidance</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-3">
              Our services are for informational and educational purposes only and do not constitute medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Medical Disclaimer</h2>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                BioMath Core is NOT a medical device and does NOT provide medical advice.
              </p>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                <li>Always consult qualified healthcare professionals for medical decisions</li>
                <li>Do not disregard professional medical advice based on our insights</li>
                <li>In case of medical emergency, contact emergency services immediately</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. User Responsibilities</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">You agree to:</p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Provide accurate information</li>
              <li>Maintain account security</li>
              <li>Use services for lawful purposes only</li>
              <li>Respect intellectual property rights</li>
              <li>Not attempt to breach security</li>
              <li>Comply with all applicable laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Subscription and Payment</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Subscription terms:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Subscriptions renew automatically</li>
              <li>You may cancel anytime</li>
              <li>Refunds subject to our refund policy</li>
              <li>Prices subject to change with notice</li>
              <li>Payment information secured via encrypted channels</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 dark:text-gray-300">
              All content, features, and functionality are owned by BioMath Core and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300">
              To the maximum extent permitted by law, BioMath Core shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We reserve the right to modify these terms at any time. We will notify users of significant changes. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Questions About These Terms?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Contact us at legal@biomathcore.com
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
