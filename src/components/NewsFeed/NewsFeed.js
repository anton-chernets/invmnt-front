import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NewsFeed.css';
import Sidebar from "../Sidebar/Sidebar";


const NewsFeed = () => {

    const [news, setNews] = useState([]); // <-- 'setNews' might be used or might need to be removed.

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
                if (data?.articles && Array.isArray(data.articles)) {
                    setNews(data.articles);
                } else {
                    console.error('Field "articles" is missing from the response');
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);
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
                            <Link to={`/news/${index}`} style={{ textDecoration: 'none' }}>
                                <h2>{item.title}</h2>
                                {/* Відображення зображення новини */}
                                <img src={item.urlToImage} alt={item.title} className="news-image" />
                            </Link>
                            <p>{item.description}</p>
                        </div>
                    );
                })}

            </div>
            <Sidebar />
        </div>
    );
};

export default NewsFeed;
