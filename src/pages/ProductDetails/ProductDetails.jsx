import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';
import { AuthContext } from '../../components/AuthContext/AuthContext';
import CartPage from "../../components/CartPage/CartPage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function ProductDetails() {
    const [quantities, setQuantities] = useState({});
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const isUser = user && user.role === 'customer';
    const token = localStorage.getItem('authToken');
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
            setProduct(data.data);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProduct();
      }, [productId]);

    const goBack = () => {
        navigate(-1);
    };

    const onAddToCart = (product) => {
        setCart(currentCart => {
            const productIndex = currentCart.findIndex(item => item.id === product.id);
            const quantityToAdd = quantities[product.id] || 1; 
    
            let newCart;
            if (productIndex !== -1) {
                newCart = currentCart.map((item, index) =>
                    index === productIndex ? { ...item, quantity: item.quantity + quantityToAdd } : item
                );
            } else {
                newCart = [...currentCart, { ...product, quantity: quantityToAdd }];
            }
    
            localStorage.setItem('cart', JSON.stringify(newCart));
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
      navigate('/login');
    } else {
      const quantityToBuy = quantities[product.id] || 1;
      onBuyNow(product, quantityToBuy);
    }
  };
  async function onBuyNow(product, quantity) {
    const orderDetails = {
      products: [
        {
          id: product.id,
          quantity: quantity,
        },
      ],
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
    } catch (error) {
        console.error('Checkout failed:', error);
        alert('An error occurred during checkout. Please try again.');
    }
}

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>Product not found</p>;

    const productDetails = product;

    return (
        <div className='details-wrap'>
            {isUser && (
                    <>
                        <button onClick={() => setShowCart(!showCart)} className="custom-btn btn-7" aria-label="Toggle cart visibility">
                        <span><FontAwesomeIcon icon={faShoppingCart} className="icon-spacing" /> Кошик</span>
                        </button>
                        {showCart && isUser && <CartPage cart={cart} setCart={setCart} />}
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
                    <div className='quantity'>
                            <label htmlFor={`quantity-${product.id}`}>Кількість:</label>
                            <input
                                type="number"
                                id={`quantity-${product.id}`}
                                value={quantities[product.id] || 1}
                                onChange={(e) => setQuantities({ ...quantities, [product.id]: Math.max(1, parseInt(e.target.value, 10)) })}
                                min="1"
                                style={{ width: '60px' }}
                            />
                        </div>
                        <button className="custom-btn btn-7" onClick={() => onAddToCart(product)}><span>У кошик</span></button>
                        <button className="custom-btn btn-7" onClick={() => handleBuyNowClick(product)}><span>Придбати</span></button>
                    </>
                )}
                {!user && (
                    <>
                    <div className='quantity'>
                            <label htmlFor={`quantity-${product.id}`}>Кількість:</label>
                            <input
                                type="number"
                                id={`quantity-${product.id}`}
                                value={quantities[product.id] || 1}
                                onChange={(e) => setQuantities({ ...quantities, [product.id]: Math.max(1, parseInt(e.target.value, 10)) })}
                                min="1"
                                style={{ width: '60px' }}
                            />
                        </div>
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
