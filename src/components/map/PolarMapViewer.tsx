'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
const customIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="width: 16px; height: 16px; background-color: #38bdf8; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(56,189,248,0.8);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const STATIONS = [
  { id: 'STAT-BHA', name: 'Bharati Station', coords: [-69.4068, 76.1953], type: 'Active Research Station', datasets: 86, expeditions: 24 },
  { id: 'STAT-MAI', name: 'Maitri Station', coords: [-70.7667, 11.7333], type: 'Active Research Station', datasets: 142, expeditions: 40 },
  { id: 'STAT-HIM', name: 'Himadri Station (Arctic)', coords: [78.9226, 11.9333], type: 'Active Research Station', datasets: 35, expeditions: 12 },
];

export default function PolarMapViewer() {
  return (
    <MapContainer 
      center={[-65, 45]} 
      zoom={3} 
      style={{ height: '100%', width: '100%', background: '#020813' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {STATIONS.map((station, idx) => (
        <div key={idx}>
          <Circle 
            center={station.coords as [number, number]} 
            pathOptions={{ color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.2 }} 
            radius={200000} 
          />
          <Marker position={station.coords as [number, number]} icon={customIcon}>
            <Popup className="polar-popup">
              <div className="font-sans min-w-[200px]">
                <h3 className="font-bold text-gray-900 mb-1">{station.name}</h3>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-3">{station.type}</p>
                <div className="grid grid-cols-2 gap-2 text-sm border-t pt-2">
                  <div>
                    <span className="block text-gray-500 text-xs">Expeditions</span>
                    <span className="font-medium text-gray-800 text-[10px]">See Graph</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Datasets</span>
                    <span className="font-medium text-gray-800 text-[10px]">See Graph</span>
                  </div>
                </div>
                <a href={`/graph?id=${station.id}`} className="block text-center w-full mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors">
                  Explore Connections
                </a>
              </div>
            </Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  );
}
