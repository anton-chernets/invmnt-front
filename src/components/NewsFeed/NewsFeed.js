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


    let sidebarContent;
    return (
        <div className="news-container">
            <div className="news-items">
                <h1>Новости</h1>
                {/* Тут буде виведення новин */}
                {news.map((item) => (
                    <div className="news-item" key={item.id}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
            <div className="sidebar">
                {/* Тут можуть бути фрейми, графіки, реклама */}
                {sidebarContent}
            </div>
        </div>
    );
};

export default NewsFeed;
