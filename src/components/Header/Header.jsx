import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/Untitled.png';
import { AuthContext } from "../AuthContext/AuthContext";
import Ticker from "../Ticker/Ticker";


const Header = ( ) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, setIsAuthenticated, isAdmin, isUser } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    
    const [isLoadingRates] = useState(false);
    
    const [isLoading] = useState(false);
    const [error] = useState(null);
    
    const [query, setQuery] = useState('');
    // const [searchResults, setSearchResults] = useState([]);
    const [isSearching] = useState(false);

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
    };
    

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?needle=${encodeURIComponent(query)}`);
      };
    

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate('/');
        window.location.reload();
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

    return (
        <header className="header">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
            <div className="header-top">
                    
                    <button onClick={toggleMenu} className="button-menu">
                        <i className="fas fa-bars"></i> Меню
                    </button>
                    <nav className={`header-nav ${isMenuOpen ? 'active' : 'menu'}`}>
                        <button onClick={toggleMenu} className="button-menu">
                            <i className="fas fa-bars"></i> Меню
                        </button>
                        <Link to="/" onClick={toggleMenu}><i className="fas fa-home"></i> Головна</Link>
                        <Link to="/shop" onClick={toggleMenu}>Магазин</Link>
                        {/* ...інші посилання */}
                    </nav>
                    
                    
            </div>
            <div className="header-bottom">
                
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
                        <button type="submit" className="custom-btn btn-7">
                            <span><i className="fas fa-search"></i></span>
                        </button>
                    </form>
                    <div className='header-controls'>
                        {shouldShowAuthButtons() && (
                            <>
                                <button className="custom-btn btn-7" onClick={goToLogin}><span>Вхід</span></button>
                                <button className="custom-btn btn-7" onClick={goToRegister}><span>Зареєструватися</span></button>
                            </>
                        )}
                        {isAuthenticated && isAdmin && (
                            <>
                                <button className="custom-btn btn-7" onClick={goToAdmin}><span>Admin</span></button>
                                <button className="custom-btn btn-7" onClick={goToUserProfile}><span>Кабінет</span></button>
                                <button className="custom-btn btn-7" onClick={handleLogout}><span>Вийти</span></button>

                                
                            </>
                        )}
                        {isAuthenticated && isUser && (
                            <>
                                <button className="custom-btn btn-7" onClick={goToUserProfile}><span>Кабінет</span></button>
                                <button className="custom-btn btn-7" onClick={handleLogout}><span>Вийти</span></button>
                            </>
                        )}
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
                    )}
                </div>
            )}

            {isSearching && <div className="loading">Поиск...</div>}
        </header>
    );
};

export default Header;
