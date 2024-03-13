import React, {useContext} from 'react';
import './CartPage.css'
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import { AuthContext } from '../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';



const CartPage = ({ cart = [], setCart }) => {
    const token = localStorage.getItem('authToken');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();


    const totalPrice = cart.reduce((total, product) => {

        const price = parseFloat(product.price);
        return typeof price === 'number' ? total + price * product.quantity : total;
    }, 0);


    const handleRemoveFromCart = (productId) => {
        if (window.confirm('Ви впевнені, що хочете видалити товар?')) {
            const updatedCart = cart.filter(product => product.id !== productId);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const handleBuyNowClick = async () => {
        if (!user) {
            navigate('/login');
        } else {
            await onBuyNow();
        }
    };
    
    async function onBuyNow() {
        const orderDetails = {
            products: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
            })),
        };
    
        try {
            const response = await fetch('https://apinvmnt.site/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(orderDetails),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Order created successfully:', data);
            alert('Thank you for your purchase!');
            setCart([]); 
            localStorage.removeItem('cart'); 
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('An error occurred during checkout. Please try again.');
        }
    }
    

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
                    <button className="custom-btn btn-7" onClick={handleBuyNowClick}><span>Придбати всі</span></button>
                </div>
            </>
            ) : (
                <p>Ваш кошик пустий.</p>
            )}
        </div>
    );
};

export default CartPage;