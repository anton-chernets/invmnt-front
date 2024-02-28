import React, { useState, useEffect } from 'react';

const ManageNews = () => {
    const [articles, setArticles] = useState([]);
    const [editingArticleId, setEditingArticleId] = useState(null);

    const [newArticles, setNewArticles] = useState({
        title: '',
        description: '',
        // image: null, // For image file
    });

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('https://apinvmnt.site/api/articles');
                if (!response.ok) {
                    throw new Error(`Failed to fetch articles: ${response.status}`);
                }
                const data = await response.json();
                if (!data || !data.data || !Array.isArray(data.data)) {
                    throw new Error('Fetched data is not in expected format');
                }
                setArticles(data.data);
            } catch (error) {
                console.error('Error loading products:', error);
            }
        };
        fetchArticles();
    }, []);


    const handleAddArticles = async (articlesData, file) => {
        const articlesPayload = {
            title: articlesData.title,
            description: articlesData.description,
        };
    
        try {
            const articlesResponse = await fetch('https://apinvmnt.site/api/articles/store', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(articlesPayload),
            });
            if (!articlesResponse.ok) {
                throw new Error('Article creation failed');
            }
            const articleData = await articlesResponse.json();
            const articleId = articleData.data.id;

            if (file && articleId) {
                const formData = new FormData();
                formData.append('id', articleId); // Use the product ID from the product creation response
                formData.append('model', 'Article')
                formData.append('files', file);
    
                const fileUploadResponse = await fetch('https://apinvmnt.site/api/files/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // 'Content-Type' header is not needed with FormData
                    },
                    body: formData,
                });
    
                if (!fileUploadResponse.ok) {
                    throw new Error(`File upload failed with status: ${fileUploadResponse.status}`);
                }
    
                const fileUploadData = await fileUploadResponse.json();
                if (!fileUploadData.success) {
                    throw new Error('File upload did not return success status');
                }
                // Handle the response, such as updating state or UI
            }
    
            // Update the product list state with the new product
            setArticles(prevArticles => [...prevArticles, articleData.data]);
    
            // Reset the newProduct state to clear the form
            setNewArticles({
                title: '',
                description: '',
                image: null,
            });
    
        } catch (error) {
            console.error('Error in product creation or file upload:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddArticles(newArticles, newArticles.image);
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setNewArticles({ ...newArticles, image: files[0] });
        } else {
            setNewArticles({ ...newArticles, [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value });
        }
    };

    const handleDeleteArticle = async (articleId) => {
        try {
            const response = await fetch(`https://apinvmnt.site/api/articles/remove`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: articleId }),
            });
            if (!response.ok) {
                throw new Error(`Failed to delete article: ${response.status}`);
            }
            // If delete is successful, filter out the deleted article from the articles state
            setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    const EditArticleForm = ({ article, onSave }) => {
        const [formData, setFormData] = useState({...article, image: null});
    
        const handleChange = (e) => {
            const { name, value, type, files } = e.target;
            if (type === 'file') {
                setFormData({ ...formData, image: files[0] });
            } else {
                setFormData({ ...formData, [name]: value });
            }
        };
    
        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(formData);
        };

        return (
            <form onSubmit={handleSubmit} className="edit-product-form">
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Назва" />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Опис" />
                <input
                name="image"
                type="file"
                onChange={handleChange}
            />
                <button type="submit"className="custom-btn btn-7"><span>Зберегти зміни</span></button>
            </form>
        );
    };

    const saveArticleChanges = async (updatedArticle) => {
        try {
            const response = await fetch(`https://apinvmnt.site/api/articles/update/${updatedArticle.id}`, {
                method: 'POST', // Or 'PUT' if your API requires it for updates
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updatedArticle.title,
                    description: updatedArticle.description,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            setArticles(prevArticles => prevArticles.map(p => p.id === result.data.id ? result.data : p));
            setEditingArticleId(null);
        } catch (error) {
            console.error('Error updating product:', error);
        }
        if (updatedArticle.image) {
            // Similar to handleAddProduct, upload the image file here
            const formData = new FormData();
            formData.append('id', updatedArticle.id); // Assuming this is the product ID
            formData.append('model', 'Article'); // Adjust based on your API
            formData.append('files', updatedArticle.image);
    
            try {
                const fileUploadResponse = await fetch('https://apinvmnt.site/api/files/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // Content-Type is not needed for FormData
                    },
                    body: formData,
                });
    
                if (!fileUploadResponse.ok) {
                    throw new Error(`File upload failed with status: ${fileUploadResponse.status}`);
                }
    
                const fileUploadData = await fileUploadResponse.json();
                if (!fileUploadData.success) {
                    throw new Error('File upload did not return success status');
                }
                // Optionally handle the response, such as updating the UI or state
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    return (
        <div className="manage-products">
            <form onSubmit={handleSubmit} className="add-product-form">
                <input
                    id="title"
                    name="title"
                    type="text"
                    className="form-control"
                    placeholder="Enter news title"
                    value={newArticles.title}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="5"
                    placeholder="Enter news description"
                    value={newArticles.content}
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="image"
                    type="file"
                    onChange={handleInputChange}
                />
            <button type="submit" className="custom-btn btn-7"><span>Додати новину</span></button>

            </form>
            <div className="editen-prod">
                {articles.map(article => (
                    editingArticleId === article.id ? (
                        <EditArticleForm key={article.id} article={article} onSave={saveArticleChanges} />
                    ) : (
                    <div key={article.id} className="article">
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        {/* Display image if it exists */}
                        {article.image && <img src={article.image} alt={article.title} />}
                        <button onClick={() => setEditingArticleId(article.id)}className="custom-btn btn-7"><span>Редагувати</span></button>
                        <button className="custom-btn btn-7" onClick={() => handleDeleteArticle(article.id)}><span>Видалити новину</span></button>
                    </div>
                    )
                ))}
            </div>
            </div>
            
    );
};

export default ManageNews;
