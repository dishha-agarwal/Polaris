import Link from 'next/link';
import { Search, Compass, Database, BookOpen, Network, Map, Image as ImageIcon } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 z-50 glass-panel border-b border-polar-300/10">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ice-400 to-polar-600 flex items-center justify-center shadow-lg shadow-polar-500/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">POLARIS</h1>
            <p className="text-[10px] uppercase tracking-wider text-polar-300 font-semibold">MoES Intelligence Layer</p>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/search" icon={<Search className="w-4 h-4" />} text="AI Explorer" />
          <NavLink href="/graph" icon={<Network className="w-4 h-4" />} text="Knowledge Graph" />
          <NavLink href="/map" icon={<Compass className="w-4 h-4" />} text="Polar Map" />
          <NavLink href="/expeditions" icon={<Map className="w-4 h-4" />} text="Expeditions" />
          <NavLink href="/datasets" icon={<Database className="w-4 h-4" />} text="Datasets" />
          <NavLink href="/media" icon={<ImageIcon className="w-4 h-4" />} text="Media" />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium transition-colors backdrop-blur-md">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-sm font-medium text-polar-200 hover:text-white transition-colors">
      {icon}
      <span>{text}</span>
    </Link>
  );
}
