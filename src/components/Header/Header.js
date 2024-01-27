import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/Untitled.png';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

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

    function goToUserProfile() {
        navigate('/user')
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
                    <img src={logoImage} alt="Logo" />
                </Link>
              </div>
              <div className='header-controls'>
                {shouldShowAuthButtons() && (
                  <>
                    <Link to="/login" className="button-auth">Вход</Link>
                    <Link to="/register" className="button-auth">Регистрация</Link>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    {shouldShowAdminButton() && <button onClick={goToAdminPanel} className="button">Админ панель</button>}
                    <button onClick={goToUserProfile} className="button">Личный кабинет</button>
                    <button onClick={handleLogout} className="button">Вийти</button>
                  </>
                )}
                {/* Тут можна додати пошуковий компонент */}
              </div>
            </div>
          </div>
        </header>
      );
      
};

export default Header;
