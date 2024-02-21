import React, {useContext, useState} from 'react';
import './UserProfile.css';
import useFetchUser from '../../components/FetchUser/FetchUser';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../components/AuthContext/AuthContext";
import CartPage from '../../components/CartPage/CartPage';
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle"; // Import the ThemeToggle component

const UserProfile = () => {
    const token = localStorage.getItem('authToken');
    const { user, setUser, loading, error } = useFetchUser(token);
    const navigate = useNavigate();
    const { setIsAuthenticated, isAdmin } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState(user?.name || '');

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
            const response = await fetch('https://apinvmnt.site/api/user/update', {
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
                const response = await fetch('https://apinvmnt.site/api/remove', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                // Проверка успешности ответа
                if (response.ok) {
                    alert('Ваш акаунт успішно видалено.');
                    localStorage.removeItem('authToken');
                    setIsAuthenticated(false);
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

    const [cart, setCart] = useState(() => {
        // Get the cart from localStorage and parse it or default to an empty array
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user data available</div>;

    return (
        <div className="user-profile">
            <div className="wrapper-inner">
                <div className="user-info">
                    <div className="user-contacts">
                        <p><b>Ім'я:</b> {user?.name || 'No name provided'}</p>
                        <p><b>Email:</b> {user?.email || 'No email provided'}</p>
                    </div>
                    <div className="user-cart">
                        {user && <CartPage cart={cart} setCart={setCart} />}
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
                        <button className="custom-btn btn-7" type="submit"><span>Оновити дані</span></button>
                    </form>
                    <ThemeToggle />
                    {!isAdmin && (
                        <button onClick={handleDeleteAccount} className="delete-account">
                            Видалити акаунт
                        </button>

                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
