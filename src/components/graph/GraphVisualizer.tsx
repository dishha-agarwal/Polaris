'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

// Group colors matching our Polaris theme
const GROUP_COLORS: Record<string, string> = {
  paper: '#38bdf8',       // ice-400
  dataset: '#10b981',     // emerald-500
  expedition: '#a78bfa',  // purple-400
  region: '#f472b6',      // pink-400
  station: '#fbbf24',     // amber-400
  topic: '#60a5fa',       // blue-400
  media: '#f87171'        // red-400
};

export default function GraphVisualizer({ data, onNodeClick }: { data: any, onNodeClick: (node: any) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const graphRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 

    const color = GROUP_COLORS[node.group] || '#e2e8f0';

    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; // polar-900 background
    ctx.beginPath();
    ctx.roundRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1], 4 / globalScale);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 / globalScale;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(label, node.x, node.y);

    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
  }, []);

  const nodePointerAreaPaint = useCallback((node: any, color: string, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = color;
    const bckgDimensions = node.__bckgDimensions;
    if (bckgDimensions) {
      ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
    } else {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[600px] rounded-2xl overflow-hidden glass-panel">
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
        nodeLabel="description"
        nodeCanvasObject={drawNode}
        nodePointerAreaPaint={nodePointerAreaPaint}
        onNodeClick={(node) => {
          // Center the view on the clicked node
          if (graphRef.current) {
            graphRef.current.centerAt(node.x, node.y, 1000);
            graphRef.current.zoom(1.5, 2000);
          }
          onNodeClick(node);
        }}
        linkColor={() => 'rgba(56, 189, 248, 0.2)'} // ice-400 with opacity
        linkWidth={1.5}
        backgroundColor="#0B1120" // polar-950
        cooldownTicks={100}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
