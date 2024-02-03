import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ products, onAddToCart, cart, setCart, onDeleteProduct }) => {
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        onAddToCart(product);
    };

    const handleBuy = () => {
        console.log('Buying', cart);
        setTimeout(() => {
            console.log('Purchase successful');
            navigate('/shop'); // Navigate back to the shop or to '/confirmation' if you have a confirmation page
        }, 2000);
    };


    return (
        <div className="product-wrapper">
            {products.map(product => (
                <div key={product.id} className="product-item">
                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                        <h2>{product.title}</h2>
                    </Link>
                    <p>{product.description}</p>
                    <img src={product.image} alt={product.title} style={{ width: '100px' }} />
                    <p>Цена: ${product.price}</p>
                    <div className="product-actions">
                        <button onClick={() => handleAddToCart(product)} className="shop-button">У кошик</button>
                        <button onClick={handleBuy} className='shop-button'>Придбати</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
