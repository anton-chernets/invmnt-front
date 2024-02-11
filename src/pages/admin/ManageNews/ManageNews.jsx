import React, { useState, useEffect } from 'react';
import './ManageNews.css';

const ManageNews = () => {
    const [newsList, setNewsList] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentNews, setCurrentNews] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            const url = 'http://95.217.181.158/api/articles';

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();

                if (data?.data && Array.isArray(data.data)) {
                    setNewsList(data.data);
                } else {
                    setError(new Error('Field "data" is missing from the response'));
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handleAddNews = async (event) => {
        event.preventDefault();
        setLoading(true);

        const payload = {
            title: currentNews.title,
            description: currentNews.content,
            // images: currentimages.images
        };

        try {
            const response = await fetch('http://95.217.181.158/api/articles/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setNewsList([...newsList, data.data]);
                setCurrentNews({ title: '', content: '' });
            } else {
                // Обробка помилок, якщо API повертає відповідь зі статусом помилки
                throw new Error(data.message || 'Не вдалося створити новину');
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    const handleEditNews = async (newsId) => {
        // Функція для редагування новини
    };

    const handleDeleteNews = async (newsId) => {
        try {
            const response = await fetch(`http://95.217.181.158/api/articles/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: newsId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                setNewsList(prevNewsList => prevNewsList.filter(news => news.id !== newsId));
                console.log('News deleted successfully');
            } else {
                // Обробка ситуації, коли новина не видалена
                console.error('Failed to delete the news');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="manage-news">

            {/* Форма для додавання або редагування новин */}
            <form onSubmit={editMode ? () => handleEditNews(currentNews.id) : handleAddNews} className='form-manager'>
                <h1>Керування новинами</h1>
                <input
                type="text"
                placeholder="Назва новини"
                value={currentNews.title}
                onChange={(e) => setCurrentNews({...currentNews, title: e.target.value})}
                required
            />
                <textarea
                    placeholder="Контент новини"
                    value={currentNews.content}
                    onChange={(e) => setCurrentNews({...currentNews, content: e.target.value})}
                    required
                />
                {/*<input*/}
                {/*    type="text"*/}
                {/*    placeholder="URL зображення"*/}
                {/*    value={currentNews.imageUrl}*/}
                {/*    onChange={(e) => setCurrentNews({...currentNews, imageUrl: e.target.value})}*/}
                {/*/>*/}
                <button type="submit">{editMode ? 'Редагувати' : 'Додати'}</button>
            </form>

            {/* Список усіх новин */}
            <div className="news-list">
                {newsList.map((newsItem) => (
                    <div key={newsItem.id} className="news-item">
                        <h3>{newsItem.title}</h3>
                        <p>{newsItem.content}</p>
                        <button onClick={() => {
                            setEditMode(true);
                            setCurrentNews(newsItem);
                        }}>Редагувати
                        </button>
                        <button onClick={() => handleDeleteNews(newsItem.id)}>Видалити</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageNews;
