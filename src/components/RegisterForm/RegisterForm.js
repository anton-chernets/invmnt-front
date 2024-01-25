import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css'

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate('/login');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Проверка на пустые поля
        if (!username || !email || !password || !confirmPassword) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }
        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            alert('Пароли не совпадают.');
            return;
        }
        // Здесь должен быть запрос к серверу для регистрации
        console.log('Регистрация:', username, email, password);
        // После успешной регистрации перенаправляем на страницу входа
        navigate('/login');
    };

    return (
        <div className="register-form-container">
            <h2 className="register-form-title">Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Имя пользователя:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Подтвердите пароль:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Зарегистрироваться</button>
                <button onClick={goToLogin}>Вход</button>
            </form>
        </div>
    );
};

export default RegisterForm;
