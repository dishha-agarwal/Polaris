'use client';

import { useState } from 'react';
import { Search, Sparkles, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SUGGESTIONS = [
  "What has India discovered about Antarctic sea ice?",
  "Show datasets related to Arctic climate observations.",
  "Which Indian expeditions studied Antarctic microorganisms?",
  "Explain India's polar research to a Class 10 student."
];

export default function AISearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full relative">
      <form 
        onSubmit={handleSearch}
        className={`relative w-full rounded-2xl glass-panel overflow-hidden transition-all duration-300 ${isFocused ? 'ring-2 ring-polar-400 shadow-[0_0_40px_-10px_rgba(74,156,245,0.4)]' : ''}`}
      >
        <div className="flex items-center px-6 py-4">
          <Sparkles className="w-6 h-6 text-polar-400 mr-4 flex-shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent text-white text-lg md:text-xl placeholder:text-polar-400/60 outline-none"
            placeholder="Ask anything about India's polar research..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <button 
            type="submit"
            className="ml-4 p-3 rounded-xl bg-gradient-to-r from-polar-500 to-ice-400 hover:opacity-90 text-white shadow-lg transition-opacity flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
      
      {/* Suggestions Box */}
      <div className={`absolute top-full left-0 right-0 mt-4 p-6 rounded-2xl glass-panel transition-all duration-300 transform origin-top ${isFocused && !query ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-polar-400 mb-4">Suggested Queries</p>
        <div className="flex flex-col gap-3">
          {SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              className="flex items-center text-left text-polar-200 hover:text-white hover:bg-polar-800/50 p-2 rounded-lg transition-colors text-sm"
              onMouseDown={() => {
                setQuery(suggestion);
                router.push(`/search?q=${encodeURIComponent(suggestion)}`);
              }}
            >
              <Search className="w-4 h-4 mr-3 text-polar-500" />
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
