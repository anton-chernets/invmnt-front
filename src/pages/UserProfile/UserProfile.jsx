import React, { useContext, useState, useEffect } from 'react';
import './UserProfile.css';
import useFetchUser from '../../components/FetchUser/FetchUser';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../components/AuthContext/AuthContext";
import CartPage from '../../components/CartPage/CartPage';
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
// import defaultImage from '../../img/image_2024-02-07_10-47-09.png';

const UserProfile = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated, isAdmin } = useContext(AuthContext);
    const { user, setUser, loading: userLoading, error: userError } = useFetchUser(localStorage.getItem('authToken'));
    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState(user?.name || '');
    const [showPassword, setShowPassword] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [errorOrders, setErrorOrders] = useState(null);
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await fetch('https://apinvmnt.site/api/orders', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setOrders(data.data || []);
                } catch (error) {
                    setErrorOrders(error.message);
                } finally {
                    setLoadingOrders(false);
                }
            }
        };
        fetchOrders();
    }, [user]);

    const handlePasswordChange = (e) => setNewPassword(e.target.value);
    const handleNameChange = (e) => setNewName(e.target.value);


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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    
    if (userLoading) return <div>Loading...</div>;
    if (userError) return <div>Error: {userError}</div>;


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
                    <div className="user-orders">
                    <h3>Ваші Замовлення</h3>
                    {loadingOrders ? <p>Loading orders...</p> : null}
                    {errorOrders ? <p>Error loading orders: {errorOrders}</p> : null}
                    {orders.length > 0 ? (
                    orders.map((order) => (
                    <div key={order.created_at} className='order-item'>
                        <p>Дата Замовлення: {new Date(order.created_at).toLocaleString()}</p>
                        <div className='line-items'>
                        {order.line_items && order.line_items.map((item, index) => (
                            item.product_info ? ( // Check if product_info exists
                                <div key={`${order.id}-${item.product_info.id}-${index}`} className='order-product-item'>
                                    <p>{item.product_info.title}</p>
                                    <p>{item.product_info.description}</p>
                                    <p>Кількість: {item.quantity}</p>
                                    <p>Ціна: {item.price}</p>
                                </div>
                            ) : null
                        ))}
                                </div>
                            </div>
                            ))
                        ) : (
                            <p>No orders found.</p>
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
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={handlePasswordChange}
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
