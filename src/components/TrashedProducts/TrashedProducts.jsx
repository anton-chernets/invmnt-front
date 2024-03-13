import React, { useState, useEffect } from 'react';
import './TrashedProducts.css'
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';

const TrashedProducts = () => {
    const [trashedProducts, setTrashedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        setLoading(true);
        const fetchTrashedProducts = async () => {
            try {
                const response = await fetch('https://apinvmnt.site/api/products/trashed', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setTrashedProducts(result.data || []);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrashedProducts();
    }, [token]);

    const restoreProduct = async (productId) => {
        setLoading(true);
        try {
            // Виправлення URL і передача productId в тілі запиту
            const response = await fetch('https://apinvmnt.site/api/products/restore', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: productId }), // Передача id товару для відновлення
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            if (result.success) {
                // Видалити товар зі списку видалених (опціонально)
                setTrashedProducts(trashedProducts.filter(product => product.id !== productId));
                alert('Товар успішно відновлено');
            } else {
                throw new Error('Не вдалося відновити товар');
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="trashed-products-container">
            <h1>Видалені товари</h1>
            {trashedProducts.length > 0 ? (
                trashedProducts.map(product => (
                    <div key={product.id} className="trashed-product">
                        <div className='product-title'>
                            <h3>{product.title}</h3>
                        </div>
                        <div className='product-img'>
                            <img src={product.images[0] || defaultImage} alt={product.title} className="product-image-trash"/>
                        </div>
                        <div className='product-discription'>
                            <p>{product.description}</p>
                        </div>
                        <div>
                            <button className="custom-btn btn-7" onClick={() => restoreProduct(product.id)}><span>Відновити</span></button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Видалених товарів не знайдено</p>
            )}
        </div>
    );
};

export default TrashedProducts;
