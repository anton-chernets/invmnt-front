import React from 'react';
import './Sidebar.css'; // Путь к файлу стилей для Sidebar
import binanceImage from '../../img/binance.jpeg'; // Путь к изображению

const Sidebar = () => {
    return (
        <div className="sidebar">
            <a href="https://www.binance.com/en/activity/referral-entry/CPA?ref=CPA_006CP4YDRO" target="_blank" rel="noopener noreferrer">
                <img src={binanceImage} alt="Binance" className="binance-img"/>
            </a>
        </div>
    );
};

export default Sidebar;