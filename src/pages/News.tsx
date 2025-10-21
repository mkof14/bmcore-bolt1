import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';

interface NewsProps {
  onNavigate: (page: string) => void;
}

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  priority: number;
  published_at: string;
}

export default function News({ onNavigate }: NewsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('status', 'published')
        .order('priority', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error loading news:', error);
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
            <Newspaper className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">News</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Latest updates, announcements, and milestones from BioMath Core
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading news...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No news available yet.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Stay tuned for updates!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate(`news/${item.slug}`)}
              >
                <div className="md:flex">
                  {item.image_url && (
                    <div className="md:w-1/3 aspect-video md:aspect-square bg-gray-200 dark:bg-gray-800">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.published_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center text-orange-600 dark:text-orange-500 font-medium">
                      <span>Read more</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
