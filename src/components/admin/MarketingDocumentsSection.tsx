import { useState, useEffect } from 'react';
import { Upload, FileText, Download, Trash2, Eye, FolderOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminDb } from '../../lib/adminApi';
import { notifyError, notifySuccess } from '../../lib/adminNotify';
import StateCard from '../ui/StateCard';
import ErrorBanner from '../ui/ErrorBanner';
import ModalShell from '../ui/ModalShell';

interface MarketingDocument {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  category: string;
  tags: string[];
  uploaded_at: string;
  download_count: number;
  is_public: boolean;
}

export default function MarketingDocumentsSection() {
  const [documents, setDocuments] = useState<MarketingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file_url: '',
    file_name: '',
    file_type: 'pdf',
    file_size: 0,
    category: 'brochure',
    tags: '',
    is_public: false,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketing_documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
      setError(null);
    } catch (error) {
      notifyError('Documents load failed');
      setError('Unable to load marketing documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.file_url) {
      notifyError('Title and file URL are required');
      return;
    }

    setUploading(true);
    try {
      const tagsArray = uploadForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const result = await adminDb({
        table: 'marketing_documents',
        action: 'insert',
        data: {
          title: uploadForm.title,
          description: uploadForm.description,
          file_url: uploadForm.file_url,
          file_name: uploadForm.file_name || uploadForm.title,
          file_type: uploadForm.file_type,
          file_size: uploadForm.file_size,
          category: uploadForm.category,
          tags: tagsArray,
          is_public: uploadForm.is_public,
        },
      });

      if (!result.ok) throw new Error(result.error || 'Document upload failed');

      setShowUploadModal(false);
      setUploadForm({
        title: '',
        description: '',
        file_url: '',
        file_name: '',
        file_type: 'pdf',
        file_size: 0,
        category: 'brochure',
        tags: '',
        is_public: false,
      });
      loadDocuments();
      notifySuccess('Document uploaded');
    } catch (error) {
      notifyError('Document upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const result = await adminDb({
        table: 'marketing_documents',
        action: 'delete',
        match: { id },
      });

      if (!result.ok) throw new Error(result.error || 'Document delete failed');
      loadDocuments();
      notifySuccess('Document deleted');
    } catch (error) {
      notifyError('Document delete failed');
    }
  };

  const incrementDownloadCount = async (doc: MarketingDocument) => {
    try {
      const result = await adminDb({
        table: 'marketing_documents',
        action: 'update',
        data: { download_count: doc.download_count + 1 },
        match: { id: doc.id },
      });

      if (!result.ok) throw new Error(result.error || 'Download count update failed');
      window.open(doc.file_url, '_blank');
      loadDocuments();
    } catch (error) {
      notifyError('Download failed');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    return <FileText className="h-5 w-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      brochure: 'bg-blue-50 border-blue-200 text-blue-700',
      presentation: 'bg-purple-50 border-purple-200 text-purple-700',
      whitepaper: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      case_study: 'bg-orange-50 border-orange-200 text-orange-700',
      template: 'bg-pink-50 border-pink-200 text-pink-700',
      other: 'bg-slate-50 border-slate-200 text-slate-600',
    };
    return colors[category] || colors.other;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-orange-500" />
          Marketing Documents
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={loadDocuments}
            className="px-3 py-2 bg-white/80 border border-slate-200 text-gray-700 rounded-lg hover:border-orange-300 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20 flex items-center gap-2"
          >
            <Upload className="h-5 w-5" />
            Upload Document
          </button>
        </div>
      </div>

      {error && <ErrorBanner message={error} className="mb-4" />}

      {loading ? (
        <StateCard title="Loading documents..." description="Fetching the latest assets." />
      ) : documents.length === 0 ? (
        <StateCard title="No documents yet" description="Upload your first marketing document." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white/90 border border-slate-200 rounded-2xl p-6 hover:border-orange-300 transition-all shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl">
                  {getFileTypeIcon(doc.file_type)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => incrementDownloadCount(doc)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {doc.title}
              </h3>

              {doc.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {doc.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(doc.category)}`}>
                  {doc.category.replace('_', ' ')}
                </span>
                {doc.is_public && (
                  <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Public
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatFileSize(doc.file_size)}</span>
                <span>{doc.download_count} downloads</span>
              </div>

              {doc.tags.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <ModalShell
          title="Upload Document"
          icon={<Upload className="h-6 w-6 text-orange-500" />}
          onClose={() => setShowUploadModal(false)}
          panelClassName="max-w-2xl"
        >
          <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Document title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
                  <input
                    type="text"
                    value={uploadForm.file_url}
                    onChange={(e) => setUploadForm({ ...uploadForm, file_url: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/document.pdf"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="brochure">Brochure</option>
                      <option value="presentation">Presentation</option>
                      <option value="whitepaper">Whitepaper</option>
                      <option value="case_study">Case Study</option>
                      <option value="template">Template</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                    <select
                      value={uploadForm.file_type}
                      onChange={(e) => setUploadForm({ ...uploadForm, file_type: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="pdf">PDF</option>
                      <option value="doc">Word Document</option>
                      <option value="ppt">Presentation</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="marketing, sales, 2024"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uploadForm.is_public}
                      onChange={(e) => setUploadForm({ ...uploadForm, is_public: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                  <span className="text-sm text-gray-600">Make this document public</span>
                </div>
              </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-6 py-2 bg-slate-200 text-gray-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
