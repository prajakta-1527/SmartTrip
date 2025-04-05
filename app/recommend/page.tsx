'use client';

import { useState } from 'react';
import axios from 'axios';

export default function GeoapifyModal() {
  const [searchParams, setSearchParams] = useState({
    query: '',
    categories: 'tourism',
    limit: 5,
  });
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/geoapify', {
        params: searchParams,
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="geoapify-modal">
      <h3>Find Recommended Places</h3>
      
      <div>
        <label>Search Query:</label>
        <input
          type="text"
          value={searchParams.query}
          onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
        />
      </div>

      <div>
        <label>Categories:</label>
        <select
          value={searchParams.categories}
          onChange={(e) => setSearchParams({ ...searchParams, categories: e.target.value })}
        >
          <option value="tourism">Tourist Spots</option>
          <option value="catering">Restaurants</option>
          <option value="accommodation">Hotels</option>
        </select>
      </div>

      <button onClick={handleSearch}>Search</button>

      <div className="results">
        {results.map((place, index) => (
          <div key={index}>
            <h4>{place.name}</h4>
            <p>{place.address}</p>
            <p>Category: {place.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
