import { ShieldCheck } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface TrustSafetyProps {
  onNavigate: (page: string) => void;
}

export default function TrustSafety({ onNavigate }: TrustSafetyProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl mb-4">
            <ShieldCheck className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Trust & Safety</h1>
          <p className="text-gray-600 dark:text-gray-400">Building a safe platform for everyone</p>
        </div>
        <div className="prose prose-lg max-w-none dark:prose-invert space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Commitment</h2>
            <p className="text-gray-700 dark:text-gray-300">BioMath Core is committed to providing a safe, trustworthy platform where your health data is protected and your privacy respected.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Transparency</h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Clear communication about data usage</li>
              <li>Open about AI model limitations</li>
              <li>Regular transparency reports</li>
              <li>Honest about what we can and cannot do</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Accountability</h2>
            <p className="text-gray-700 dark:text-gray-300">We take responsibility for protecting your data and maintaining trust. Our team is accountable for security, privacy, and ethical use of AI.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Report Concerns</h2>
            <p className="text-gray-700 dark:text-gray-300">If you have safety or trust concerns, contact us at safety@biomathcore.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
