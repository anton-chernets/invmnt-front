import React, {} from 'react';
import ProductList from '../../components/ProductList/ProductList';
import './ShopPage.css';
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
// import { Helmet } from 'react-helmet';
import Sidebar from "../../components/Sidebar/Sidebar";




const ShopPage = () => {
    return (
        // <>
        // <Helmet>
        //     <meta name="description" content="Опис моєї сторінки" />
        //     <meta name="keywords" content="ключові, слова, моєї, сторінки" />
        //     {/* Додаткові мета-теги */}
        // </Helmet>

        <div className="shop-page">
            <Sidebar />
            <div className="scroll-to-top">
                <ScrollToTopButton/>
            </div>
            <ProductList />
        </div>
        // </>
    );
};

export default ShopPage;