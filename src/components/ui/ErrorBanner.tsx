type ErrorBannerProps = {
  message: string;
  className?: string;
};

export default function ErrorBanner({ message, className }: ErrorBannerProps) {
  return (
    <div className={`rounded-xl border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200 ${className || ''}`}>
      {message}
    </div>
  );
}
