import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const CheckoutPage = ({ cart, setCart }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Calculate total price of the cart items
        const total = cart.reduce((acc, currentItem) => acc + currentItem.price * currentItem.quantity, 0);
        setTotalPrice(total);
    }, [cart]);

    const handleCheckout = () => {
        // Implement checkout logic here
        console.log('Proceeding to checkout...');
        // After successful checkout, you might want to clear the cart
        // setCart([]);
        // navigate to a success page
        navigate('/success');
    };

    if (!cart.length) {
        return <p>Your cart is empty.</p>;
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.title} />
                        <div>
                            <h2>{item.title}</h2>
                            <p>Кількість: {item.quantity}</p>
                            <p>Ціна: ${item.price}</p>
                            <p>Проміжний підсумок: ${item.price * item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="total-price">
                <h2>Загальна сума: ${totalPrice.toFixed(2)}</h2>
            </div>
            <button onClick={handleCheckout} className="checkout-button">Перейти до оформлення замовлення</button>
        </div>
    );
};

export default CheckoutPage;
