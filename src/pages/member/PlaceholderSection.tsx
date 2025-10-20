import { LucideIcon, Construction, Sparkles } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface PlaceholderSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
  comingSoon?: boolean;
  onBack?: () => void;
}

export default function PlaceholderSection({
  title,
  description,
  icon: Icon,
  features = [],
  comingSoon = false,
  onBack
}: PlaceholderSectionProps) {
  return (
    <div>
      {onBack && <BackButton onClick={onBack} />}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {comingSoon && (
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-semibold rounded-full">
              Coming Soon
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          {comingSoon ? (
            <>
              <Construction className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Coming Soon
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're working hard to bring you this feature. Stay tuned!
              </p>
            </>
          ) : (
            <>
              <Sparkles className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This section is ready for implementation
              </p>
            </>
          )}

          {features.length > 0 && (
            <div className="max-w-2xl mx-auto mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Planned Features:
              </h3>
              <ul className="space-y-3 text-left">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
