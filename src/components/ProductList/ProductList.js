import React from 'react';
import './ProductList.css';

const ProductList = ({ products }) => {
    return (
        <div>
            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <img src={product.image} alt={product.title} style={{ width: '100px' }} />
                    <p>Цена: ${product.price}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductList;

