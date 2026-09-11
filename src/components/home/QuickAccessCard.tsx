import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export default function QuickAccessCard({ title, description, icon, href }: QuickAccessCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <div className="h-full p-6 rounded-2xl glass-panel-hover flex flex-col items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
        
        <div className="p-3 rounded-xl bg-polar-900/50 border border-polar-400/10 mb-5 text-ice-300">
          {icon}
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-polar-300 leading-relaxed mb-6 flex-1">
          {description}
        </p>
        
        <div className="flex items-center text-ice-400 text-sm font-semibold mt-auto group-hover:translate-x-1 transition-transform">
          Explore <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );
}
