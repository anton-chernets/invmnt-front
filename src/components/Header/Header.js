import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/Untitled.png';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isAdmin, setIsAdmin] = useState(true);

    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            setIsLoggedIn(true);

            fetch('https://example.com/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch user profile');
                    }
                    return response.json();
                })
                .then(profile => {
                    if (profile.role === 'admin') {
                        setIsAdmin(true);
                    }
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                });
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('/');
    };

    const hideAuthButtonsPaths = ['/login', '/register', '/passwordreset'];

    const shouldShowAuthButtons = () => {
        return !isLoggedIn && !hideAuthButtonsPaths.includes(location.pathname);
    };

    const shouldShowAdminButton = () => {
        return isLoggedIn && isAdmin;
    };

    const goToAdminPanel = () => {
        navigate('/admin');
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
        navigate('/search', { state: { query, searchResults } }); // Переход на страницу результатов поиска
    };

    const fetchSearchResults = async (query) => {
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
      <header className="header">
          {/* Підключення Font Awesome для іконки меню */}
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
          <div className="header-top">
              <div className="wrap">
                  {/* Кнопка для відкриття меню на мобільних пристроях */}
                  <button onClick={toggleMenu} className="button-menu">
                      <i className="fas fa-bars"></i> Меню
                  </button>
                  <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
                      <button  onClick={toggleMenu} className="button-menu">
                          <i className="fas fa-bars"></i> Меню
                      </button>
                      <Link to="/" onClick={toggleMenu}><i className="fas fa-home"></i> Головна</Link>
                      <Link to="/shop" onClick={toggleMenu}>Магазин</Link>
                      {/* ...інші посилання */}
                  </nav>
              </div>
          </div>

          {/* Нижній блок для кнопок авторизації, пошуку та інших контролів */}
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
                {isLoggedIn && (
                  <>
                    {shouldShowAdminButton() && <button onClick={goToAdminPanel} className="button">Адмін</button>}
                    <button onClick={goToUserProfile} className="button">Кабінет</button>
                    <button onClick={handleLogout} className="button">Вийти</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
    );
};

export default Header;

