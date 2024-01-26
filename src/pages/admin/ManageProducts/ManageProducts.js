import React, {useEffect, useState} from 'react';
import './ManageProducts.css';
import ProductList from "../../../components/ProductList/ProductList";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });

    const handleAddToCart = (product) => {
        // Логіка додавання товару до кошика
    };

    const handleBuyNow = (product) => {
        // Логіка обробки покупки товару
    };

// ... ваш JSX для рендеру


    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProductsList = [...products, { ...newProduct, id: Date.now() }];
        setProducts(newProductsList);
        setNewProduct({ name: '', description: '', price: '', image: '' }); // Очистка формы
    };

    useEffect(() => {
        // Запит до вашого API для отримання списку товарів
        fetch('URL вашого API тут')
            .then(response => response.json())
            .then(data => {
                setProducts(data); // Встановлюємо отримані товари у стан
            })
            .catch(error => {
                console.error('Помилка при завантаженні товарів:', error);
            });
    }, []); // Пустий масив залежностей означає, що ефект виконається один раз при монтуванні компонента


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
            {/* Тепер передаємо products як пропси в ProductList */}

            <ProductList
                products={products}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
            />
        </div>
    );
};

export default ManageProducts;
