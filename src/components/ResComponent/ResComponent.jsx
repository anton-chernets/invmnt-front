import React, { useState, useEffect } from 'react';

const TrashedNews = () => {
    const [trashedArticles, setTrashedArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage

    useEffect(() => {
        setLoading(true);
        const fetchTrashedNews = async () => {
            try {
                const response = await fetch('https://apinvmnt.site/api/articles/trashed', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setTrashedArticles(result.data || []);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrashedNews();
    }, [token]);

    const restoreArticle = async (newsId) => {
        setLoading(true);
        try {
            const response = await fetch('https://apinvmnt.site/api/articles/restore', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: newsId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                // Remove the restored article from the trashed list
                setTrashedArticles(trashedArticles.filter(news => news.id !== newsId));
                alert('Article restored successfully');
            } else {
                throw new Error('Failed to restore the article');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="trashed-news-container">
            <h1>Trashed News</h1>
            {trashedArticles.length > 0 ? (
                trashedArticles.map(article => (
                    <div key={article.id} className="trashed-article">
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        <button className="custom-btn btn-7" onClick={() => restoreArticle(article.id)}><span>Відновлення</span></button>
                    </div>
                ))
            ) : (
                <p>No trashed articles found</p>
            )}
        </div>
    );
};

export default TrashedNews;
