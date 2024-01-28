import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NewsFeed.css';

const NewsFeed = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const apiKey = '85f5aebd9d3d4d74a93715856a5a5693';
        const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.articles) {
                    setNews(data.articles);
                } else {
                    console.error('Поле "articles" відсутнє у відповіді');
                }
            })
            .catch(error => console.error('Ошибка:', error));
    }, []);

    let sidebarContent;
    return (
        <div className="news-container">
            
            <div className="news-items">
                <div className="news-header">
                    <h1>Новости</h1>
                </div>
                
                {news.map((item, index) => {
                    const key = `${item.title}-${item.publishedAt}`; // Унікальний ключ
                    return (
                        <div className="news-item" key={key}>
                            <Link to={`/news/${index}`}style={{ textDecoration: 'none' }}>
                                <h2>{item.title}</h2>
                                {/* Відображення зображення новини */}
                                <img src={item.urlToImage} alt={item.title} className="news-image" />
                            </Link>
                            <p>{item.description}</p>
                        </div>
                    
                    );
                    
                })}

            </div>
            <div className="sidebar">
                {/* Тут можуть бути фрейми, графіки, реклама */}
                {sidebarContent}
            </div>
        </div>
    );
};

export default NewsFeed;
