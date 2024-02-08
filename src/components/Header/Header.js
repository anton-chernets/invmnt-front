import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/Untitled.png';
import { AuthContext } from "../AuthContext/AuthContext";
// import axios from 'axios';
import Ticker from "../Ticker/Ticker";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoadingRates] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    // const [rates, setRates] = useState([]);
    const [isLoading] = useState(false);
    const [error] = useState(null);


    // Функция для проверки, является ли пользователь администратором
    const isAdmin = user && user.roles.includes('Admin');



    // useEffect(() => {
    //     const fetchData = async () => {  // Объявляем асинхронную функцию внутри useEffect
    //         setIsLoading(true);
    //         const API_KEY = '89477152f7a313f13d6ddb636a5f04d247904bdb1d77162546010c3cecadb2d1'; // Замените на ваш ключ API
    //         const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,USD,EUR,GBP,JPY,CAD,AUD,CHF,CNY,SEK,NZD,ETH,LTC,XRP,BCH,ADA,DOT,XLM,LINK,DOGE,UNI,BSV,EOS,XMR,XTZ&tsyms=UAH`;
    //
    //
    //         try {
    //             const response = await axios.get(url, {
    //                 headers: { 'Api-Key': API_KEY },
    //             });
    //             if (response.status === 200) {
    //                 setRates(response.data);
    //             } else {
    //                 throw new Error('Error fetching data');
    //             }
    //         } catch (error) {
    //             setError(error.message);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //
    //     fetchData();  // Вызываем асинхронную функцию
    // }, []);

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
        navigate('/admin')
    }

    const handleSearchChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        if (newQuery.length > 2) {
            fetchSearchResults(newQuery);
        } else {
            setSearchResults([]);
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchSearchResults(query);
        navigate('/search', { state: { query, searchResults } });
    };

    const fetchSearchResults = async (query) => {
        setIsSearching(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <header className="header">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
            <div className="header-top">
                <div className="wrap">
                    <button onClick={toggleMenu} className="button-menu">
                        <i className="fas fa-bars"></i> Меню
                    </button>
                    <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
                        <button onClick={toggleMenu} className="button-menu">
                            <i className="fas fa-bars"></i> Меню
                        </button>
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
                            <img src={logoImage} alt="Investment" /><b>Investment</b>
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
                        {isAuthenticated && (
                            <>
                                {isAdmin && <button onClick={goToAdmin} className="button">Admin</button>}
                                <button onClick={goToUserProfile} className="button">Кабінет</button>
                                <button onClick={handleLogout} className="button">Вийти</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {isLoadingRates ? (
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
            {isSearching && <div className="loading">Поиск...</div>}
        </header>
    );
};

export default Header;
