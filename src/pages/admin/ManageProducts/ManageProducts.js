import React, { useState } from 'react';
import './ManageProducts.css'

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProducts([...products, { ...newProduct, id: Date.now() }]);
        setNewProduct({ name: '', description: '', price: '', image: '' }); // Очистка формы
    };

    return (
        <div className="manage-products">
            <h1>Управление Товарами</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    type="text"
                    placeholder="Название товара"
                    value={newProduct.name}
                    onChange={handleInputChange}
                />
                <input
                    name="description"
                    type="text"
                    placeholder="Описание"
                    value={newProduct.description}
                    onChange={handleInputChange}
                />
                <input
                    name="price"
                    type="number"
                    placeholder="Цена"
                    value={newProduct.price}
                    onChange={handleInputChange}
                />
                <input
                    name="image"
                    type="text"
                    placeholder="URL изображения"
                    value={newProduct.image}
                    onChange={handleInputChange}
                />
                <button type="submit">Добавить товар</button>
            </form>
            {/* Отображение списка товаров */}
        </div>
    );
};


export default ManageProducts;
