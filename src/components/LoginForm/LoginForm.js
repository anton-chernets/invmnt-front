import React, { useState } from 'react';
import './LoginForm.css'
const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь должна быть логика аутентификации
        console.log('Вход выполнен:', username, password);
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
