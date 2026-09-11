'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Network as MediaIcon, Image as ImageIcon, Map, Database } from 'lucide-react';
import EntityDetailLayout from '@/components/explore/EntityDetailLayout';
import { getApiUrl } from '@/lib/api';

export default function MediaDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(getApiUrl(`/api/entities/${id}`));
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-polar-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!data) {
    return <div className="min-h-screen bg-polar-950 flex items-center justify-center text-white">Media not found in knowledge base.</div>;
  }

  const { entity, related } = data;
  
  const expeditions = related.filter((r: any) => r.type === 'expedition');
  const topics = related.filter((r: any) => r.type === 'topic');

  return (
    <EntityDetailLayout
      entity={entity}
      backUrl="/media"
      backLabel="Media Gallery"
      icon={MediaIcon}
      colorClass="text-red-400"
    >
      <div className="flex flex-col gap-8">
        {/* Large Media Preview */}
        <div className="w-full aspect-video bg-polar-900 rounded-3xl border border-polar-800 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
           <ImageIcon className="w-16 h-16 text-polar-700 mb-4 group-hover:scale-110 transition-transform duration-500" />
           <p className="text-polar-500 font-medium">Placeholder for: {entity.title}</p>
           {entity.metadata?.url && (
             <a href={entity.metadata.url} target="_blank" rel="noopener noreferrer" className="absolute bottom-6 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold transition-colors border border-white/10">
               Open Original Media
             </a>
           )}
        </div>

        {/* Relationships */}
        {(expeditions.length > 0 || topics.length > 0) && (
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-polar-800 pb-3">Related Context</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {expeditions.length > 0 && (
                 <div>
                   <h4 className="text-xs font-bold text-polar-500 uppercase tracking-widest mb-3">Expedition</h4>
                   {expeditions.map((e: any) => (
                     <div key={e.id} className="flex items-center gap-3 bg-polar-900 p-3 rounded-xl border border-polar-800">
                       <Map className="w-4 h-4 text-aurora-purple" />
                       <span className="text-sm font-medium text-polar-200">{e.title}</span>
                     </div>
                   ))}
                 </div>
               )}
               
               {topics.length > 0 && (
                 <div>
                   <h4 className="text-xs font-bold text-polar-500 uppercase tracking-widest mb-3">Topics</h4>
                   <div className="flex flex-wrap gap-2">
                     {topics.map((t: any) => (
                       <span key={t.id} className="px-3 py-1.5 rounded-lg bg-polar-800 text-polar-300 text-xs font-medium border border-polar-700">
                         {t.title}
                       </span>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </EntityDetailLayout>
  );
}
