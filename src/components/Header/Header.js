import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <button onClick={handleMenuClick} className="menu-button">
                Меню
            </button>
            <nav className={isMenuOpen ? 'active' : ''}>
                <Link to="/" onClick={handleMenuClick}>Главная</Link>
                <Link to="/shop" onClick={handleMenuClick}>Магазин</Link>
                <Link to="/admin/login" onClick={handleMenuClick}>Админка (временно)</Link>
            </nav>
        </header>
    );
};

export default Header;
