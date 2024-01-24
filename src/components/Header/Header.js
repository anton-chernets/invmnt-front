import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <h1>Welcome</h1>
            <nav>
                <Link to="/">Главная</Link>
                <Link to="/shop">Магазин</Link>
            </nav>
        </header>
    );
};

export default Header;