import React, { useState, useEffect } from 'react';
import './ManageOrders.css';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage

    useEffect(() => {
        // fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Ensure you add the Authorization header to your request
            const response = await fetch('http://95.217.181.158/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Помилка при завантаженні замовлень');
            }
            const data = await response.json();
            setOrders(data.data); // Assuming the orders are in the 'data' array
        } catch (error) {
            console.error('Помилка:', error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            // Ensure you add the Authorization header to your request
            const response = await fetch(`http://95.217.181.158/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Помилка при видаленні замовлення');
            }
            await fetchOrders(); // Refresh the orders after deleting
        } catch (error) {
            console.error('Помилка:', error);
        }
    };

    return (
        <div className="manage-orders">
            <h1>Управління Замовленнями</h1>
            {orders.length > 0 ? (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            Замовлення №{order.id}
                            <div>Всього: {order.total_price}</div>
                            {/* Display other order details as needed */}
                            <button onClick={() => handleDeleteOrder(order.id)}>Видалити замовлення</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Замовлення відсутні.</p>
            )}
        </div>
    );
};

export default ManageOrders;
