import { Lock } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface SecurityProps {
  onNavigate: (page: string) => void;
}

export default function Security({ onNavigate }: SecurityProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl mb-4">
            <Lock className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Security</h1>
          <p className="text-gray-600 dark:text-gray-400">How we protect your data</p>
        </div>
        <div className="prose prose-lg max-w-none dark:prose-invert space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Encryption</h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>256-bit AES encryption for data at rest</li>
              <li>TLS 1.3 for data in transit</li>
              <li>End-to-end encryption for sensitive communications</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Infrastructure Security</h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>SOC 2 Type II certified cloud infrastructure</li>
              <li>Regular penetration testing</li>
              <li>24/7 security monitoring</li>
              <li>Intrusion detection and prevention systems</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Controls</h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Multi-factor authentication</li>
              <li>Role-based access control (RBAC)</li>
              <li>Comprehensive audit logging</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
