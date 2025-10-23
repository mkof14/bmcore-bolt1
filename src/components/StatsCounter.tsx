import { useState, useEffect, useRef } from 'react';
import { Users, Activity, TrendingUp, Globe, Database, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TrustMetric {
  metric_key: string;
  metric_value: number;
  metric_label: string;
  display_format: string;
}

const iconMap: Record<string, any> = {
  total_users: Users,
  total_services: Activity,
  success_rate: TrendingUp,
  years_experience: Award,
  countries: Globe,
  data_points: Database,
};

function useCountUp(end: number, duration: number = 2000, shouldStart: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, shouldStart]);

  return count;
}

function formatMetricValue(value: number, format: string): string {
  switch (format) {
    case 'percentage':
      return `${value}%`;
    case 'compact':
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
    case 'number':
    default:
      return value.toLocaleString();
  }
}

export default function StatsCounter() {
  const [metrics, setMetrics] = useState<TrustMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('trust_metrics')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching trust metrics:', error);
    }
  };

  return (
    <div ref={sectionRef} className="py-16 bg-blue-600 dark:bg-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-xl text-blue-100">
            Join the growing community transforming healthcare with AI
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {metrics.map((metric) => (
            <StatCard
              key={metric.metric_key}
              metric={metric}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ metric, isVisible }: { metric: TrustMetric; isVisible: boolean }) {
  const count = useCountUp(metric.metric_value, 2000, isVisible);
  const Icon = iconMap[metric.metric_key] || Activity;

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white/10 rounded-lg">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-white mb-2">
        {formatMetricValue(count, metric.display_format)}
      </div>
      <div className="text-sm md:text-base text-blue-100">
        {metric.metric_label}
      </div>
    </div>
  );
}
