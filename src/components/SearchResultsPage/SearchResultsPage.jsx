import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchResult from "../SearchResult/SearchResult";

const SearchResultsPage = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('needle');
    if (query) {
      performSearch(query);
    }
  }, [location]);

  const performSearch = async (query) => {
    setIsSearching(true);
    try {
      const response = await fetch(`https://apinvmnt.site/api/search?needle=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data.data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div>
      {isSearching ? (
        <div className="loading">Пошук...</div>
      ) : (
        <SearchResult results={searchResults} />
      )}
    </div>
  );
};

export default SearchResultsPage;
