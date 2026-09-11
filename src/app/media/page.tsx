'use client';

import { useState, useEffect } from 'react';
import { Network as MediaIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EntityCard from '@/components/explore/EntityCard';
import { getApiUrl } from '@/lib/api';

export default function MediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch(getApiUrl('/api/entities?type=media'));
        const data = await res.json();
        setMedia(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  return (
    <div className="min-h-screen bg-polar-950 flex flex-col relative overflow-hidden">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12 z-10">
        <div className="flex flex-col gap-2 mb-12">
          <div className="flex items-center gap-3 text-red-400 mb-2">
            <MediaIcon className="w-6 h-6" />
            <h2 className="text-sm font-bold uppercase tracking-widest">Explore</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Media Gallery</h1>
          <p className="text-polar-300 max-w-2xl mt-4 text-lg">
            Browse expedition photographs, scientific visualizations, and research station imagery.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 glass-panel rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map(item => (
              <EntityCard 
                key={item.id} 
                entity={item} 
                baseUrl="/media" 
                icon={MediaIcon} 
                colorClass="text-red-400"
              />
            ))}
            {media.length === 0 && (
              <div className="col-span-full py-12 text-center text-polar-400 glass-panel rounded-2xl">
                Information not available in the current knowledge base.
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
