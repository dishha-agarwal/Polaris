import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function EntityCard({ 
  entity, 
  baseUrl, 
  icon: Icon,
  colorClass 
}: { 
  entity: any; 
  baseUrl: string;
  icon: any;
  colorClass: string;
}) {
  return (
    <Link href={`${baseUrl}/${entity.id}`} className="block group h-full">
      <div className="glass-panel-hover p-6 rounded-2xl flex flex-col h-full relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full ${colorClass.replace('text-', 'bg-')}`}></div>
        
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-polar-800 ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          {entity.metadata?.year ? (
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold tracking-wider uppercase">Demo</div>
              <div className="px-3 py-1 rounded-full bg-polar-800/50 text-polar-300 text-xs font-bold border border-polar-700">
                {entity.metadata.year}
              </div>
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold tracking-wider uppercase">Demo</div>
          )}
        </div>
        
        <div className="mb-2">
          <div className="text-xs font-mono text-polar-400 mb-1">{entity.id}</div>
          <h3 className="text-lg font-bold text-white group-hover:text-ice-300 transition-colors line-clamp-2">
            {entity.title}
          </h3>
        </div>
        
        <p className="text-sm text-polar-300 line-clamp-3 mb-6 flex-1">
          {entity.content}
        </p>
        
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-polar-800/50">
          <span className="text-sm font-semibold text-ice-400 group-hover:text-white transition-colors">Explore</span>
          <ArrowRight className="w-4 h-4 text-ice-400 group-hover:text-white transition-colors group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
