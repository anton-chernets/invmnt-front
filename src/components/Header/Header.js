import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isAdmin, setIsAdmin] = useState(true);

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

    const handleMenuClick = () => {
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
            <div className="wrap">
                <button onClick={handleMenuClick} className="menu-button">Меню</button>
                <nav className={isMenuOpen ? 'active' : ''}>
                    <Link to="/" onClick={handleMenuClick}>Главная</Link>
                    <Link to="/shop" onClick={handleMenuClick}>Магазин</Link>
                </nav>
                {shouldShowAuthButtons() && (
                    <div className="button-group">
                        <Link to="/login" className="button-auth">Вход</Link>
                        <Link to="/register" className="button-auth">Регистрация</Link>
                    </div>
                )}
                {isLoggedIn && (
                    <div className="button-group">
                        {shouldShowAdminButton() &&
                            <button onClick={goToAdminPanel} className="button">Админ панель</button>}
                        <button onClick={goToUserProfile} className="button">Личный кабинет</button>
                        <button onClick={handleLogout} className="button">Вийти</button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
