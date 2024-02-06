import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
// import useFetchUser from '../../components/FetchUser/FetchUser';

const CheckoutPage = ({ cart, setCart }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        // Calculate total price of the cart items
        const total = cart.reduce((acc, currentItem) => acc + currentItem.price * currentItem.quantity, 0);
        setTotalPrice(total);
    }, [cart]);

    const handleCheckout = async () => {
        // Перевірка на наявність товарів у корзині
        if (cart.length === 0) {
            alert("Ваша корзина порожня!");
            return;
        }

        // Підготовка даних для відправки
        const orderData = {
            items: cart,
            total: totalPrice,
            // Додайте інші необхідні дані, якщо потрібно
        };

        try {
            // Відправка POST-запиту до API
            const response = await fetch('http://95.217.181.158/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                // Якщо відповідь не OK, вивести помилку
                const errorData = await response.json();
                throw new Error(errorData.message || 'Помилка під час оформлення замовлення');
            }

            // Очищення корзини після успішного оформлення замовлення
            setCart([]);

            // Перехід на сторінку успіху або показ сповіщення про успішне оформлення замовлення
            navigate('/success');
            alert('Ваше замовлення успішно оформлено!');
        } catch (error) {
            console.error('Помилка:', error);
            alert('Помилка під час оформлення замовлення: ' + error.message);
        }
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
