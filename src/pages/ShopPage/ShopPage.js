import React, { useState, useEffect } from 'react';
import ProductList from '../../components/ProductList/ProductList';
import './ShopPage.css';

const ShopPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Использование Fake Store API для демонстрационных целей
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Ошибка:', error));


    }, []);

    return (
        <div className="shop-page">
            <h1>Добро пожаловать в магазин!</h1>
            <ProductList products={products} />
        </div>
    );
};

export default ShopPage;
