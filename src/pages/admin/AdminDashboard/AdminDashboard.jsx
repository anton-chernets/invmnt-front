import React, { useState } from 'react';
import './AdminDashboard.css';
import ManageProducts from "../ManageProducts/ManageProducts";
// import ManageUsers from "../ManageUsers/ManageUsers";
import ManageOrders from "../ManageOrders/ManageOrders";
import UserMessages from "../UserMessages/UserMessages";
import SiteStats from "../../../components/SiteStats/SiteStats";
import ResComponent from "../../../components/TrashedNews/TrashedNews";
import ManageNews from "../ManageNews/ManageNews";
import TrashedProducts from '../../../components/TrashedProducts/TrashedProducts';




const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState(''); // Для відслідковування активної секції

    const handleSectionClick = (sectionName) => {
        setActiveSection(sectionName);
    };


    // Функція для відображення вмісту в залежності від activeSection
    const renderContent = () => {
        switch (activeSection) {
            // case 'users':
            //     return <ManageUsers />;
            case 'news':
                return <ManageNews />;
            case 'products':
                return <ManageProducts />;
            case 'orders':
                return <ManageOrders />;
            case 'messages':
                return <UserMessages />;
            case 'stats':
                return <SiteStats />;
            case 'trashed':
                return <ResComponent />;
            case 'producttrashed':
                return <TrashedProducts />;
            
            
            // Додайте інші case для інших секцій
            default:
                return <ManageNews />;
        }
    };

    return (
        
        <div className='admin-dashboard'>
            <div className="sidebar-panel">
                {/*<button onClick={() => handleSectionClick('users')} className="button-admin">Керування користувачами</button>*/}
                <button onClick={() => handleSectionClick('products')} className="custom-btn btn-7"><span>Керування товарами</span>
                </button>
                <button onClick={() => handleSectionClick('producttrashed')} className="custom-btn btn-7"><span>Видалені товари</span>
                </button>
                <button onClick={() => handleSectionClick('news')} className="custom-btn btn-7"><span>Керування новинами</span>
                </button>
                <button onClick={() => handleSectionClick('trashed')} className="custom-btn btn-7"><span>Видалені новини</span>
                </button>
                <button onClick={() => handleSectionClick('orders')} className="custom-btn btn-7"><span>Управління замовленнями</span>
                </button>
                <button onClick={() => handleSectionClick('messages')} className="custom-btn btn-7"><span>Повідомлення
                    користувачів</span>
                </button>
                <button onClick={() => handleSectionClick('stats')} className="custom-btn btn-7"><span>Статистика сайту</span></button>
            </div>
            <div className="content">
                {renderContent()}
            </div>
        </div>

    );
};

export default AdminDashboard;
