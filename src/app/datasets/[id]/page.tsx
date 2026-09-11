'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Database, Map, Network as MediaIcon, FileText } from 'lucide-react';
import EntityDetailLayout from '@/components/explore/EntityDetailLayout';
import { getApiUrl } from '@/lib/api';

export default function DatasetDetailPage() {
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
    return <div className="min-h-screen bg-polar-950 flex items-center justify-center text-white">Dataset not found in knowledge base.</div>;
  }

  const { entity, related } = data;
  
  const expeditions = related.filter((r: any) => r.type === 'expedition');
  const regions = related.filter((r: any) => r.type === 'region');
  const topics = related.filter((r: any) => r.type === 'topic');

  return (
    <EntityDetailLayout
      entity={entity}
      backUrl="/datasets"
      backLabel="Datasets"
      icon={Database}
      colorClass="text-emerald-500"
    >
      <div className="flex flex-col gap-8">
        {/* Coverage & Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {regions.length > 0 && (
             <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
               <h4 className="text-xs font-bold text-polar-500 uppercase tracking-widest mb-1">Spatial Coverage</h4>
               <p className="text-lg font-semibold text-polar-100">{regions.map((r: any) => r.title).join(', ')}</p>
             </div>
           )}
           {entity.metadata?.year && (
             <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-ice-400">
               <h4 className="text-xs font-bold text-polar-500 uppercase tracking-widest mb-1">Temporal Coverage</h4>
               <p className="text-lg font-semibold text-polar-100">{entity.metadata.year}</p>
             </div>
           )}
        </div>

        {/* Scientific Info */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4 border-b border-polar-800 pb-3">Scientific Information</h3>
          <div className="flex flex-wrap gap-4">
            {topics.length > 0 ? topics.map((t: any) => (
              <span key={t.id} className="px-3 py-1.5 rounded-lg bg-polar-800 text-polar-300 text-sm font-medium border border-polar-700">
                {t.title}
              </span>
            )) : (
              <span className="text-polar-400 italic text-sm">No specific topics defined.</span>
            )}
          </div>
        </div>

        {/* Relationships */}
        {expeditions.length > 0 && (
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-polar-800 pb-3">Related Expeditions</h3>
            <div className="flex flex-col gap-3">
              {expeditions.map((e: any) => (
                <div key={e.id} className="p-4 rounded-xl bg-polar-900 border border-polar-800 flex items-center gap-4">
                   <Map className="w-5 h-5 text-aurora-purple" />
                   <div>
                     <h4 className="font-bold text-white">{e.title}</h4>
                     <p className="text-xs text-polar-400">{e.id}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </EntityDetailLayout>
  );
}
