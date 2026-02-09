import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminDb } from '../../lib/adminApi';
import CareerPostingForm from './CareerPostingForm';
import { notifyError, notifySuccess } from '../../lib/adminNotify';
import StateCard from '../ui/StateCard';
import ErrorBanner from '../ui/ErrorBanner';

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
  status: string;
  created_at: string;
}

export default function CareersManager() {
  const [jobs, setJobs] = useState<CareerPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<CareerPosting | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('career_postings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
      setError(null);
    } catch (error) {
      notifyError('Jobs load failed');
      setError('Unable to load job postings.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteJob(id: string) {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      const result = await adminDb({
        table: 'career_postings',
        action: 'delete',
        match: { id },
      });

      if (!result.ok) throw new Error(result.error || 'Job posting delete failed');
      await loadJobs();
      notifySuccess('Job posting deleted');
    } catch (error) {
      notifyError('Job posting delete failed');
    }
  }

  async function toggleStatus(job: CareerPosting) {
    const newStatus = job.status === 'active' ? 'closed' : 'active';

    try {
      const result = await adminDb({
        table: 'career_postings',
        action: 'update',
        data: { status: newStatus },
        match: { id: job.id },
      });

      if (!result.ok) throw new Error(result.error || 'Job status update failed');
      await loadJobs();
      notifySuccess('Job status updated');
    } catch (error) {
      notifyError('Job status update failed');
    }
  }

  if (loading) {
    return (
      <StateCard title="Loading jobs..." description="Fetching open roles and postings." />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Careers Management</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={loadJobs}
            className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingJob(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Job Posting
          </button>
        </div>
      </div>

      {error && <ErrorBanner message={error} className="mb-4" />}

      {jobs.length === 0 ? (
        <StateCard title="No job postings yet" description="Create your first opening to start recruiting." />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        job.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{job.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                      {job.department}
                    </span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.employment_type}</span>
                    {job.salary_range && (
                      <>
                        <span>•</span>
                        <span>{job.salary_range}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleStatus(job)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title={job.status === 'active' ? 'Close position' : 'Activate position'}
                  >
                    {job.status === 'active' ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingJob(job);
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CareerPostingForm
          job={editingJob}
          onClose={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
          onSave={loadJobs}
        />
      )}
    </div>
  );
}
