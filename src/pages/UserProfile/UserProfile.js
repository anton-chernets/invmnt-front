import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/userdata'); // Припускаємо, що API використовує Bearer токен
                if (!response.ok) {
                    throw new Error('Помилка при завантаженні даних користувача');
                }
                const userData = await response.json();
                setUser(userData);
                setNewEmail(userData.email); // Ініціалізуємо поля зміни з поточними даними
            } catch (error) {
                console.error('Помилка:', error);
            }
        };

        fetchUserData();
    }, []);
    const removeFromCart = (productId) => {
        setUser(prevUser => ({
            ...prevUser,
            cart: prevUser.cart.filter(item => item.id !== productId)
        }));
    };

    const handleEmailChange = (e) => {
        setNewEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization header should be included if API requires
                },
                body: JSON.stringify({ email: newEmail, password: newPassword })
            });

            if (!response.ok) {
                throw new Error('Помилка при оновленні профілю');
            }
            const updatedUser = await response.json();
            setUser(updatedUser);
            alert('Дані оновлено успішно');
        } catch (error) {
            console.error('Помилка:', error);
            alert('Не вдалось оновити дані');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Ви впевнені, що хочете видалити свій акаунт?')) {
            try {
                const response = await fetch('/api/delete-account', {
                    method: 'DELETE',
                    headers: {
                        // Authorization header should be included if API requires
                    }
                });

                if (!response.ok) {
                    throw new Error('Помилка при видаленні акаунту');
                }
                alert('Акаунт видалено');
                // Here you should also clear any stored authentication tokens
                // and redirect the user to the login page or home page
            } catch (error) {
                console.error('Помилка:', error);
                alert('Не вдалось видалити акаунт');
            }
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
