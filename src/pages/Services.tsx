interface ServicesProps {
  onNavigate: (page: string) => void;
}

export default function Services({ onNavigate }: ServicesProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Services - Coming Soon</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              This page is being updated.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
