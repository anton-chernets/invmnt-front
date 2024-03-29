import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async'; 
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ShopPage from './pages/ShopPage/ShopPage';
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
// import ManageProducts from './pages/admin/ManageProducts/ManageProducts';
// import ManageUsers from './pages/admin/ManageUsers/ManageUsers';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import UserProfile from "./pages/UserProfile/UserProfile";
import ProductDetails from './pages/ProductDetails/ProductDetails';
import ArticleDetails from './pages/ArticleDetails/ArticleDetails';
import Checkout from './components/Checkout/Checkout';
import CartPage from "./components/CartPage/CartPage";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import {AuthProvider} from "./components/AuthContext/AuthContext";
import SuccessPage from "./pages/SuccessPage/SuccessPage";
import ProductList from "./components/ProductList/ProductList";
import { ThemeProvider } from './components/ThemeContext/ThemeContext';
import SearchResultsPage from './components/SearchResultsPage/SearchResultsPage';

import './App.css';


function App() {

    useEffect(() => {
        // Создание и добавление скриптов Google Analytics
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-QVZGK6MZGK';
        script.async = true;

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QVZGK6MZGK');
        `;

        document.body.appendChild(script);
        document.body.appendChild(script2);

        // Создание и добавление meta tag
        const metaTag = document.createElement('meta');
        metaTag.name = 'robots';
        metaTag.content = 'index, follow';

        document.head.appendChild(metaTag);

        // Функция очистки, удаляющая добавленные элементы
        return () => {
            document.body.removeChild(script);
            document.body.removeChild(script2);
            document.head.removeChild(metaTag);
        };
    }, []);

    return (
        
        <HelmetProvider>
            
        <AuthProvider>
            
            <ThemeProvider>
            <Router>
                <Helmet>
                    <meta charSet="UTF-8"/>
                    <title>Інвестиції та Фінанси</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <meta name="keywords"
                          content="інвестиції, фінанси, інвестиційний портфель, акції, облігації, фондовий ринок, фінансові поради"/>
                    <meta name="description"
                          content="Сайт про інвестиції та фінанси, де ви можете знайти корисну інформацію про різні види інвестування, фінансові поради та останні новини зі світу фінансів."/>
                    <meta property="og:locale" content="uk_UA"/>
                    <meta property="og:title" content="Інвестиції"/>
                    <meta property="og:description" content="Інвестиції: види інвестицій"/>
                    <meta property="og:url" content="https://invmnt.site/"/>
                    <meta name="google-adsense-account" content="ca-pub-9704083006647691"/>
                    <meta name="author" content="Invmnt"/>

                </Helmet>
                <Header/>
                <Routes>
                <Route path="/" element={<HomePage/>}/>
                        <Route path="/shop" element={<ShopPage/>}/>
                        <Route path="/admin" element={<AdminDashboard/>}/>
                        {/* <Route path="/admin/products" element={<ManageProducts/>}/> */}
                        {/*<Route path="/admin/users" element={<ManageUsers/>}/>*/}
                        <Route path="/login" element={<LoginForm/>}/>
                        <Route path="/register" element={<RegisterForm/>}/>
                        <Route path="/user" element={<UserProfile/>}/>
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/search/articles/show/:alias" element={<ArticleDetails />} />
                        <Route path="/search/articles/show/:articleId" element={<ArticleDetails />} />
                        <Route path="/search/products/show/:productId" element={<ProductDetails />} />
                        <Route path="/search/products/show/:alias" element={<ProductDetails />} />
                        <Route path="/articles/show/:id" element={<ArticleDetails />} />
                        <Route path="/articles/show/:alias" element={<ArticleDetails />} />
                        <Route path="/products/show/:productId" element={<ProductDetails />} />
                        <Route path="/products/show/:alias" element={<ProductDetails />} />
                        <Route path="/checkout" element={<Checkout/>}/>
                        <Route path="/cart" element={<CartPage/>}/>
                        <Route path="/passwordreset" element={<PasswordReset/>}/>
                        <Route path="/search" element={<SearchResultsPage />} />
                        <Route path="/success" element={<SuccessPage />} />
                    </Routes>
                
            </Router>
            
            </ThemeProvider>
            
                <Footer />
            
        </AuthProvider>
                    
        </HelmetProvider>
        
        
    );
}

export default App;
