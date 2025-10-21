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
            Disclaimer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Important information about using BioMath Core</p>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-0">Critical Notice</h3>
            <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">
              BioMath Core is NOT a medical device, medical service, or substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-0">
              Always seek the advice of qualified healthcare providers with any questions regarding medical conditions. Never disregard professional medical advice or delay seeking it because of information from BioMath Core.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Medical Advice</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              All information, insights, and recommendations provided by BioMath Core:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Are for informational and educational purposes only</li>
              <li>Do not constitute medical advice, diagnosis, or treatment</li>
              <li>Should not replace consultations with healthcare professionals</li>
              <li>Are based on algorithms and may contain errors or inaccuracies</li>
              <li>May not be suitable for your specific health situation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Medical Emergencies</h2>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">
                If you think you may have a medical emergency, call your doctor or emergency services immediately.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-0">
                BioMath Core does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information mentioned on the platform.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Accuracy of Information</h2>
            <p className="text-gray-700 dark:text-gray-300">
              While we strive for accuracy, BioMath Core makes no warranties or representations about:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 mt-3">
              <li>The completeness, reliability, or accuracy of information</li>
              <li>The suitability of insights for your individual circumstances</li>
              <li>The performance or results you may achieve</li>
              <li>The absence of errors or interruptions in service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI and Algorithm Limitations</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Our AI-powered insights:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>Are based on statistical models and patterns</li>
              <li>May not account for all individual variations</li>
              <li>Require interpretation by qualified professionals</li>
              <li>Should be verified through proper medical channels</li>
              <li>Cannot replace human clinical judgment</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Third-Party Content</h2>
            <p className="text-gray-700 dark:text-gray-300">
              BioMath Core may contain links to external websites or reference third-party information. We do not control, endorse, or assume responsibility for third-party content. Access and use of third-party sites is at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reliance on Information</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Any reliance you place on information from BioMath Core is strictly at your own risk. We disclaim all liability for decisions made based on our content. Always verify information with qualified healthcare providers before taking action.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Regulatory Status</h2>
            <p className="text-gray-700 dark:text-gray-300">
              BioMath Core is not regulated as a medical device by the FDA or other regulatory bodies. Our platform provides wellness information and should not be used for medical decision-making without professional consultation.
            </p>
          </section>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mt-8">
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
