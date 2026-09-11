import { Search, Map, Database, ArrowRight, Sparkles } from 'lucide-react';
import AISearchBar from '@/components/home/AISearchBar';
import QuickAccessCard from '@/components/home/QuickAccessCard';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-6 py-12 md:py-24">
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center text-center animate-fade-in-up mt-12 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-polar-400/20 text-polar-300 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4 text-ice-400" />
          <span>India's Semantic Polar Knowledge Engine</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-ice-200 to-polar-300 mb-6 drop-shadow-sm">
          Explore India's Polar<br className="hidden md:block" /> Knowledge with AI
        </h1>
        
        <p className="text-lg md:text-xl text-polar-300 max-w-3xl mb-12 leading-relaxed">
          Search across scientific publications, expedition reports, datasets, images, and videos through one intelligent, trusted interface.
        </p>

        {/* AI Search Bar Component */}
        <div className="w-full max-w-4xl relative z-10">
          <AISearchBar />
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <QuickAccessCard 
          title="Knowledge Graph" 
          description="Explore interconnected research, stations, and findings."
          icon={<Search className="w-6 h-6 text-ice-400" />}
          href="/graph"
        />
        <QuickAccessCard 
          title="Explore Datasets" 
          description="Interact with temperature, ice-core, and observation data."
          icon={<Database className="w-6 h-6 text-aurora-green" />}
          href="/datasets"
        />
        <QuickAccessCard 
          title="Explore Expeditions" 
          description="Discover missions from Maitri to Bharati and the Arctic."
          icon={<ArrowRight className="w-6 h-6 text-polar-300" />}
          href="/expeditions"
        />
        <QuickAccessCard 
          title="Explore Polar Map" 
          description="Visualize research locations and dataset origins on an interactive 3D map."
          icon={<Map className="w-6 h-6 text-aurora-purple" />}
          href="/map"
        />
      </div>
    </div>
  );
}
