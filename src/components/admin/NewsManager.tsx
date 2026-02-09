import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminDb } from '../../lib/adminApi';
import NewsItemForm from './NewsItemForm';
import { notifyError, notifySuccess } from '../../lib/adminNotify';
import StateCard from '../ui/StateCard';
import ErrorBanner from '../ui/ErrorBanner';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  status: string;
  priority: number;
  published_at: string;
  created_at: string;
}

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
      setError(null);
    } catch (error) {
      notifyError('News load failed');
      setError('Unable to load news items.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteNews(id: string) {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const result = await adminDb({
        table: 'news_items',
        action: 'delete',
        match: { id },
      });

      if (!result.ok) throw new Error(result.error || 'News item delete failed');
      await loadNews();
      notifySuccess('News item deleted');
    } catch (error) {
      notifyError('News item delete failed');
    }
  }

  async function toggleStatus(item: NewsItem) {
    const newStatus = item.status === 'published' ? 'draft' : 'published';

    try {
      const result = await adminDb({
        table: 'news_items',
        action: 'update',
        data: { status: newStatus },
        match: { id: item.id },
      });

      if (!result.ok) throw new Error(result.error || 'News status update failed');
      await loadNews();
      notifySuccess('News status updated');
    } catch (error) {
      notifyError('News status update failed');
    }
  }

  if (loading) {
    return (
      <StateCard title="Loading news..." description="Fetching the latest updates." />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">News Management</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={loadNews}
            className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New News Item
          </button>
        </div>
      </div>

      {error && <ErrorBanner message={error} className="mb-4" />}

      {news.length === 0 ? (
        <StateCard title="No news items yet" description="Create your first update to keep users informed." />
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Priority: {item.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{item.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleStatus(item)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title={item.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {item.status === 'published' ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => deleteNews(item.id)}
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
        <NewsItemForm
          item={editingItem}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSave={loadNews}
        />
      )}
    </div>
  );
}
