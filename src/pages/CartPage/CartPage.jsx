import React, {} from 'react';
// import { AuthContext } from '../../components/AuthContext/AuthContext'; // Замініть на ваш шлях до AuthContext
import './CartPage.css'
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';

const CartPage = ({ cart = [], setCart }) => {
    // const { user } = useContext(AuthContext); // Використовуємо контекст для отримання інформації про користувача

    // Розрахунок загальної суми
    const totalPrice = cart.reduce((total, item) => {
        // Переконайтеся, що ціна є числом
        const price = parseFloat(item.price);
        return typeof price === 'number' ? total + price * item.quantity : total;
    }, 0);

    // Функція для видалення товару з кошика
    const handleRemoveFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    // Функція для обробки покупки
    const handleBuy = () => {
        // ... Код для обробки покупки
    };

    return (
        <div className="cart-page">
            <h1>Ваш кошик</h1>
            {cart.length > 0 ? (
                <>
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <h3>{item.title}</h3>
                                <p>Ціна: ${parseFloat(item.price).toFixed(2)}</p>
                                <div className="img-item">
                                    <img src={item.image || defaultImage} alt={item.title} />
                                </div>
                                <p>Кількість: {item.quantity}</p>
                                <button onClick={() => handleRemoveFromCart(item.id)} className='in-cart-button'>Видалити</button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <p>Загальна сума: ${totalPrice.toFixed(2)}</p>
                        <button onClick={handleBuy} className='in-cart-button'>Придбати</button>
                    </div>
                </>
            ) : (
                <p>Ваш кошик пустий.</p>
            )}
        </div>
    );
};

export default CartPage;