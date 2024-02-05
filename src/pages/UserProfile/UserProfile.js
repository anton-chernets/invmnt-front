import React, { useState } from 'react';
import './UserProfile.css';
import useFetchUser from '../../components/FetchUser/FetchUser';

const UserProfile = () => {
    const token = localStorage.getItem('authToken');
    const { user, loading, error } = useFetchUser(token);
    console.log(user)

    const [newEmail, setNewEmail] = useState(user?.email || '');
    const [newPassword, setNewPassword] = useState('');

    const handleEmailChange = (e) => setNewEmail(e.target.value);
    const handlePasswordChange = (e) => setNewPassword(e.target.value);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            // Оновлення профілю користувача
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Ви впевнені, що хочете видалити свій акаунт?')) {
            try {
                // Видалення акаунта користувача
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    // Додаємо пропущені функції
    const removeFromCart = (productId) => {
        // Реалізація видалення товару з кошика
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user data available</div>;

    return (
        <div className="user-profile">
            <h1>Особистий кабінет</h1>
            <div className="wrapper-inner">
                <div className="user-info">
                    <div className="user-contacts">
                        <p><b>Ім'я:</b> {user?.name || 'No name provided'}</p>
                        <p><b>Email:</b> {user?.email || 'No email provided'}</p>
                    </div>
                    <div className="user-cart">
                        {user.cart && user.cart.length > 0 ? (
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
                        ) : (
                            <p>Кошик пустий.</p>
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
