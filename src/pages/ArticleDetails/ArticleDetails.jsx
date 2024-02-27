import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./ArticleDetails.css";
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import Sidebar from "../../components/Sidebar/Sidebar";

function ArticleDetails() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await fetch(`https://apinvmnt.site/api/articles/show/${articleId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setNewsItem(result.data); // Тут ми звертаємося до data в об'єкті відповіді
      } catch (err) {
        console.error("Помилка при завантаженні новини:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [articleId, navigate]);

  if (loading) {
    return <div className="loading-message">Завантаження деталей новини...</div>;
  }

  if (error) {
    return <div className="error-message">Помилка: {error}</div>;
  }

  if (!newsItem) {
    return <div className="loading-message">Новина не знайдена.</div>;
  }

  const { title, images, description, content } = newsItem;

  return (
    <div className="news-container-detail">
      <div className="news-details">
        <h3>{title}</h3>
        <img src={images && images.length > 0 ? images[0] : defaultImage}
             alt={title} className='news-img'/>
        <p>{description}</p>
        <p>{content}</p>
        <button onClick={() => navigate(-1)} className="custom-btn btn-7"><span>Назад</span></button>
      </div>
      <Sidebar />
    </div>
  );
}

export default ArticleDetails;
