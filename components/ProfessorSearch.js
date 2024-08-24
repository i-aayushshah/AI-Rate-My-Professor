import { useState } from 'react';
import { PineconeManager } from '../utils/api';
import ProfessorCard from './ProfessorCard';

export default function ProfessorSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const pineconeManager = new PineconeManager();
    const searchResults = await pineconeManager.search(query);
    setResults(searchResults);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for professors..."
          className="input-primary mr-2"
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((professor) => (
          <ProfessorCard key={professor.id} professor={professor} />
        ))}
      </div>
    </div>
  );
}
