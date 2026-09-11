import { ShieldCheck, Info } from 'lucide-react';

interface ProvenanceBadgeProps {
  status: 'verified' | 'pending' | 'rejected';
  count?: number;
}

export default function ProvenanceBadge({ status, count }: ProvenanceBadgeProps) {
  if (status === 'verified') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-aurora-green/10 border border-aurora-green/20 text-aurora-green">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-xs font-semibold tracking-wide uppercase">
          Evidence Backed {count ? `(${count} Sources)` : ''}
        </span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-polar-600/10 border border-polar-500/20 text-polar-400">
      <Info className="w-4 h-4" />
      <span className="text-xs font-semibold tracking-wide uppercase">Unverified</span>
    </div>
  );
}
