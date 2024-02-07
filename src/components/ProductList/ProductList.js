import React, {useEffect, useState} from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
    // const navigate = useNavigate();

    // const handleAddToCart = (product) => {
    //     onAddToCart(product);
    // };
    //
    // const handleBuy = () => {
    //     console.log('Buying', cart);
    //     setTimeout(() => {
    //         console.log('Purchase successful');
    //         navigate('/shop'); // Navigate back to the shop or to '/confirmation' if you have a confirmation page
    //     }, 2000);
    // };
    const [products, setProducts] = useState([]);
    // const [cart, setCart] = useState([]); // Add local cart state (replace with your actual cart state logic)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const navigate = useNavigate();
    // const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Використовуємо URL вашого API для отримання продуктів
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
                    setProducts(data.data); // Оновлюємо стан продуктів даними з API
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


    // Handlers for actions in ProductList
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
        <div>
            <h2>Товари</h2>
            {products && products.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
