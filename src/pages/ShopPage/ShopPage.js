import React, {} from 'react';

import ProductList from '../../components/ProductList/ProductList';
import './ShopPage.css';

import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";


const ShopPage = () => {


    return (

        <div className="shop-page">
            <div className="scroll-to-top">
                <ScrollToTopButton/>
            </div>
            <ProductList />
        </div>
    );
};

export default ShopPage;