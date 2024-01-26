import React, { useState, useEffect } from 'react';
import './UserProfile.css';


const UserProfile = () => {
    // Створення фейкового об'єкта користувача
    const fakeUser = {
        name: 'Іван Іванов',
        email: 'ivan@example.com',
        cart: [
            { id: 1, title: 'Товар 1', price: 100 },
            { id: 2, title: 'Товар 2', price: 200 },
            // Інші товари
        ],
        // Інші поля, якщо потрібно
    };

    // const [user, setUser] = useState(null);

    // const removeFromCart = (productId) => {
    //     setUser(prevUser => ({
    //         ...prevUser,
    //         cart: prevUser.cart.filter(item => item.id !== productId)
    //     }));
    // };

    const [user, setUser] = useState(fakeUser);

    useEffect(() => {
        // Тут буде код для завантаження даних користувача
        // Наприклад, fetch з API
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

    // Перевірка, чи завантажено дані
    if (!user) {
        return <div>Завантаження...</div>;
    }

    return (
        <div className="user-profile">
            <h1>Профіль Користувача</h1>
            <div className="wrapper">
            <p>Ім'я: {user.name}</p>
            <p>Email: {user.email}</p>
            {user.cart && user.cart.length > 0 && (
                <>
                    <h2>Кошик</h2>
                    <ul>
                        {user.cart.map(item => (
                            <li key={item.id}>
                                {item.title} - Ціна: {item.price}
                                {/* Тут може бути кнопка для видалення товару з кошика */}
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {/* Тут можна додати інші дані користувача */}
        </div>
        </div>
    );
};

export default UserProfile;
