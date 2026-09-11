import { Suspense } from 'react';
import SearchResultsContent from '@/components/search/SearchResultsContent';

export default function SearchPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
      <Suspense fallback={<div className="text-white">Loading intelligence...</div>}>
        <SearchResultsContent />
      </Suspense>
    </div>
  );
}
