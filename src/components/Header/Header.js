import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const goToLogin = () => {
        navigate('/login');
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <header className="header">
            <div className="wrap">
                <button onClick={handleMenuClick} className="menu-button">
                    Меню
                </button>
                <nav className={isMenuOpen ? 'active' : ''}>
                    <Link to="/" onClick={handleMenuClick}>Главная</Link>
                    <Link to="/shop" onClick={handleMenuClick}>Магазин</Link>
                </nav>
                <div className="button-group">
                    <button onClick={goToLogin}>Вход</button>
                    <button onClick={goToRegister}>Регистрация</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
