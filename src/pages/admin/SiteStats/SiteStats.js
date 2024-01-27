import React, { useState, useEffect } from 'react';
import './SiteStats.css';

const SiteStats = () => {
    const [stats, setStats] = useState({
        usersCount: 0,
        productsCount: 0,
        ordersCount: 0,
        // Інші статистичні дані
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/stats'); // URL вашого API для статистики
            if (!response.ok) {
                throw new Error('Помилка при завантаженні статистики');
            }
            const data = await response.json();
            setStats(data); // Оновлення статистики
        } catch (error) {
            console.error('Помилка:', error);
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
                {/* Додайте інші статистичні дані */}
            </div>
        </div>
    );
};

export default SiteStats;
