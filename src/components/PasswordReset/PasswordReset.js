import React, { useState } from 'react';
import './PasswordReset.css'
import {useNavigate} from "react-router-dom";

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Тут можна виконати запит до сервера для відправки інструкцій з відновлення паролю
        console.log('Запит на відновлення паролю для:', email);
        // Показати повідомлення про успішну відправку інструкцій або обробити помилку
    };

    const handleGoBack = () => {
        navigate('/login'); // Змінити на шлях до вашої сторінки входу
    };

    return (
        <div className="password-reset-form">
            <div className="wrapper-form">
                <h2>Відновлення паролю</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Введіть вашу електронну адресу:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="droup-button">
                        <button type="submit">Відновити пароль</button>
                        <button type="button" onClick={handleGoBack}>Назад</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
