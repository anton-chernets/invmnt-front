import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import './ProductList.css';
import CartPage from "../../pages/CartPage/CartPage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';

const ProductList = () => {
    // const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        setLoading(true);
        const url = 'http://95.217.181.158/api/products';
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data?.data && Array.isArray(data.data)) {
                    setProducts(data.data);
                    setLoading(false);
                } else {
                    throw new Error('Unexpected response from the API');
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    // const onAddToCart = (product) => {
    //     setCart(currentCart => {
    //         const isProductInCart = currentCart.find(item => item.id === product.id);
    //         if (isProductInCart) {
    //             return currentCart.map(item =>
    //                 item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    //             );
    //         }
    //         return [...currentCart, { ...product, quantity: 1 }];
    //     });
    //     console.log('Product added to cart:', product);
    // };

    // const onBuyNow = (product) => {
    //     onAddToCart(product);
    //     navigate('/checkout');
    // };
    //
    // const onDeleteProduct = (productId) => {
    //     setProducts(currentProducts => {
    //         return currentProducts.filter(product => product.id !== productId);
    //     });
    // };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <button onClick={() => setShowCart(!showCart)} className="cart-button">
                <FontAwesomeIcon icon={faShoppingCart} className="icon-spacing"/> Кошик
            </button>
            {showCart && <CartPage cart={cart} setCart={setCart}/>}
            <div className="products-container">
                {products && products.map(product => (
                    <div key={product.id} className="product-item-list">
                        <h3>{product.title}</h3>
                        <img src={product.imageUrl || defaultImage} alt={product.title} className="product-image"/>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
