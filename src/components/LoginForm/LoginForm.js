import React, { useState } from 'react';
import './LoginForm.css'
import {useNavigate} from "react-router-dom";
const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
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

            // Обработка ответа от сервера
            if (response.ok) {
                console.log('Вход выполнен:', data);
                // Сохранение токена в localStorage или cookie
                localStorage.setItem('authToken', data.token);
                // Переадресация пользователя на домашнюю страницу
                navigate('/');
            } else {
                // Если ответ сервера содержит ошибку, сообщаем об этом пользователю
                alert('Ошибка аутентификации: ' + data.message);
            }
        } catch (error) {
            // Обработка ошибок сети
            alert('Ошибка сети: ' + error.message);
        }
    };


    return (
        <div className="login-form-container">
            <h2 className="login-form-title">Вход</h2>
            <form onSubmit={handleSubmit}>
                <label className="form-input-label" htmlFor="username">Имя пользователя</label>
                <input className="form-field" id="username" type="text" value={username}
                       onChange={(e) => setUsername(e.target.value)}/>

                <label className="form-input-label" htmlFor="password">Пароль</label>
                <input className="form-field" id="password" type="password" value={password}
                       onChange={(e) => setPassword(e.target.value)}/>

                <button className="form-button" type="submit">Войти</button>
            </form>
            <div className="form-link">
                <a href="/register">Зарегистрироваться</a>
            </div>
        </div>
    );
};

export default LoginForm;
