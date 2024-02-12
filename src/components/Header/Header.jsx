import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/Untitled.png';
import { AuthContext } from "../AuthContext/AuthContext";
import Ticker from "../Ticker/Ticker";

const useFetchSearchResults = (query, setResults) => {
    useEffect(() => {
        if (query.length > 2) {
            (async () => {
                try {
                    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setResults(data.length ? data : 'No results found.');
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setResults('Error during fetch.');
                }
            })();
        }
    }, [query, setResults]);
};

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, setIsAuthenticated, isAdmin, isUser } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoadingRates] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading] = useState(false);
    const [error] = useState(null);
    useFetchSearchResults(query, setSearchResults, setIsSearching);



    const handleSearchChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate('/');
    };

    const hideAuthButtonsPaths = ['/login', '/register', '/passwordreset'];

    const shouldShowAuthButtons = () => {
        return !isAuthenticated && !hideAuthButtonsPaths.includes(location.pathname);
    };

    const goToUserProfile = () => {
        navigate('/user');
    };

    const goToLogin = () => {
        navigate('/login');
    };

    const goToRegister = () => {
        navigate('/register');
    };
    const goToAdmin = () => {
        navigate('/admin');
    }
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate('/search', { state: { query, searchResults } });
    };

    return (
        <header className="header">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
            <div className="header-top">
                <div className="wrap">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={toggleMenu} className="button-menu">
                        <i className="fas fa-bars"></i> Меню
                    </a>
                    <nav className={`header-nav ${isMenuOpen ? 'active' : 'menu'}`}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a onClick={toggleMenu} className="button-menu">
                            <i className="fas fa-bars"></i> Меню
                        </a>
                        {/* The button inside here is removed, assuming it's redundant. */}
                        <Link to="/" onClick={toggleMenu}><i className="fas fa-home"></i> Головна</Link>
                        <Link to="/shop" onClick={toggleMenu}>Магазин</Link>
                        {/* ...інші посилання */}
                    </nav>
                </div>
            </div>
            <div className="header-bottom">
                <div className="wrap">
                <div className="header-logo">
                        <Link to="/">
                            <img src={logoImage} alt="Investment"/><b>Investment</b>
                        </Link>
                    </div>
                    <form onSubmit={handleSearchSubmit} className="search-form">
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearchChange}
                            placeholder="Пошук..."
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                    <div className='header-controls'>
                        {shouldShowAuthButtons() && (
                            <>
                                <button onClick={goToLogin} className="button">Вхід</button>
                                <button onClick={goToRegister} className="button">Зареєструватися</button>
                            </>
                        )}
                        {isAuthenticated && isAdmin && (
                            <>
                                <button onClick={goToAdmin} className="button">Admin</button>
                                <button onClick={goToUserProfile} className="button">Кабінет</button>
                                <button onClick={handleLogout} className="button">Вийти</button>
                            </>
                        )}
                        {isAuthenticated && isUser && (
                            <>
                                <button onClick={goToUserProfile} className="button">Кабінет</button>
                                <button onClick={handleLogout} className="button">Вийти</button>
                            </>
                        )}

                        {/*{isAuthenticated && <button onClick={handleLogout}>Logout</button>}*/}
                    </div>
                </div>{isLoadingRates ? (
                <div className="loading">Загрузка курсов...</div>
            ) : (
                <div className='ticker-wrap'>
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <Ticker />
                        // <div className="ticker">
                        //     {Object.entries(rates).map(([key, value]) => (
                        //         <div key={key} className="crypto-rate">
                        //             <h2>{key}</h2>
                        //             <p>{value.UAH} UAH</p>
                        //         </div>
                        //     ))}
                        // </div>
                    )}
                </div>
            )}
            </div>

            {isSearching && <div className="loading">Поиск...</div>}
        </header>
    );
};

export default Header;
