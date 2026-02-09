import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminDb } from '../../lib/adminApi';
import BlogPostForm from './BlogPostForm';
import { notifyError, notifySuccess } from '../../lib/adminNotify';
import StateCard from '../ui/StateCard';
import ErrorBanner from '../ui/ErrorBanner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  status: string;
  published_at: string;
  created_at: string;
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
      setError(null);
    } catch (error) {
      notifyError('Post load failed');
      setError('Unable to load blog posts.');
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const result = await adminDb({
        table: 'blog_posts',
        action: 'delete',
        match: { id },
      });

      if (!result.ok) throw new Error(result.error || 'Post delete failed');
      await loadPosts();
      notifySuccess('Post deleted');
    } catch (error) {
      notifyError('Post delete failed');
    }
  }

  async function toggleStatus(post: BlogPost) {
    const newStatus = post.status === 'published' ? 'draft' : 'published';

    try {
      const result = await adminDb({
        table: 'blog_posts',
        action: 'update',
        data: { status: newStatus },
        match: { id: post.id },
      });

      if (!result.ok) throw new Error(result.error || 'Post status update failed');
      await loadPosts();
      notifySuccess('Post status updated');
    } catch (error) {
      notifyError('Post status update failed');
    }
  }

  if (loading) {
    return (
      <StateCard title="Loading posts..." description="Fetching the latest blog content." />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Blog Management</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={loadPosts}
            className="px-3 py-2 bg-white/80 border border-slate-200 text-gray-700 rounded-lg hover:border-orange-300 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingPost(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Post
          </button>
        </div>
      </div>

      {error && <ErrorBanner message={error} className="mb-4" />}

      {posts.length === 0 ? (
        <StateCard title="No posts yet" description="Create your first blog post to get started." />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleStatus(post)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {post.status === 'published' ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingPost(post);
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
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

      {posts.length === 0 && (
        <StateCard title="No blog posts yet" description="Create your first post to get started." className="mt-6" />
      )}

      {showForm && (
        <BlogPostForm
          post={editingPost}
          onClose={() => {
            setShowForm(false);
            setEditingPost(null);
          }}
          onSave={loadPosts}
        />
      )}
    </div>
  );
}
