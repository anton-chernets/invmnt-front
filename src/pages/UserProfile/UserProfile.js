import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = () => {
    const fakeUser = {
        name: 'Іван Іванов',
        email: 'ivan@example.com',
        cart: [
            { id: 1, title: 'Товар 1', price: 100 },
            { id: 2, title: 'Товар 2', price: 200 },
        ],
    };

    const [user, setUser] = useState(fakeUser);
    // const [user, setUser] = useState(null);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const removeFromCart = (productId) => {
        setUser(prevUser => ({
            ...prevUser,
            cart: prevUser.cart.filter(item => item.id !== productId)
        }));
    };

    useEffect(() => {
        // Код для завантаження даних користувача
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/userdata'); // URL вашого API
                if (!response.ok) {
                    throw new Error('Помилка при завантаженні даних користувача');
                }
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Помилка:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleEmailChange = (e) => {
        setNewEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        // Виконайте запит до API для оновлення профілю
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Ви впевнені, що хочете видалити свій акаунт?')) {
            // Виконайте запит до API для видалення акаунту
        }
    };

    if (!user) {
        return <div>Завантаження...</div>;
    }

    return (
        <div className="user-profile">
            <h1>Особистий кабінет</h1>
            <div className="wrapper-inner">

                <div className="user-info">

                    <p><b>Ім'я:</b> {user.name}</p>
                    <p><b>Email:</b> {user.email}</p>

                    <div className="user-cart">
                        {user.cart && user.cart.length > 0 && (
                            <>
                                <h2>Кошик</h2>
                                <ul>
                                    {user.cart.map(item => (
                                        <li key={item.id}>
                                            {item.title} - Ціна: {item.price}
                                            <button onClick={() => removeFromCart(item.id)}>Видалити з кошика</button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
                <div className="user-setting">
                    <h3>Налаштунки</h3>
                    <form onSubmit={handleUpdateProfile} className="form-setting">
                        <label htmlFor="newEmail">Новий Email:</label>
                        <input
                            id="newEmail"
                            type="email"
                            value={newEmail}
                            onChange={handleEmailChange}
                        />
                        <label htmlFor="newPassword">Новий Пароль:</label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={handlePasswordChange}
                        />
                        <button type="submit">Оновити дані</button>
                    </form>
                    <button onClick={handleDeleteAccount} className="delete-account">Видалити акаунт</button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
