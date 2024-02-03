import React, { useState } from 'react';
import './LoginForm.css'
import {useNavigate} from "react-router-dom";
const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка на пустые поля
        if (!username || !password) {
            alert('Пожалуйста, введите имя пользователя и пароль.');
            return;
        }

        // Объект с данными для отправки на сервер
        const loginData = {
            username: username,
            password: password,
        };

        try {
            // Здесь должен быть запрос на сервер для аутентификации
            const response = await fetch('https://example.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Вход выполнен:', data);
                localStorage.setItem('authToken', data.token);

                // Перевірка ролі користувача
                if (data.role === 'admin') {
                    // Перенаправлення на адмін-панель
                    navigate('/');
                } else {
                    // Перенаправлення на головну сторінку
                    navigate('/');
                }
            } else {
                alert('Ошибка аутентификации: ' + data.message);
            }
        } catch (error) {
            alert('Ошибка сети: ' + error.message);
        }
    };


    return (
        <div className="login-form-container">
            <div className="wrapper-form">
                <h2 className="login-form-title">Вхід</h2>
                <form onSubmit={handleSubmit} className="form">
                    <label className="form-input-label" htmlFor="email">Пошта користувача:</label>
                    <input className="form-field" id="username" type="text" value={username}
                           onChange={(e) => setUsername(e.target.value)}/>

                    <label className="form-input-label" htmlFor="password">Пароль:</label>
                    <input
                        className="form-field"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="show-password">
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={togglePasswordVisibility}
                        />
                        Показати пароль
                    </label>
                    <div className="droup-button">
                        <button className="form-button" type="submit">Увійти</button>
                        <div className="form-link">
                            <a href="/register">Зареєструватись</a>
                            <a href="/passwordreset">Забули палоль</a>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default LoginForm;
