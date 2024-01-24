import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ShopPage from './pages/ShopPage/ShopPage';
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts/ManageProducts';
import ManageUsers from './pages/admin/ManageUsers/ManageUsers';
import AdminLogin from './pages/admin/AdminLogin/AdminLogin';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<ManageProducts />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/login" element={<AdminLogin />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
