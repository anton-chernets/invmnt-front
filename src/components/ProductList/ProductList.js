import React from 'react';
import './ProductList.css';

const ProductList = ({ products = [], onDeleteProduct, onAddToCart, onBuyNow }) => {
    return (
        <div className="product-wrapper">
            {products.map(product => (
                <div key={product.id} className="product-item">
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <img src={product.image} alt={product.title} style={{ width: '100px' }} />
                    <p>Цена: ${product.price}</p>
                    <div className="product-actions">
                        <button onClick={() => onAddToCart(product)}>Додати у кошик</button>
                        <button onClick={() => onBuyNow(product)}>Купити</button>
                        {onDeleteProduct && (
                            <button onClick={() => onDeleteProduct(product.id)}>Видалити</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;

