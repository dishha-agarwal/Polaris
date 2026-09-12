'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Network, Database, Map, Beaker, FileText, Globe, Box, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getApiUrl } from '@/lib/api';

// Dynamic import with SSR disabled for the canvas graph
const GraphVisualizer = dynamic(() => import('@/components/graph/GraphVisualizer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] rounded-2xl glass-panel flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <Network className="w-12 h-12 text-ice-400 opacity-50" />
        <p className="text-polar-400 font-medium">Initializing Neural Graph...</p>
      </div>
    </div>
  )
});

const TYPE_ICONS: Record<string, any> = {
  paper: FileText,
  dataset: Database,
  expedition: Map,
  region: Globe,
  station: Box,
  topic: Beaker,
  media: Network
};

export default function KnowledgeGraphPage() {
  const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchGraphData(activeFilter);
  }, [activeFilter]);

  const fetchGraphData = async (type: string | null) => {
    setLoading(true);
    try {
      const url = type ? getApiUrl(`/api/knowledge-graph?type=${type}`) : getApiUrl('/api/knowledge-graph');
      const res = await fetch(url);
      const data = await res.json();
      setGraphData({
        nodes: data.nodes || [],
        links: data.edges || [] // ForceGraph2D strictly requires 'links', not 'edges'
      });
    } catch (error) {
      console.error("Error fetching graph data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  return (
    <div className="min-h-screen bg-polar-950 flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-ice-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-aurora-purple/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-8 md:py-12 flex flex-col gap-8 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Polar Knowledge Graph</h1>
            <p className="text-polar-300 max-w-2xl">
              Explore the interconnected web of polar research, datasets, expeditions, and observation stations.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-polar-400 mr-2" />
            {['All', 'paper', 'dataset', 'expedition', 'station', 'region'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter === 'All' ? null : filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  (filter === 'All' && activeFilter === null) || filter === activeFilter
                    ? 'bg-ice-400/20 text-ice-400 border border-ice-400/50'
                    : 'bg-polar-800 text-polar-400 border border-polar-700 hover:bg-polar-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full flex-1">
          <div className="lg:col-span-3 min-h-[600px] rounded-2xl relative">
            {loading ? (
              <div className="w-full h-full min-h-[600px] rounded-2xl glass-panel flex items-center justify-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ice-400"></div>
              </div>
            ) : (
              <GraphVisualizer data={graphData} onNodeClick={handleNodeClick} />
            )}
            
            {/* Legend overlay */}
            <div className="absolute bottom-4 left-4 glass-panel p-3 rounded-xl flex items-center gap-4 text-xs font-medium text-polar-300">
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#38bdf8]"></div> Paper</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981]"></div> Dataset</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#a78bfa]"></div> Expedition</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#fbbf24]"></div> Station</div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-2xl h-full min-h-[600px]">
              {selectedNode ? (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="flex items-start gap-4 pb-6 border-b border-polar-800">
                    <div className="p-3 bg-polar-800 rounded-xl text-ice-400">
                      {TYPE_ICONS[selectedNode.group] ? (
                        <div className="w-6 h-6">{TYPE_ICONS[selectedNode.group]({})}</div>
                      ) : (
                        <Network className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-polar-400 uppercase tracking-wider mb-1">
                        {selectedNode.group}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {selectedNode.label}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm prose-invert prose-polar">
                    <p>{selectedNode.description || 'No description available for this entity.'}</p>
                  </div>
                  
                  {selectedNode.url && selectedNode.url !== '#' && (
                    <a 
                      href={selectedNode.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-auto block w-full py-3 px-4 bg-gradient-to-r from-ice-400/20 to-polar-500/20 border border-ice-400/30 rounded-xl text-center text-ice-300 font-semibold hover:bg-ice-400/30 transition-colors"
                    >
                      View Source Details ↗
                    </a>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-polar-400 opacity-60">
                  <Network className="w-12 h-12" />
                  <p>Select a node on the graph to view its metadata and connections.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
