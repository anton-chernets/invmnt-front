import React, { useState, useEffect } from 'react';
import './SiteStats.css';
import VisitorChart from '../../../components/Chart/Chart';

const SiteStats = ({ visitorData }) => { // Removed stats from props to avoid naming collision
    const [stats, setStats] = useState({
        usersCount: 0,
        productsCount: 0,
        ordersCount: 0,
        // Other statistical data
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/stats'); // Your API URL for stats
            if (!response.ok) {
                throw new Error('Error loading stats');
            }
            const data = await response.json();
            setStats(data); // Updating stats
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="site-stats">
            <h1>Статистика Сайту</h1>
            <div className="stats-container">
                <div className="stat-item">
                    <h2>Користувачів:</h2>
                    <p>{stats.usersCount}</p>
                </div>
                <div className="stat-item">
                    <h2>Товарів:</h2>
                    <p>{stats.productsCount}</p>
                </div>
                <div className="stat-item">
                    <h2>Замовлень:</h2>
                    <p>{stats.ordersCount}</p>
                </div>
                <VisitorChart visitorData={visitorData} />
                {/* Додайте інші статистичні дані */}
            </div>
        </div>
    );
};

export default SiteStats;
