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

    const [searchTerm, setSearchTerm] = useState(''); // Стан для тексту пошуку

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        console.log('Пошуковий запит: ', searchTerm);
        // Тут ви можете додати логіку для відправки запиту пошуку
    };

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
                    // Перевірте поле ролі в отриманому профілі
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

    const shouldShowAuthButtons = () => {
        return !isLoggedIn && location.pathname !== '/login' && location.pathname !== '/register';
    };

    const shouldShowAdminButton = () => {
        return isLoggedIn && isAdmin;
    };

    const goToAdminPanel = () => {
        navigate('/admin');
    };

    const goToUserProfile = () => {
        navigate('/user')
    }

    const goToLogin = () => {
      navigate('/login')
    };
    
    const goToRegister = () => {
      navigate('/register')
    }
    return (
      <header className="header">
          {/* Підключення Font Awesome для іконки меню */}
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
          <div className="header-top">
              <div className="wrap">
                  {/* Кнопка для відкриття меню на мобільних пристроях */}
                  <button className="menu-button" onClick={toggleMenu}>
                      <i className="fas fa-bars"></i> Menu
                  </button>
                  {/* Навігація, яка стає випадаючою на мобільних пристроях */}
                  
                  <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
                      <Link to="/" onClick={toggleMenu}><i className="fas fa-home"></i> Home</Link>
                      <Link to="/shop" onClick={toggleMenu}>Shop</Link>
                      {/* ...інші посилання */}
                  </nav>
            </div>
          </div>
          
          {/* Нижній блок для кнопок авторизації, пошуку та інших контролів */}
          <div className="header-bottom">
            <div className="wrap">

                <div className="header-logo">
                    <Link to="/">
                        <img src={logoImage} alt="Investment"/>Investment
                    </Link>

                </div>
              <form onSubmit={handleSearchSubmit} className="search-form">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search..."
                                className="search-input"
                            />
                            <button type="submit" className="search-button">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
              <div className='header-controls'>
                {shouldShowAuthButtons() && (
                  <>
                    <button onClick={goToLogin} className="button">Login</button>
                    <button onClick={goToRegister} className="button">Register</button>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    {shouldShowAdminButton() && <button onClick={goToAdminPanel} className="button">Admin</button>}
                    <button onClick={goToUserProfile} className="button">Personal</button>
                    <button onClick={handleLogout} className="button">Logout</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      );
      
};

export default Header;
