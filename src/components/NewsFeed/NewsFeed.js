import React, { useState, useEffect } from 'react';
import './NewsFeed.css';

const NewsFeed = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch('https://example.com/api/news') // Заменить на реальный API
            .then(response => response.json())
            .then(data => setNews(data))
            .catch(error => console.error('Ошибка:', error));
    }, []);

    return (
        <div className="news-feed">
            <h2>Новостная Лента</h2>
            {news.map((item, index) => (
                <div key={index} className="news-item">
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                </div>
            ))}
        </div>
    );
};

export default NewsFeed;
