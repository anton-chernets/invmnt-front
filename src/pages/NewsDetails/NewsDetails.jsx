import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./NewsDetails.css";
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import Sidebar from "../../components/Sidebar/Sidebar";


function NewsDetails() {
  const { newsId } = useParams();
  const [newsItem, setNewsItem] = useState(null);

    useEffect(() => {
        // Отримуємо весь список новин
        const url = `https://apinvmnt.site/api/articles`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Знаходимо новину з потрібним id у масиві новин
                const newsDetail = data.data.find(article => article.id.toString() === newsId);
                if (newsDetail) {
                    setNewsItem(newsDetail);
                } else {
                    // Якщо новина з даним id не знайдена, встановлюємо null
                    setNewsItem(null);
                }
            })
            .catch(err => console.error("Помилка при завантаженні новини:", err));
    }, [newsId]);

  if (!newsItem) {
    return <div className="loading-message">Новина не знайдена або завантаження деталей новини...</div>;
  }

    return (
        <div className="news-container-detail">
                <div className="news-details">

                <h3>{newsItem.title}</h3>
                <img src={newsItem.images && newsItem.images.length > 0 ? newsItem.images[0] : defaultImage}
                     alt={newsItem.title} className='news-img'/>

                <p>{newsItem.description}</p>
                <p>{newsItem.content}</p>
                {/* Відображення деталей новини */}

                </div>
            <Sidebar />
        </div>

    );
}

export default NewsDetails;


