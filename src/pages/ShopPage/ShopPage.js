import React from 'react';
import ProductList from '../../components/ProductList/ProductList';
import './ShopPage.css';

const ShopPage = () => {
    return (
        <div className="shop-page">
            <h1>Добро пожаловать в магазин!</h1>
            <ProductList />
        </div>
    );
};

export default ShopPage;
