import Link from 'next/link';
import { ArrowLeft, Network, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function EntityDetailLayout({
  entity,
  backUrl,
  backLabel,
  icon: Icon,
  colorClass,
  children
}: {
  entity: any;
  backUrl: string;
  backLabel: string;
  icon: any;
  colorClass: string;
  children: React.ReactNode;
}) {
  if (!entity) return null;

  return (
    <div className="min-h-screen bg-polar-950 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] bg-ice-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-8 md:py-12 z-10">
        <Link href={backUrl} className="inline-flex items-center gap-2 text-sm text-polar-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to {backLabel}
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Header section */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-64 h-64 opacity-10 blur-[80px] rounded-full ${colorClass.replace('text-', 'bg-')}`}></div>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl bg-polar-800 shadow-inner ${colorClass}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="text-sm font-bold text-polar-400 uppercase tracking-widest font-mono">{entity.id}</div>
                    <div className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold tracking-wider uppercase">
                      Demo / Mock Knowledge Record
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{entity.title}</h1>
                </div>
              </div>
              
              <div className="prose prose-polar prose-lg max-w-none text-polar-200 mb-8">
                <p>{entity.content}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 border-t border-polar-800/50 pt-6">
                <Link href={`/search?q=Tell me about ${encodeURIComponent(entity.title)}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-ice-500/20 to-polar-500/20 border border-ice-500/30 text-ice-300 font-semibold hover:bg-ice-500/30 transition-all">
                  <Sparkles className="w-4 h-4" /> Ask Polaris
                </Link>
                <Link href={`/graph?id=${entity.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-polar-800/80 border border-polar-700 text-polar-300 font-semibold hover:text-white hover:bg-polar-700 transition-all">
                  <Network className="w-4 h-4" /> Explore Connections
                </Link>
              </div>
            </div>
            
            {/* Page specific children content */}
            {children}
          </div>
          
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Metadata Sidebar */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-polar-400 uppercase tracking-wider border-b border-polar-800 pb-3 mb-4">Metadata</h3>
              <dl className="flex flex-col gap-4">
                {Object.entries(entity.metadata || {}).map(([key, val]) => (
                  key !== 'related_ids' && (
                    <div key={key}>
                      <dt className="text-xs text-polar-500 uppercase font-semibold mb-1">{key.replace('_', ' ')}</dt>
                      <dd className="text-sm font-medium text-polar-100 break-words">
                        {key === 'url' ? (
                          <div className="flex flex-col items-start gap-1">
                            <a href={val as string} target="_blank" rel="noopener noreferrer" className="text-ice-400 hover:underline">
                              {val as string}
                            </a>
                            <span className="text-[10px] text-orange-400 font-semibold bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">Demo / Placeholder</span>
                          </div>
                        ) : (
                          val as string
                        )}
                      </dd>
                    </div>
                  )
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
