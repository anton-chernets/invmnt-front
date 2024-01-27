import React, { useState, useEffect } from 'react';
import './ManageOrders.css';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders'); // URL вашого API для замовлень
            if (!response.ok) {
                throw new Error('Помилка при завантаженні замовлень');
            }
            const data = await response.json();
            setOrders(data); // Оновлення списку замовлень
        } catch (error) {
            console.error('Помилка:', error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Помилка при видаленні замовлення');
            }
            await fetchOrders(); // Оновлення списку замовлень після видалення
        } catch (error) {
            console.error('Помилка:', error);
        }
    };

    return (
        <div className="manage-orders">
            <h1>Управління Замовленнями</h1>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        Замовлення №{order.id}
                        {/* Інші дані замовлення */}
                        <button onClick={() => handleDeleteOrder(order.id)}>Видалити замовлення</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageOrders;
