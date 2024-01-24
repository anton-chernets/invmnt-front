import React, { useState, useEffect } from 'react';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('https://example.com/api/products') // Заменить на реальный API
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Ошибка:', error));
    }, []);

    return (
        <div className="product-list">
            <h2>Товары Магазина</h2>
            {products.map((product, index) => (
                <div key={index} className="product-item">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
