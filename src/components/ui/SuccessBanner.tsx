type SuccessBannerProps = {
  message: string;
  className?: string;
};

export default function SuccessBanner({ message, className }: SuccessBannerProps) {
  return (
    <div className={`rounded-xl border border-emerald-200 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200 ${className || ''}`}>
      {message}
    </div>
  );
}
