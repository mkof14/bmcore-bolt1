import type { ReactNode } from 'react';

type StateCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

export default function StateCard({ title, description, icon, className }: StateCardProps) {
  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 p-10 text-center text-gray-700 dark:text-gray-300 ${className || ''}`}>
      {icon && <div className="mb-4 flex justify-center text-gray-500 dark:text-gray-400">{icon}</div>}
      <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</p>
      {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
    </div>
  );
}
