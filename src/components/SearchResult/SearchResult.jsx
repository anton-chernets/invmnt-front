import React  from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SearchResult.css'

const SearchResults = ({ results }) => {
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/');
    };
    if (!results || results.length === 0) {
        return (
        <div className="search-results">Немає результатів пошуку.
        <button onClick={goHome} className="custom-btn btn-7"><span>Назад</span></button>
        </div>);
    };
    
    return (
        <div className="search-results">
            <ul>
                {results.map((result) => (
                    <li key={result.id}>
                        <Link to={result.details_uri}>{result.title}</Link>
                    </li>
                ))}
            </ul>
            <button onClick={goHome} className="custom-btn btn-7"><span>Назад</span></button>
        </div>
    );
};

export default SearchResults;
