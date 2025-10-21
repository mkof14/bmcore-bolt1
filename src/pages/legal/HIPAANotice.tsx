import { Shield } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface HIPAANoticeProps {
  onNavigate: (page: string) => void;
}

export default function HIPAANotice({ onNavigate }: HIPAANoticeProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">HIPAA Notice</h1>
          <p className="text-gray-600 dark:text-gray-400">Healthcare data protection and privacy</p>
        </div>
        <div className="prose prose-lg max-w-none dark:prose-invert space-y-8">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-0">
              BioMath Core is committed to maintaining HIPAA compliance standards for the protection of your health information.
            </p>
          </div>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our HIPAA Commitment</h2>
            <p className="text-gray-700 dark:text-gray-300">We implement comprehensive safeguards including technical, physical, and administrative controls to ensure your protected health information (PHI) remains secure and confidential.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights Under HIPAA</h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Right to access your health information</li>
              <li>Right to request corrections</li>
              <li>Right to an accounting of disclosures</li>
              <li>Right to request restrictions</li>
              <li>Right to confidential communications</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
