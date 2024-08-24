// pages/search.js
import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import ProfessorCard from '../components/ProfessorCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      console.log('Search query:', query);

      const response = await fetch(`/api/professors?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      console.log('Search results:', data);

      setResults(data);
    } catch (error) {
      console.error('Error searching professors:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Search Professors</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex rounded-md shadow-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for a professor or university"
          />
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <SearchIcon className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((professor) => (
          <ProfessorCard key={professor.id} professor={professor} />
        ))}
      </div>
    </div>
  );
}
