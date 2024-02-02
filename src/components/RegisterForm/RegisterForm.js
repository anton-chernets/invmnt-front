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
        if (!username || !email || !password || !confirmPassword) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Пароли не совпадают.');
            return;
        }

        // Создаем объект с данными пользователя
        const userData = {
            username,
            email,
            password,
        };

        // Отправляем запрос к серверу
        fetch('YOUR_REGISTRATION_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при регистрации');
                }
                return response.json();
            })
            .then(data => {
                console.log('Регистрация успешна:', data);
                // После успешной регистрации перенаправляем на страницу входа
                navigate('/login');
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Ошибка при регистрации. Попробуйте еще раз.');
            });
    };

    return (
        <div className="register-form-container">
            <h2 className="register-form-title">Реєстрція</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Ім'я користувача:</label>
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
                    <label htmlFor="confirmPassword">Підтвердіть пароль:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="register-form-button">Зареєструватись</button>
                <button onClick={goToLogin} className="register-form-button">Вхід</button>
            </form>
        </div>
    );
};

export default RegisterForm;
