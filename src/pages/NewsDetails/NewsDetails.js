import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./NewsDetails.css";

function NewsDetails() {
  const { newsId } = useParams();
  const [newsItem, setNewsItem] = useState(null);

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
        // Конвертуємо newsId у число
        const index = parseInt(newsId, 10);
        // Використовуємо newsId як індекс для доступу до новини
        const article = data.articles[index];
        if (article) {
          setNewsItem(article);
        } else {
          setNewsItem(null);
        }
      })
      .catch(err => console.error("Помилка при завантаженні новини:", err));
  }, [newsId]);

  if (!newsItem) {
    return <div className="loading-message">Новина не знайдена або завантаження деталей новини...</div>;
  }

  return (
    <div className="news-details">
      <h1>{newsItem.title}</h1>
      <img src={newsItem.urlToImage} alt={newsItem.title} className='news-img'/>
      <p>{newsItem.description}</p>
      <p>{newsItem.content}</p>
      {/* Відображення деталей новини */}
    </div>
  );
}

export default NewsDetails;


