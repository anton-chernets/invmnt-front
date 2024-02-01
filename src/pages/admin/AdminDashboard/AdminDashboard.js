import React, { useState } from 'react';
import './AdminDashboard.css';
import ManageProducts from "../ManageProducts/ManageProducts";
import ManageUsers from "../ManageUsers/ManageUsers";
import ManageOrders from "../ManageOrders/ManageOrders";
import UserMessages from "../UserMessages/UserMessages";
import SiteStats from "../SiteStats/SiteStats";
// Імпортуйте інші компоненти управління тут

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState(''); // Для відслідковування активної секції

    const handleSectionClick = (sectionName) => {
        setActiveSection(sectionName);
    };


    // Функція для відображення вмісту в залежності від activeSection
    const renderContent = () => {
        switch (activeSection) {
            case 'users':
                return <ManageUsers />;
            case 'products':
                return <ManageProducts />;
            case 'orders':
                return <ManageOrders />;
            case 'messages':
                return <UserMessages />;
            case 'stats':
                return <SiteStats />;
            
            // Додайте інші case для інших секцій
            default:
                return <ManageUsers />;
        }
    };

    return (
        
        <div className='admin-dashboard'>
            <div className="sidebar-panel">
                <button onClick={() => handleSectionClick('users')} className="button-admin">Управление пользователями</button>
                <button onClick={() => handleSectionClick('products')} className="button-admin">Управление товарами</button>
                <button onClick={() => handleSectionClick('orders')} className="button-admin">Управление заказами</button>
                <button onClick={() => handleSectionClick('messages')} className="button-admin">Сообщения пользователей</button>
                <button onClick={() => handleSectionClick('stats')} className="button-admin">Статистика сайта</button>
            </div>
            <div className="content">
                {renderContent()}
            </div>
        </div>
        
    );
};

export default AdminDashboard;
