'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Map, Box, FileText, Database, Network as MediaIcon } from 'lucide-react';
import EntityDetailLayout from '@/components/explore/EntityDetailLayout';
import { getApiUrl } from '@/lib/api';
import dynamic from 'next/dynamic';

const PolarMapViewer = dynamic(() => import('@/components/map/PolarMapViewer'), { ssr: false });

export default function ExpeditionDetailPage() {
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
    return <div className="min-h-screen bg-polar-950 flex items-center justify-center text-white">Expedition not found in knowledge base.</div>;
  }

  const { entity, related } = data;
  
  // Categorize related items
  const stations = related.filter((r: any) => r.type === 'station');
  const papers = related.filter((r: any) => r.type === 'paper');
  const datasets = related.filter((r: any) => r.type === 'dataset');
  const media = related.filter((r: any) => r.type === 'media');

  return (
    <EntityDetailLayout
      entity={entity}
      backUrl="/expeditions"
      backLabel="Expeditions"
      icon={Map}
      colorClass="text-aurora-purple"
    >
      {/* Specific Expedition Content */}
      <div className="flex flex-col gap-8">
        {stations.length > 0 && (
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-polar-800 pb-3">
              <Box className="w-5 h-5 text-polar-400" />
              <h3 className="text-lg font-bold text-white">Connected Stations</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stations.map((s: any) => (
                <div key={s.id} className="p-4 rounded-xl bg-polar-900 border border-polar-800">
                  <h4 className="font-bold text-white mb-1">{s.title}</h4>
                  <p className="text-sm text-polar-400">{s.content}</p>
                </div>
              ))}
            </div>
            {/* Simple Map Embed */}
            <div className="mt-6 h-[300px] rounded-xl overflow-hidden border border-polar-800">
               <PolarMapViewer />
            </div>
          </div>
        )}

        {(papers.length > 0 || datasets.length > 0) && (
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-polar-800 pb-3">Scientific Outputs</h3>
            <div className="flex flex-col gap-4">
              {papers.map((p: any) => (
                <div key={p.id} className="flex gap-3 p-3 rounded-xl bg-polar-900/50 hover:bg-polar-800/50 transition-colors border border-polar-800/50">
                  <FileText className="w-5 h-5 text-ice-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-polar-100">{p.title}</h4>
                    <p className="text-xs text-polar-400 font-mono mt-1">{p.id}</p>
                  </div>
                </div>
              ))}
              {datasets.map((d: any) => (
                <div key={d.id} className="flex gap-3 p-3 rounded-xl bg-polar-900/50 hover:bg-polar-800/50 transition-colors border border-polar-800/50">
                  <Database className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-polar-100">{d.title}</h4>
                    <p className="text-xs text-polar-400 font-mono mt-1">{d.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {media.length > 0 && (
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-polar-800 pb-3">
              <MediaIcon className="w-5 h-5 text-polar-400" />
              <h3 className="text-lg font-bold text-white">Media Assets</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {media.map((m: any) => (
                <div key={m.id} className="aspect-video bg-polar-800 rounded-xl flex items-center justify-center text-polar-500 border border-polar-700 relative overflow-hidden group">
                   {/* Placeholder for media */}
                   <span className="text-xs font-semibold z-10 group-hover:opacity-0 transition-opacity">{m.title}</span>
                   <div className="absolute inset-0 bg-gradient-to-t from-polar-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                     <span className="text-xs text-white">View Media</span>
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
