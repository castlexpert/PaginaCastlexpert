import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export default function LiveMetrics() {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/visits`, {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          setVisitCount(data.count);
        }
      } catch (error) {
        console.error('Error tracking visit:', error);
      } finally {
        setLoading(false);
      }
    };

    trackVisit();

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/visits`);
        if (response.ok) {
          const data = await response.json();
          setVisitCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching visit count:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <div className="relative px-6 py-4 rounded-xl bg-white/20 backdrop-blur-2xl border border-black/15 shadow-xl shadow-black/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-2xl border border-black/15 flex items-center justify-center">
            <Eye className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-wide">Visitas</p>
            <p className="text-2xl font-bold text-black">{loading ? '...' : visitCount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}





