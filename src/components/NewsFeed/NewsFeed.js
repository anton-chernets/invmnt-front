import React, { useState, useEffect } from 'react';
import './NewsFeed.css';

const NewsFeed = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const apiKey = '85f5aebd9d3d4d74a93715856a5a5693';
        const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => setNews(data.articles)) // Предполагается, что ответ содержит поле 'articles'
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
