import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import ProductList from '../../components/ProductList/ProductList';
import './ShopPage.css';
import CartPage from '../CartPage/CartPage';
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";


const ShopPage = () => {


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