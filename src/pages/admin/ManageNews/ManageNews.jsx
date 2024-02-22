import React, { useState, useEffect } from 'react';
import defaultImage from '../../../img/image_2024-02-07_10-47-09.png';


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
                const response = await fetch('https://apinvmnt.site/api/articles');
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

    async function uploadImage(imageFile) {
        if (!imageFile) {
            return null;
        }

        const formData = new FormData();
        formData.append('files', imageFile);
        formData.append('id', '1');
        formData.append('model', 'Article');

        try {
            const uploadResponse = await fetch('https://apinvmnt.site/api/files/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
            }

            const responseBody = await uploadResponse.text();
            try {

                const responseJson = JSON.parse(responseBody);

                console.log('Upload response:', responseJson);

                return responseJson.data;
            } catch (jsonError) {

                console.error('Response is not valid JSON:', responseBody);
                throw jsonError;
            }
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    }




    const handleAddNews = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            let imageId = null;
            if (currentNews.imageFile) {
                imageId = await uploadImage(currentNews.imageFile); // Загрузка изображения и получение его ID
            }

            const payload = {
                title: currentNews.title,
                description: currentNews.content,
                imageId: imageId, // Используется ID изображения
            };

            const response = await fetch('https://apinvmnt.site/api/articles/store', {
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
            setCurrentNews({ title: '', content: '', imageUrl: '', imageFile: null }); // Сброс текущей новости
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };



    const handleEditNews = async (newsId) => {
    };

    const handleDeleteNews = async (newsId) => {
        if (window.confirm('Ви впевнені, що хочете видалити статтю?')) {
        try {
            const response = await fetch(`https://apinvmnt.site/api/articles/remove`, {
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
                console.error('Failed to delete the news');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
                <button className="custom-btn btn-7" type="submit"><span>{editMode ? 'Update News' : 'Add News'}</span></button>
            </form>

            {/* Список усіх новин */}
            <div className="news-list">
                    {newsList.map((newsItem) => (
                        <div key={newsItem.id} className="news-item">
                            <h3>{newsItem.title}</h3>
                        <img
                        src={newsItem.urlToImage || defaultImage}
                        alt={newsItem.title || 'Default'}
                        className="news-image-trash"
          />
          <p>{newsItem.description}</p>


                        <button className="custom-btn btn-7" onClick={() => {
                            setEditMode(true);
                            setCurrentNews(newsItem);
                        }}><span>Редагувати</span>
                        </button>
                        <button className="custom-btn btn-7" onClick={() => handleDeleteNews(newsItem.id)}><span>Видалити</span>
                            </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageNews;
