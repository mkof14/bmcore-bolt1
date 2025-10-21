import { Shield } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface PrivacyPolicyProps {
  onNavigate: (page: string) => void;
}

export default function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Last updated: October 21, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300 mb-0">
              BioMath Core is committed to protecting your privacy and ensuring the security of your personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Account information (name, email, password)</li>
              <li>Contact details</li>
              <li>Billing information</li>
              <li>Profile preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Health Data</h3>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Biomarkers and lab results</li>
              <li>Wearable device data</li>
              <li>Health assessments and questionnaires</li>
              <li>Lifestyle and wellness information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              We use your information to:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Provide personalized health insights and recommendations</li>
              <li>Generate reports and analytics</li>
              <li>Improve our AI models and services</li>
              <li>Communicate important updates</li>
              <li>Ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              We implement industry-leading security measures:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>End-to-end encryption for data transmission</li>
              <li>Encrypted storage of all health data</li>
              <li>Regular security audits and penetration testing</li>
              <li>HIPAA-compliant infrastructure</li>
              <li>Multi-factor authentication</li>
              <li>Access controls and monitoring</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              You have the right to:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt-out of certain data processing</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Sharing</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              We do not sell your personal data. We may share information only:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>With your explicit consent</li>
              <li>With healthcare providers you authorize</li>
              <li>With service providers bound by confidentiality</li>
              <li>When required by law</li>
              <li>To protect rights and safety</li>
            </ul>
          </section>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Questions About Privacy?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Contact our Privacy Officer at privacy@biomathcore.com
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
