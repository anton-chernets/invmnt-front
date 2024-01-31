import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ShopPage from './pages/ShopPage/ShopPage';
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts/ManageProducts';
import ManageUsers from './pages/admin/ManageUsers/ManageUsers';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import UserProfile from "./pages/UserProfile/UserProfile";
import ProductDetails from './pages/ProductDetails/ProductDetails';
import NewsDetails from './pages/NewsDetails/NewsDetails';
import Checkout from './pages/Checkout/Checkout';
import CartPage from "./pages/CartPage/CartPage";


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
        metaTag.content = 'noindex, nofollow';
        document.head.appendChild(metaTag);

        // Функция очистки, удаляющая добавленные элементы
        return () => {
            document.body.removeChild(script);
            document.body.removeChild(script2);
            document.head.removeChild(metaTag);
        };
    }, []);

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<ManageProducts />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/user" element={<UserProfile />} />
                <Route path="/products/:productId" element={<ProductDetails />} />
                <Route path="/news/:newsId" element={<NewsDetails />} />
                <Route path="/checkout" element={<Checkout  />} />
                <Route path="/cart" element={<CartPage />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
