import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import ProductList from '../../components/ProductList/ProductList';
import './ShopPage.css';
import CartPage from '../CartPage/CartPage';
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";


const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]); // Add local cart state (replace with your actual cart state logic)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    // Handlers for actions in ProductList
    const onAddToCart = (product) => {
        setCart(currentCart => {
            const isProductInCart = currentCart.find(item => item.id === product.id);
            if (isProductInCart) {
                return currentCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentCart, { ...product, quantity: 1 }];
        });
        console.log('Product added to cart:', product);
    };

    // const onBuyNow = (product) => {
    //     onAddToCart(product);
    //     navigate('/checkout');
    //     console.log('Proceeding to checkout with product:', product);
    // };

    const onDeleteProduct = (productId) => {
        // Assuming you have a state for products and a method to update it
        setProducts(currentProducts => {
            // Remove the product from the products array
            return currentProducts.filter(product => product.id !== productId);
        });

        console.log('Product deleted:', productId);
        // Optionally, sync with backend here
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (

        <div className="shop-page">
            <div className="scroll-to-top">
                <ScrollToTopButton/>
            </div>
            {/*<h1>Добро пожаловать в магазин!</h1>*/}
            <button onClick={() => setShowCart(!showCart)} className="cart-button">
                {showCart ? 'Кошик' : 'Кошик'}
            </button>
            {showCart && <CartPage cart={cart} setCart={setCart}/>}
            <ProductList
                products={products}
                onAddToCart={onAddToCart}
                onDeleteProduct={onDeleteProduct}
            />
        </div>
    );
};

export default ShopPage;