import { useState, useEffect } from 'react';
import { adminDb } from '../../lib/adminApi';
import { notifyError, notifySuccess } from '../../lib/adminNotify';
import ModalShell from '../ui/ModalShell';

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
}

interface NewsItemFormProps {
  item: NewsItem | null;
  onClose: () => void;
  onSave: () => void;
}

export default function NewsItemForm({ item, onClose, onSave }: NewsItemFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    status: 'draft',
    priority: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        image_url: item.image_url || '',
        status: item.status,
        priority: item.priority,
      });
    }
  }, [item]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      notifyError('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const newsData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: formData.image_url || null,
        status: formData.status,
        priority: formData.priority,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      };

      if (item) {
        const result = await adminDb({
          table: 'news_items',
          action: 'update',
          data: newsData,
          match: { id: item.id },
        });

        if (!result.ok) throw new Error(result.error || 'News item update failed');
      } else {
        const result = await adminDb({
          table: 'news_items',
          action: 'insert',
          data: newsData,
        });

        if (!result.ok) throw new Error(result.error || 'News item create failed');
      }

      onSave();
      onClose();
      notifySuccess('News item saved');
    } catch (error) {
      notifyError('News item save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title={item ? 'Edit News Item' : 'Create News Item'}
      onClose={onClose}
      panelClassName="max-w-4xl"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter news title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="news-url-slug"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Brief description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={12}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Write your news content here..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <input
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="text"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save News'}
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200"
        >
          Cancel
        </button>
      </div>
    </ModalShell>
  );
}
