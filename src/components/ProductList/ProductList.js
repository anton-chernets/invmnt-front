import React from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ products, onAddToCart, onBuyNow, onDeleteProduct }) => {
    // Handlers
    const handleAddToCart = (product) => {
        onAddToCart(product);
    };

    const handleBuyNow = (product) => {
        onBuyNow(product);
    };

    const handleDeleteProduct = (productId) => {
        onDeleteProduct(productId);
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
                        <button onClick={() => handleAddToCart(product)} className="shop-button">Добавить в корзину</button>
                        <button onClick={() => handleBuyNow(product)} className="shop-button">Купить сейчас</button>
                        {onDeleteProduct && (
                            <button onClick={() => handleDeleteProduct(product.id)} className="shop-button">Удалить</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
