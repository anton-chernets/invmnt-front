import React, {useContext, useState} from 'react';
import './UserProfile.css';
import useFetchUser from '../../components/FetchUser/FetchUser';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../components/AuthContext/AuthContext";


const UserProfile = () => {
    const token = localStorage.getItem('authToken');
    const { user, setUser, loading, error } = useFetchUser(token);
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);

    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState(user?.name || '');

    // const { isAdmin } = useContext(AuthContext);

    const handlePasswordChange = (e) => setNewPassword(e.target.value);
    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };
    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const updatedInfo = {
            password: newPassword,
        };

        try {

            const response = await fetch('http://95.217.181.158/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedInfo)
            });

            if (!response.ok) {
                // If the response is not OK, throw an error
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }


            const data = await response.json();
            setUser(data);


            alert('Profile updated successfully');
        } catch (error) {

            console.error('Error updating profile:', error);
            alert(error.toString());
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Ви впевнені, що хочете видалити свій акаунт?')) {
            try {
                const response = await fetch('http://95.217.181.158/api/remove', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    // Тело запроса не нужно, если мы не передаем данные
                });

                // Проверка успешности ответа
                if (response.ok) {
                    // Операция удаления прошла успешно
                    alert('Ваш акаунт успішно видалено.');

                    // Очистка токена авторизации, так как аккаунт более не существует
                    localStorage.removeItem('authToken');
                    setIsAuthenticated(false);

                    // Переадресация пользователя на главную страницу или страницу входа
                    navigate('/');
                } else {
                    // Если сервер вернул ошибку
                    throw new Error('Помилка при видаленні акаунту.');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                alert(error.toString());
            }
        }
    };


    // Додаємо пропущені функції
    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(`http://95.217.181.158/api/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Тут використовуємо збережений токен
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove product from cart');
            }

            // Оновлення стану кошика після успішного видалення товару на сервері
            setUser(prevUser => ({
                ...prevUser,
                cart: prevUser.cart.filter(item => item.id !== productId)
            }));

            // Оповіщення користувача про успішне видалення товару
            alert('Product removed from cart');
        } catch (error) {
            console.error('Error removing product from cart:', error);
            alert('Failed to remove product from cart');
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user data available</div>;
    console.log(user.name)
    console.log(user.role)
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
                        <label htmlFor="newName">Нове Ім'я:</label>
                        <input
                            id="newName"
                            type="text"
                            value={newName}
                            onChange={handleNameChange}
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
                    {/*{!isAdmin && (*/}
                        <button onClick={handleDeleteAccount} className="delete-account">
                            Видалити акаунт
                        </button>
                    {/*)}*/}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
