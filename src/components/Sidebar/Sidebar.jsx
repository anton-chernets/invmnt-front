import React from 'react';
import binanceImage from '../../img/binance.jpeg';
import AdComponent from '../AdComponent/AdComponent'; // Исправленный импорт

const Sidebar = () => {
    return (
        <div className="sidebar">
            <AdComponent />
            <div>
            <a href="https://www.binance.com/en/activity/referral-entry/CPA?ref=CPA_006CP4YDRO" target="_blank" rel="noopener noreferrer">
                <img src={binanceImage} alt="Binance" className="binance-img"/>
            </a></div>
        </div>
    );
};

export default Sidebar;
