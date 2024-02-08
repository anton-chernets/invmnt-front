import React, { useEffect, useState } from 'react';
import './ManageProducts.css';
import ProductList from "../../../components/ProductList/ProductList";



const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ title: '', description: '', price: 0 });
    const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage

    const handleAddProduct = async (productData) => {
        try {
            const response = await fetch('http://95.217.181.158/api/products/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: productData.title,
                    description: productData.description,
                    price: productData.price
                }),
            });

            if (!response.ok) {
                // Check if the response content type is JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'There was an error adding the product.');
                } else {
                    // Handle non-JSON error response
                    throw new Error('Server error: ' + response.statusText);
                }
            }

            const addedProduct = await response.json();
            setProducts([...products, addedProduct.data]);
            setNewProduct({ name: '', description: '', price: 0 }); // Reset form
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product: ' + error.message);
        }
    };


    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.title]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddProduct(newProduct);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://95.217.181.158/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const products = await response.json();
                setProducts(products);
            } catch (error) {
                console.error('Error loading products:', error);
                // Handle error loading products
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="manage-products">
            <h1>Керування Товарами</h1>
            <form onSubmit={handleSubmit} className="add-product-form">
                <input
                    name="title"
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
                <button type="submit" className="add-button">Додати товар</button>
            </form>
            <ProductList products={products} />
            {/*<ProductList/>*/}
        </div>
    );
};

export default ManageProducts;
