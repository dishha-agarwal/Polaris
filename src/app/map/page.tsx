'use client';

import dynamic from 'next/dynamic';

const PolarMapViewer = dynamic(() => import('@/components/map/PolarMapViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-polar-900 rounded-2xl border border-polar-800 animate-pulse">
      <div className="text-polar-400 font-medium tracking-widest uppercase">Loading Polar Map...</div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Interactive Polar Map</h1>
        <p className="text-polar-300">
          Explore research locations, expeditions, and observations across Antarctica, the Arctic, and the Himalayas.
        </p>
      </div>
      
      <div className="flex-1 min-h-[600px] rounded-2xl overflow-hidden glass-panel border border-polar-800 shadow-2xl relative z-0">
        <PolarMapViewer />
      </div>
    </div>
  );
}
