import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    // Функции для перенаправления
    const handleUsersClick = () => {
        navigate('/admin/users'); // Перенаправление на управление пользователями
    };

    const handleProductsClick = () => {
        navigate('/admin/products'); // Перенаправление на управление товарами
    };

    // Другие функции для кнопок

    return (
        <div className='admin-dashboard'>
            <h1>Административная Панель</h1>
            <p>Добро пожаловать в административную панель!</p>
            {/* Кнопки */}
            <button onClick={handleUsersClick}>Управление пользователями</button>
            <button onClick={handleProductsClick}>Управление товарами</button>
            {/* Другие кнопки */}
        </div>
    );
};

export default AdminDashboard;
