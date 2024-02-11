import React from 'react';
import { useLocation } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
    const location = useLocation();
    const { query, searchResults } = location.state || { query: '', searchResults: [] };

    return (
        <div className="search-results-container">
            <h2 className="search-results-title">Результати пошуку для: "{query}"</h2>
            <ul className="search-results-list">
                {searchResults.map((result, index) => (
                    <li key={index} className="search-results-list-item">
                        <a href={result.url} className="search-results-list-item-title">{result.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;