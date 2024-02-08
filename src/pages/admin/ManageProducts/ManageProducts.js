import React, { useState } from 'react';
import './ManageProducts.css';
import ProductList from "../../../components/ProductList/ProductList";



const ManageProducts = () => {
    // const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        title: '',
        description: '',
        price: 0,
        stock: 0, // Added stock field
        // image: null,
        // imageUrl: ''
    });
    const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage

    const handleAddProduct = async (productData) => {
        const payload = {
            title: productData.title,
            description: productData.description,
            stock: productData.stock,
            price: productData.price,
        };

        try {
            const response = await fetch('http://95.217.181.158/api/products/store', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Response Text:', text);
                throw new Error('Server responded with status: ' + response.status);
            }

            // const data = await response.json();

            // setProducts(prevProducts => Array.isArray(prevProducts) ? [...prevProducts, data] : [data]);
            setNewProduct({
                title: '',
                description: '',
                price: 0,
                stock: 0,
            });

        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product: ' + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value });
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        handleAddProduct(newProduct).then(() => {
            setNewProduct({
                title: '',
                description: '',
                price: 0,
                stock: 0,
            });
        });
    };

    return (
        <div className="manage-products">
            <h1>Керування Товарами</h1>
            <form onSubmit={handleSubmit} className="add-product-form">
                <input
                    name="title"
                    type="text"
                    placeholder="Назва товару"
                    value={newProduct.title}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Опис"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="price"
                    type="number"
                    placeholder="Ціна"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="stock"
                    type="number"
                    placeholder="Кількість на складі"
                    value={newProduct.stock || 0}
                    onChange={handleInputChange}
                    required
                />
                {/*<input*/}
                {/*    name="imageUrl"*/}
                {/*    type="text"*/}
                {/*    placeholder="URL зображення товару"*/}
                {/*    value={newProduct.imageUrl || ''}*/}
                {/*    onChange={handleInputChange}*/}
                {/*    required*/}
                {/*/>*/}
                <button type="submit" className="add-button">Додати товар</button>
            </form>
            <ProductList />
            {/*<ProductList/>*/}
        </div>
    );
};

export default ManageProducts;
