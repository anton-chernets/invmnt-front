import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const CheckoutPage = ({ cart, setCart }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const [orders, setOrders] = useState([]);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch('https://apinvmnt.site/api/orders', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            setOrders(data.data); // Assuming 'data' is the key holding orders
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [token]); // token is a dependency of fetchOrders

    useEffect(() => {
        const total = cart.reduce((acc, currentItem) => acc + currentItem.price * currentItem.quantity, 0);
        setTotalPrice(total);
        fetchOrders(); // Now fetchOrders is stable and won't change unless token changes
    }, [cart, fetchOrders]);



    const handleCheckout = async () => {
        if (!cart.length) {
            alert("Your cart is empty!");
            return;
        }

        const orderData = {
            products: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        };

        try {
            const response = await fetch('https://apinvmnt.site/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error during checkout');
            }

            setCart([]); // Clear the cart after successful checkout
            navigate('/success');
            alert('Your order has been placed successfully!');
            fetchOrders(); // Fetch orders again to update the list
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Error during checkout: ' + error.message);
        }
    };

    return (
        <div className="checkout-page">
            <h1>Orders</h1>
            {orders.length > 0 ? (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            <p>Total Price: {order.total_price}</p>
                            <p>Created At: {order.created_at}</p>
                            <p>Updated At: {order.updated_at}</p>
                            {order.line_items.map(item => (
                                <div key={item.id}>
                                    <p>{item.product_info.title} - ${item.price} x {item.quantity}</p>
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No orders found.</p>
            )}
            <h1>Checkout</h1>
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.title}/>
                        <div>
                            <h2>{item.title}</h2>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price}</p>
                            <p>Subtotal: ${item.price * item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="total-price">
                <h2>Total: ${totalPrice.toFixed(2)}</h2>
            </div>
            <button onClick={handleCheckout} className="checkout-button">Proceed to Checkout</button>
        </div>
    );
};

export default CheckoutPage;
