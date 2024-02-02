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

    if (!user) {
        return <div>Завантаження...</div>;
    }

    return (
        <div className="user-profile">
            <div className='wrapper'>
            <h1>Профіль Користувача</h1>
            <div className="wrapper-inner">
                <p>Ім'я: {user.name}</p>
                <p>Email: {user.email}</p>
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
        </div>
    );
};

export default UserProfile;
