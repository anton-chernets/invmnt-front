import React, {useContext, useState} from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { setIsAuthenticated } = useContext(AuthContext);



    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Будь ласка, введіть email та пароль.');
            return;
        }

        const loginData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch('https://apinvmnt.site/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.data.access_token);
                setIsAuthenticated(true);
                navigate('/');
                window.location.reload();
            } else {
                alert('Помилка аутентифікації: ' + data.message);
            }
        } catch (error) {
            alert('Помилка мережі: ' + error.message);
        }
    };

    return (
        <div className="login-form-container">
            <div className="wrapper-form">
                <h2 className="login-form-title">Вхід</h2>
                <form onSubmit={handleSubmit} className="form">
                    <label className="form-input-label" htmlFor="email">Email користувача:</label>
                    <input
                        className="form-field"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

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
                        <button className="custom-btn btn-7" type="submit"><span>Увійти</span></button>
                        <div className="form-link">
                            <a href="/register">Зареєструватись</a>
                            <a href="/passwordreset">Забули пароль</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
