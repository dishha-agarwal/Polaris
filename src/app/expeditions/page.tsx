'use client';

import { useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EntityCard from '@/components/explore/EntityCard';
import { getApiUrl } from '@/lib/api';

export default function ExpeditionsPage() {
  const [expeditions, setExpeditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpeditions = async () => {
      try {
        const res = await fetch(getApiUrl('/api/entities?type=expedition'));
        const data = await res.json();
        setExpeditions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchExpeditions();
  }, []);

  return (
    <div className="min-h-screen bg-polar-950 flex flex-col relative overflow-hidden">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-aurora-purple mb-2">
              <Map className="w-6 h-6" />
              <h2 className="text-sm font-bold uppercase tracking-widest">Explore</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Scientific Expeditions</h1>
            <p className="text-polar-300 max-w-2xl mt-4 text-lg">
              Discover the history, objectives, and findings of India's polar research expeditions.
            </p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full">
            <span className="text-xs font-bold text-polar-500 uppercase mr-2">Filter:</span>
            {['All', 'Antarctica', 'Arctic', 'Himalayas'].map(f => (
              <button key={f} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${f === 'All' ? 'bg-aurora-purple/20 text-aurora-purple border border-aurora-purple/50' : 'bg-polar-800 text-polar-400 border border-polar-700 hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 glass-panel rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expeditions.map(exp => (
              <EntityCard 
                key={exp.id} 
                entity={exp} 
                baseUrl="/expeditions" 
                icon={Map} 
                colorClass="text-aurora-purple"
              />
            ))}
            {expeditions.length === 0 && (
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
