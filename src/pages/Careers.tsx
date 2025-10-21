import { Briefcase, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';

interface CareersProps {
  onNavigate: (page: string) => void;
}

interface CareerPosting {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  salary_range: string;
}

export default function Careers({ onNavigate }: CareersProps) {
  const [jobs, setJobs] = useState<CareerPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('career_postings')
        .select('id, title, slug, department, location, employment_type, description, salary_range')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError(`Database error: ${fetchError.message}`);
        return;
      }

      console.log('Loaded jobs:', data);
      setJobs(data || []);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError(`Failed to load: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl mb-4">
            <Briefcase className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Careers</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Join us in building the future of personalized health intelligence
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10 border border-orange-200 dark:border-orange-800 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why BioMath Core?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Innovation-Driven</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">Work on cutting-edge AI and biomathematics</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Impact-Focused</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">Help millions improve their health</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Growth-Oriented</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">Continuous learning and development</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading positions...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error Loading Positions</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={loadJobs}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No open positions at the moment.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Check back soon or send us your CV at careers@biomathcore.com</p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                    <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">
                      {job.department}
                    </span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{job.employment_type}</span>
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
