import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewsItem from '../NewsItem/NewsItem';
import './SearchResults.css';

const SearchResults = () => {
    const location = useLocation();
    const { query, searchResults = [] } = location.state || {};
    const navigate = useNavigate();

    const isSearchResultsArray = Array.isArray(searchResults);
    const goBack = () => {
        navigate(-1); // Перенаправлення назад
    };

    return (
        <div className="search-results-container">
            <h2 className="search-results-title">Результати пошуку для: "{query}"</h2>
            
            {isSearchResultsArray && searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                    <NewsItem 
                        key={index}
                        id={result.id}
                        title={result.title}
                        description={result.description}
                        imageUrl={result.imageUrl}
                        showImage={false}
                    />
                ))
            ) : (
                <div className="search-results-no-results">
                    Немає результатів для відображення.
                {/* <button onClick={goBack} className="custom-btn btn-7"><span>Назад</span></button> */}
                </div>
                
            )}
            <button onClick={goBack} className="custom-btn btn-7"><span>Назад</span></button>
        </div>
    );
};

export default SearchResults;
