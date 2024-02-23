import React, {} from 'react';
import './CartPage.css'
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';



const CartPage = ({ cart = [], setCart }) => {
    // const token = localStorage.getItem('authToken');

    const totalPrice = cart.reduce((total, product) => {

        const price = parseFloat(product.price);
        return typeof price === 'number' ? total + price * product.quantity : total;
    }, 0);


    const handleRemoveFromCart = (productId) => {
        if (window.confirm('Ви впевнені, що хочете видалити товар?')) {
            const updatedCart = cart.filter(product => product.id !== productId);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save the updated cart to localStorage
        }
    };

    const handleBuy = async () => {
        // try {
        //     const response = await fetch('https://apinvmnt.site/api/checkout', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${token}`,
        //         },
        //         body: JSON.stringify({ products: cart.map(item => ({ id: product.id, quantity: product.quantity })) }),
        //     });

        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         console.error('Checkout failed:', errorData);
        //         alert('Помилка під час оформлення покупки: ' + (errorData.message || 'Не вдалось виконати покупку'));
        //         return;
        //     }

        //     const result = await response.json();
        //     console.log('Checkout successful', result);
        //     alert('Покупка успішно оформлена!');
        //     setCart([]);
        //     // Тут можна додати перенаправлення або оновлення сторінки
        //     // window.location.href = '/thank-you'; // Перенаправлення на сторінку подяки
        // } catch (error) {
        //     console.error('Checkout error:', error);
        //     alert('Помилка під час оформлення покупки: ' + error.message);
        // }
    };

    return (
        <div className="cart-page">
            <h1>Ваш кошик</h1>
            {cart.length > 0 ? (
                <>
                    <div className="cart-items">
                    {cart.map(product => (
                        <div key={product.id} className="cart-item">
                            <h3>{product.title}</h3>
                            <p>Ціна: ${parseFloat(product.price).toFixed(2)}</p>
                            <div className="img-item">
                            <img src={product.images[0] || defaultImage} alt={product.title} className="cart-item-image" />
                            </div>
                            <p>Кількість: {product.quantity}</p>
                            <button onClick={() => handleRemoveFromCart(product.id)} className="custom-btn btn-7"><span>Видалити</span></button>
                        </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <p>Загальна сума: ${totalPrice.toFixed(2)}</p>
                        <button onClick={handleBuy} className="custom-btn btn-7"><span>Придбати</span></button>
                    </div>
                </>
            ) : (
                <p>Ваш кошик пустий.</p>
            )}
        </div>
    );
};

export default CartPage;