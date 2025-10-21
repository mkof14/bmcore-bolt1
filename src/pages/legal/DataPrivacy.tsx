import { Database } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface DataPrivacyProps {
  onNavigate: (page: string) => void;
}

export default function DataPrivacy({ onNavigate }: DataPrivacyProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl mb-4">
            <Database className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Data Privacy</h1>
          <p className="text-gray-600 dark:text-gray-400">Our commitment to your data privacy</p>
        </div>
        <div className="prose prose-lg max-w-none dark:prose-invert space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy by Design</h2>
            <p className="text-gray-700 dark:text-gray-300">Privacy is built into every aspect of BioMath Core from the ground up. We collect only necessary data and implement strict controls on access and usage.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Minimization</h2>
            <p className="text-gray-700 dark:text-gray-300">We collect and retain only the minimum data necessary to provide our services. Data is anonymized or pseudonymized wherever possible.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Data, Your Control</h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Export your data anytime</li>
              <li>Delete your account and data</li>
              <li>Control sharing preferences</li>
              <li>Manage consent settings</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
