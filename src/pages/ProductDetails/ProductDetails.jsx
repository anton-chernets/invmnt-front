import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';
import { AuthContext } from '../../components/AuthContext/AuthContext';
import CartPage from "../../components/CartPage/CartPage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Use AuthContext
  const isUser = user && user.role === 'customer';
  const token = localStorage.getItem('authToken'); // Retrieve the authToken from localStorage
  const [showCart, setShowCart] = useState(false);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

    useEffect(() => {
        const fetchProduct = async () => {
          try {
            const response = await fetch(`https://apinvmnt.site/api/products/show/${productId}`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setProduct(data.data); // Assuming the API response has a 'data' field which contains the product details
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProduct();
      }, [productId]);

    const goBack = () => {
        navigate(-1); // Перенаправлення назад
    };

    const onAddToCart = (product) => {
        
        setCart(currentCart => {
        const productIndex = currentCart.findIndex(item => item.id === product.id);
        let newCart;

        if (productIndex !== -1) {
            // Product already in cart, update the quantity
            newCart = currentCart.map((item, index) =>
                index === productIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            // Product not in cart, add as a new item
            newCart = [...currentCart, { ...product, quantity: 1 }];
        }

        localStorage.setItem('cart', JSON.stringify(newCart)); // Update localStorage with the new cart
        return newCart;
    });
};

const handleAddToCartClick = (product) => {
    if (!user) {
      navigate('/login');
    } else {
      onAddToCart(product);
    }
  };

  const handleBuyNowClick = (product) => {
    if (!user) {
        // Якщо користувач не залогінений, перенаправляємо на сторінку логіну
        navigate('/login');
    } else {
        onBuyNow(product);
    }
};
async function onBuyNow(product) {

    const orderDetails = {
        products: [
            {
                id: product.id,
                quantity: 1,
            },
        ],
    };

    try {
        const response = await fetch('https://apinvmnt.site/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Make sure the token is accessible here
            },
            body: JSON.stringify(orderDetails),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Order created successfully:', data);
        alert('Thank you for your purchase!');
    } catch (error) {
        console.error('Checkout failed:', error);
        alert('An error occurred during checkout. Please try again.');
    }
}

    // Conditional rendering based on the loading state
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>Product not found</p>;

    // Assuming your API returns an object and not an array for a single product
    const productDetails = product;

    return (
        <div className='details-wrap'>
            {isUser && (
                    <>
                        <button onClick={() => setShowCart(!showCart)} className="custom-btn btn-7" aria-label="Toggle cart visibility">
                        <span><FontAwesomeIcon icon={faShoppingCart} className="icon-spacing" /> Кошик</span>
                        </button>
                        {showCart && isUser && <CartPage cart={cart} setCart={setCart} />}
                        {/* {showCart && (
                            <div className="cart-details">
                                {cart.length > 0 ? (
                                    <ul>
                                        {cart.map(item => (
                                            <li key={item.id}>{item.title} - Кількість: {item.quantity}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Your cart is empty.</p>
                                )}
                            </div>
                        )} */}
                    </>
                )}
        <div className="product-details">        
            <h2>{productDetails.title}</h2>
            <img src={productDetails.images[0]} alt={productDetails.title} />
            <p>{productDetails.description}</p>
            <p>Price: ${productDetails.price}</p>
            <button onClick={goBack} className="custom-btn btn-7"><span>Назад</span></button>
            <div className='details-but'>
                
                {isUser && (
                    <>
                        <button className="custom-btn btn-7" onClick={() => onAddToCart(product)}><span>У кошик</span></button>
                        <button className="custom-btn btn-7" onClick={() => handleBuyNowClick(product)}><span>Придбати</span></button>
                    </>
                )}
                {!user && (
                    <>
                        <button className="custom-btn btn-7" onClick={() => handleAddToCartClick(product)}><span>У кошик</span></button>
                        <button className="custom-btn btn-7" onClick={() => handleBuyNowClick(product)}><span>Придбати</span></button>
                    </>
                )}
            </div>
        </div>
        </div>
    );
}

export default ProductDetails;
