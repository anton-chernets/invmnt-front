import React from 'react';
import { useNavigate } from 'react-router-dom';

import './CartPage.css'
// import productList from "../../components/ProductList/ProductList";

const CartPage = ({ cart, setCart }) => {
    const navigate = useNavigate();

    // Function to handle removing items from the cart
    const handleRemoveFromCart = (productId) => {
        setCart(currentCart => currentCart.filter(item => item.id !== productId));
    };

    // Calculate the total price
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Function to handle buying items
    const handleBuy = () => {
        // Here you would typically handle the buying process by sending a request to your server
        console.log('Buying', cart);

        // Simulating a server response delay with setTimeout
        setTimeout(() => {
            // Mock server response after 2 seconds
            console.log('Purchase successful');

            // Clear the cart after purchase
            setCart([]);

            // Navigate to a confirmation page or back to the shop
            // navigate('/confirmation'); // Uncomment this line if you have a confirmation page
            navigate('/shop'); // Navigate back to the shop after purchase
        }, 2000);
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
                                <p>Ціна: ${item.price}</p>
                                <div className="img-item">
                                <img src={item.image} alt="" />
                                </div>
                                {/*<p>Quantity: {item.quantity}</p>*/}
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