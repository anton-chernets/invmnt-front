import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Здесь должна быть логика аутентификации (пример ниже)
        if (credentials.username === 'admin' && credentials.password === 'admin') {
            navigate('/admin'); // Перенаправление на админ-панель
        } else {
            alert('Неверные учетные данные');
        }
    };

    return (
        <div className="admin-login">
            <h1>Вход для Администратора</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    type="text"
                    placeholder="Имя пользователя"
                    value={credentials.username}
                    onChange={handleChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Пароль"
                    value={credentials.password}
                    onChange={handleChange}
                />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default AdminLogin;
