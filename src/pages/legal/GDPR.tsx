import { Globe } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface GDPRProps {
  onNavigate: (page: string) => void;
}

export default function GDPR({ onNavigate }: GDPRProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl mb-4">
            <Globe className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">GDPR Compliance</h1>
          <p className="text-gray-600 dark:text-gray-400">European data protection rights</p>
        </div>
        <div className="prose prose-lg max-w-none dark:prose-invert space-y-8">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-0">
              BioMath Core complies with the EU General Data Protection Regulation (GDPR) to protect the privacy rights of individuals in the European Economic Area.
            </p>
          </div>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your GDPR Rights</h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Rights related to automated decision-making</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lawful Basis for Processing</h2>
            <p className="text-gray-700 dark:text-gray-300">We process your data based on: consent, contract performance, legal obligations, vital interests, and legitimate interests.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Protection Officer</h2>
            <p className="text-gray-700 dark:text-gray-300">Contact our DPO at dpo@biomathcore.com for GDPR-related inquiries.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
