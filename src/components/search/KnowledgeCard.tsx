import { Database, FileText, Image as ImageIcon, Video, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface KnowledgeCardProps {
  id: string;
  type: 'paper' | 'dataset' | 'image' | 'video' | string;
  title: string;
  metadata: Record<string, string>;
}

export default function KnowledgeCard({ id, type, title, metadata }: KnowledgeCardProps) {
  const Icon = {
    paper: FileText,
    dataset: Database,
    image: ImageIcon,
    video: Video,
  }[type] || FileText;

  const colors = {
    paper: 'text-ice-400 bg-ice-400/10 border-ice-400/20',
    dataset: 'text-aurora-green bg-aurora-green/10 border-aurora-green/20',
    image: 'text-ice-300 bg-ice-300/10 border-ice-300/20',
    video: 'text-aurora-purple bg-aurora-purple/10 border-aurora-purple/20',
  }[type] || 'text-polar-400 bg-polar-400/10 border-polar-400/20';

  let url = metadata.url || "#";
  let target: string | undefined = url !== "#" ? "_blank" : undefined;

  // Instead of opening mock external URLs, route the user to the internal detail pages!
  if (['dataset', 'media', 'expedition'].includes(type) && id) {
    url = `/${type === 'media' ? 'media' : type + 's'}/${id}`;
    target = undefined;
  } else if (id) {
    url = `/graph?id=${id}`;
    target = undefined;
  }

  return (
    <Link href={url} target={target} className="block group">
      <div className="glass-panel-hover rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg border flex-shrink-0 transition-colors ${colors}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium mb-2 group-hover:text-ice-300 transition-colors line-clamp-2">
              {title}
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {Object.entries(metadata).map(([key, value]) => {
                if (key === "url" || key === "related_ids") return null;
                return (
                  <div key={key} className="flex items-center text-xs text-polar-400">
                    <span className="uppercase tracking-wider font-semibold opacity-70 mr-1">{key}:</span>
                    <span>{value}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between w-full mt-3">
              <span className="text-[10px] text-orange-400 font-semibold bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">Demo Record</span>
              <span className={`text-xs font-semibold ${colors.split(' ')[0]} group-hover:translate-x-1 transition-transform flex items-center gap-1`}>
                Explore <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-polar-600 group-hover:text-polar-300 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
