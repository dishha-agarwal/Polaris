'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Database, FileText, Image as ImageIcon, Video, BookOpen, GraduationCap, Users, Camera, Filter } from 'lucide-react';
import KnowledgeCard from './KnowledgeCard';
import ProvenanceBadge from './ProvenanceBadge';
import { getApiUrl } from '@/lib/api';

const AUDIENCES = [
  { id: 'researcher', label: 'Researcher', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'student', label: 'Student', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'public', label: 'Public', icon: <Users className="w-4 h-4" /> },
  { id: 'media', label: 'Media', icon: <Camera className="w-4 h-4" /> },
];

export default function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'Antarctic sea-ice variability and climate impact';
  const [audience, setAudience] = useState('student');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(getApiUrl(`/api/search?q=${encodeURIComponent(query)}&audience=${audience}`));
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query, audience]);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-polar-800">
        <div className="flex-1">
          <h2 className="text-xl text-polar-300 font-medium mb-2">AI Knowledge Results for:</h2>
          <h1 className="text-3xl font-bold text-white">{query}</h1>
        </div>
        
        {/* Audience Toggle Segmented Control */}
        <div className="glass-panel p-1 rounded-xl flex items-center bg-polar-900/60 border border-polar-700/50 shadow-inner">
          {AUDIENCES.map((a) => (
            <button
              key={a.id}
              onClick={() => setAudience(a.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-out whitespace-nowrap ${
                audience === a.id 
                  ? 'bg-polar-800 text-ice-300 shadow-md border border-polar-700/50 scale-[1.02]' 
                  : 'text-polar-400 hover:text-polar-200 hover:bg-polar-800/30 border border-transparent'
              }`}
            >
              <span className={`${audience === a.id ? 'text-ice-400' : 'text-polar-500'}`}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI Answer & Provenance */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-8 relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ice-400/5 blur-[100px] pointer-events-none rounded-full" />
            
            <div className="flex items-center gap-3 mb-6 border-b border-polar-800/50 pb-4">
              <div className="p-2 rounded-lg bg-polar-800 text-ice-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide">AI SUMMARY</h3>
              <div className="ml-auto flex items-center gap-3">
                {data?.confidence && (
                  <div className="px-3 py-1.5 rounded-full bg-polar-800/80 border border-polar-700/50 text-polar-300 text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5">
                    Confidence: <span className="text-white">{data.confidence}</span>
                  </div>
                )}
                <ProvenanceBadge status="verified" count={data?.sources?.length || 0} />
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-4 bg-polar-800 rounded w-3/4"></div>
                <div className="h-4 bg-polar-800 rounded w-full"></div>
                <div className="h-4 bg-polar-800 rounded w-5/6"></div>
              </div>
            ) : (
              <>
                <div className="prose prose-invert prose-polar max-w-none mb-8">
                  <p className="text-polar-100 leading-relaxed text-lg whitespace-pre-wrap">
                    {data?.summary || "No response generated."}
                  </p>
                </div>

                {/* Evidence & Sources */}
                {data?.sources && data.sources.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-polar-800">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-polar-400 mb-4">Scientific Evidence & Provenance</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.sources.map((source: any, idx: number) => (
                        <SourceLink key={idx} type={source.type as any} title={source.title} id={source.id} url={source.url} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Column: Connected Knowledge */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-5 h-5 text-polar-400" />
            <h3 className="text-lg font-bold text-white">Related Knowledge</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="animate-pulse h-24 bg-polar-800 rounded-xl w-full"></div>
            ) : data?.related_knowledge?.map((item: any, idx: number) => (
              <KnowledgeCard 
                key={idx}
                id={item.id}
                type={item.type as any}
                title={item.title}
                metadata={item.metadata}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceLink({ type, title, id, url }: { type: 'paper' | 'dataset' | 'report', title: string, id: string, url?: string }) {
  const Icon = type === 'paper' ? FileText : type === 'dataset' ? Database : BookOpen;
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-polar-900/40 border border-polar-800 hover:border-ice-400/50 hover:bg-polar-800/60 transition-colors group">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-polar-800 text-polar-300 group-hover:text-ice-400 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-polar-100 group-hover:text-white line-clamp-2 leading-snug">{title}</p>
          <p className="text-xs text-polar-400 mt-2 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-aurora-green" /> {id}
          </p>
        </div>
      </div>
      {url && url !== "#" ? (
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-orange-400 font-semibold bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">Demo Source</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-ice-400 font-semibold hover:text-ice-300 hover:underline flex items-center">
            View Source ↗
          </a>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-orange-400 font-semibold bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">Demo Record</span>
          <span className="text-xs text-polar-500 font-semibold flex items-center">
            View Source ↗
          </span>
        </div>
      )}
    </div>
  );
}
