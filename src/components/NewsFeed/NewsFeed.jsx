import React, { useState, useEffect } from 'react';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import NewsItem from "../NewsItem/NewsItem";


const NewsFeed = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            const url = 'http://95.217.181.158/api/articles';
            try {
                const response = await fetch(url);
                const data = await response.json();
                setNews(data?.data || []);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="news-container">
            <div className="news-items">
                {news.map((item) => (
                    <NewsItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        imageUrl={item.images && item.images.length > 0 ? item.images[0] : defaultImage}
                    />
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
