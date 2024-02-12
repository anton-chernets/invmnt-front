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

    const uploadImageAndGetUrl = async (imageFile) => {
        const formData = new FormData();
        formData.append('files', imageFile);
        formData.append('id', 1); // Replace with actual ID if needed
        formData.append('model', 'Article'); // Assuming 'Article' is the model type

        const uploadResponse = await fetch('http://95.217.181.158/api/files/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type' header should not be set manually for FormData
            },
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
        }

        const fileData = await uploadResponse.json();
        console.log('Upload response:', fileData); // Log the response data

        // You will need to adjust the next line based on how your API returns the image URL
        return fileData.imageUrl; // Replace with the actual key that contains the URL
    };

    const handleAddNews = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            let imageUrl = currentNews.imageUrl;

            if (currentNews.imageFile) {
                imageUrl = await uploadImageAndGetUrl(currentNews.imageFile); // This function uploads the image
            }

            const payload = {
                title: currentNews.title,
                description: currentNews.content,
                imageUrl: imageUrl, // Make sure 'imageUrl' is the key your API expects for the image URL
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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setNewsList([...newsList, data]);
            setCurrentNews({ title: '', content: '', imageUrl: '', imageFile: null });
        } catch (error) {
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
