import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css'

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate('/login');
    };

    // Функція для перемикання видимості пароля
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Функція для перемикання видимості підтвердження пароля
    // const toggleConfirmPasswordVisibility = () => {
    //     setShowConfirmPassword(!showConfirmPassword);
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !email || !password ) {
            alert('Будь ласка, заповніть усі поля.');
            return;
        }
        // if (password !== confirmPassword) {
        //     alert('Паролі не співпадають.');
        //     return;
        // }

        const userData = {
            name: username,
            email: email,
            password: password,
        };

        fetch('http://95.217.181.158/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Помилка при реєстрації');
                }
                return response.json();
            })
            .then(data => {
                console.log('Реєстрація успішна:', data);
                navigate('/login');
            })
            .catch(error => {
                console.error('Помилка:', error);
                alert('Помилка при реєстрації. Спробуйте ще раз.');
            });
    };

    return (
        <div className="register-form-container">
            <div className="wrapper-form">
                <form onSubmit={handleSubmit} className="form-field-reg">
                    <h2 className="register-form-title">Реєстрація</h2>
    
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
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="show-password">
                            <input
                                id="showPassword"
                                type="checkbox"
                                checked={showPassword}
                                onChange={togglePasswordVisibility}
                            />
                            <label htmlFor="showPassword">Показати пароль</label>
                        </div>
                    </div>
                    
                    <div className="droup-button">
                        <button type="submit" className="custom-btn btn-7"><span>Зареєструватись</span></button>
                        <button type="button" onClick={goToLogin} className="custom-btn btn-7"><span>Вхід</span></button>
                    </div>
                </form>
            </div>
        </div>
    );
    
};

export default RegisterForm;
