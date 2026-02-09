import { Briefcase, MapPin, Clock, DollarSign, ArrowRight, Share2, Copy, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';
import { notifyUserInfo } from '../lib/adminNotify';

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
  requirements: string[];
  responsibilities: string[];
  salary_range: string;
}

export default function Careers({ onNavigate }: CareersProps) {
  const [jobs, setJobs] = useState<CareerPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<CareerPosting | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (!selectedJob) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedJob(null);
        window.location.hash = '#/careers';
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedJob]);

  async function loadJobs() {
    try {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('career_postings')
        .select('id, title, slug, department, location, employment_type, description, requirements, responsibilities, salary_range')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError('Careers load failed');
        return;
      }

      const loadedJobs = data || [];
      setJobs(loadedJobs);

      const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
      const slug = params.get('job');
      if (slug) {
        const match = loadedJobs.find((job) => job.slug === slug);
        if (match) setSelectedJob(match);
      }
    } catch (err) {
      setError('Careers load failed');
    } finally {
      setLoading(false);
    }
  }

  const types = Array.from(new Set(jobs.map(job => job.employment_type).filter(Boolean)));

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = !query ||
      job.title.toLowerCase().includes(query) ||
      (job.description || '').toLowerCase().includes(query) ||
      (job.department || '').toLowerCase().includes(query) ||
      (job.location || '').toLowerCase().includes(query);
    const matchesType = typeFilter === 'all' || job.employment_type === typeFilter;
    return matchesQuery && matchesType;
  });

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  const handleCopyLink = (job: CareerPosting) => {
    const link = `${window.location.origin}/#/careers?job=${job.slug}`;
    navigator.clipboard.writeText(link);
    window.location.hash = `#/careers?job=${job.slug}`;
    notifyUserInfo('Link copied');
  };

  const handleShare = async (job: CareerPosting) => {
    const link = `${window.location.origin}/#/careers?job=${job.slug}`;
    if (navigator.share) {
      await navigator.share({
        title: job.title,
        text: job.description,
        url: link,
      });
      return;
    }
    handleCopyLink(job);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200/80 bg-white/70 text-[11px] font-semibold uppercase tracking-[0.32em] text-orange-700 backdrop-blur dark:bg-white/10 dark:text-orange-200 dark:border-orange-300/20 mb-6">
            Careers
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">Careers</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Join us in building the future of personalized health intelligence
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 mb-12 shadow-sm">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 text-center">Why BioMath Core?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">Innovation-Driven</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Work on cutting-edge AI and biomathematics</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">Impact-Focused</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Help millions improve their health</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">Growth-Oriented</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Continuous learning and development</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading positions...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 shadow-sm">
            <p className="text-red-500 font-semibold mb-3 text-xl">Error Loading Positions</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={loadJobs}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-all duration-300 shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 shadow-sm">
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">No open positions at the moment.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check back soon or send us your CV at careers@biomathcore.com</p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div>
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-8">
              <div className="relative w-full md:max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(6);
                  }}
                  placeholder="Search roles..."
                  className="w-full px-4 py-2 pr-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setVisibleCount(6);
                }}
                className="w-full md:w-56 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredJobs.length} results
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">No roles match your search.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Try different keywords or filters.</p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {visibleJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => {
                  setSelectedJob(job);
                  window.location.hash = `#/careers?job=${job.slug}`;
                }}
                className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:border-orange-400/60 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm"
              >
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 transition-colors">{job.title}</h3>
                      <span className="inline-block px-3 py-1 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium rounded-full">
                        {job.department}
                      </span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-orange-500 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>{job.employment_type}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-orange-500" />
                        <span>{job.salary_range}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
                  ))}
                </div>

                {visibleJobs.length < filteredJobs.length && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setVisibleCount((count) => count + 6)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg transition-colors hover:bg-gray-800"
                    >
                      Load more
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {selectedJob && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedJob(null);
              window.location.hash = '#/careers';
            }
          }}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-orange-500 font-semibold tracking-wider uppercase mb-2">
                  {selectedJob.department}
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                  {selectedJob.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {selectedJob.location} • {selectedJob.employment_type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedJob)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopyLink(selectedJob)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    window.location.hash = '#/careers';
                  }}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {selectedJob.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Role Overview</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>
              )}

              {selectedJob.responsibilities?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Responsibilities</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {selectedJob.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-orange-500 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.requirements?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Requirements</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {selectedJob.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-orange-500 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.salary_range && (
                <div className="bg-slate-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Salary Range</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedJob.salary_range}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
