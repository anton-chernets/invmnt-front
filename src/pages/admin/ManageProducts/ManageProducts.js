import React, { useEffect, useState } from 'react';
import './ManageProducts.css';
import ProductList from "../../../components/ProductList/ProductList";
import ShopPage from "../../ShopPage/ShopPage";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, image: '' });

    const handleAddProduct = async (product) => {
        // Here you would send a POST request to your API to add a product
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });

        if (response.ok) {
            const addedProduct = await response.json();
            setProducts([...products, addedProduct]);
        }
    };

    const handleDeleteProduct = async (productId) => {
        // Here you would send a DELETE request to your API to delete a product
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setProducts(products.filter(product => product.id !== productId));
        }
    };

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddProduct(newProduct);
        setNewProduct({ name: '', description: '', price: 0, image: '' }); // Reset form
    };

    useEffect(() => {
        // Fetch the list of products from your API
        const fetchProducts = async () => {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const products = await response.json();
            setProducts(products);
        };

        fetchProducts().catch(error => {
            console.error('Error loading products:', error);
        });
    }, []);

    return (
        <div className="manage-products">
            <h1>Керування Товарами</h1>
            <form onSubmit={handleSubmit} className="add-product-form">
                <input
                    name="name"
                    type="text"
                    placeholder="Назва товару"
                    value={newProduct.name}
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
                    name="image"
                    type="text"
                    placeholder="URL зображення"
                    value={newProduct.image}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit" className="add-button">Додати товар</button>
            </form>
            <ProductList
                products={products}
                onDeleteProduct={handleDeleteProduct}
            />
        </div>
    );
};

export default ManageProducts;
