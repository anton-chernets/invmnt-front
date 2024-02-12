import React, { useState, useEffect } from 'react';
import './ManageNews.css';


const ManageNews = () => {
    const [newsList, setNewsList] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentNews, setCurrentNews] = useState({ title: '', content: '', imageUrl: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);

            try {
                const response = await fetch('http://95.217.181.158/api/articles');
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

        try {

            const payload = {
                title: currentNews.title,
                description: currentNews.content,
            };

            const response = await fetch('http://95.217.181.158/api/articles/store', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Read the raw response to get the error message
                throw new Error(`Failed to add news: ${errorText}`);
            }

            const data = await response.json();
            setNewsList([...newsList, data]);
            setCurrentNews({ title: '', content: '', imageUrl: '', imageFile: null });

        } catch (error) {
            console.error('Error adding news:', error);
            setError(error.message);
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

            <form onSubmit={editMode ? () => handleEditNews(currentNews.id) : handleAddNews} className='form-manager'>
                <h1>{editMode ? 'Edit News' : 'Add News'}</h1>
                <input
                    type="text"
                    placeholder="News Title"
                    value={currentNews.title}
                    onChange={(e) => setCurrentNews({...currentNews, title: e.target.value})}
                    required
                />
                <textarea
                    placeholder="News Content"
                    value={currentNews.content}
                    onChange={(e) => setCurrentNews({...currentNews, content: e.target.value})}
                    required
                />
                <input
                    type="file"
                    onChange={(e) => setCurrentNews({...currentNews, imageFile: e.target.files[0]})}
                />
                <button type="submit">{editMode ? 'Update News' : 'Add News'}</button>
            </form>

            {/* Список усіх новин */}
            <div className="news-list">


                {newsList.map((newsItem) => (
                    <div key={newsItem.id} className="news-item">
                        <h3>{newsItem.title}</h3>
                        {newsItem.imageUrl &&
                            <img src={newsItem.imageUrl} alt={newsItem.title} className="news-image"/>}
                        <p>{newsItem.description}</p>


                        <button onClick={() => {
                            setEditMode(true);
                            setCurrentNews(newsItem);
                        }}>Edit
                        </button>
                        <button onClick={() => handleDeleteNews(newsItem.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageNews;
