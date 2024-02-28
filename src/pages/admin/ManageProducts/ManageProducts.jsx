import React, { useEffect, useState } from 'react';
import './ManageProducts.css';
import ProductList from "../../../components/ProductList/ProductList";



const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);

    const [newProduct, setNewProduct] = useState({
        title: '',
        description: '',
        price: 0,
        stock: 0,
        image: null, // For image file
    });
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://apinvmnt.site/api/products');
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }
                const data = await response.json();
                if (!data || !data.data || !Array.isArray(data.data)) {
                    throw new Error('Fetched data is not in expected format');
                }
                setProducts(data.data);
            } catch (error) {
                console.error('Error loading products:', error);
            }
        };
        fetchProducts();
    }, []);

    const saveProductChanges = async (updatedProduct) => {
        try {
            const response = await fetch(`https://apinvmnt.site/api/products/update/${updatedProduct.id}`, {
                method: 'POST', // Or 'PUT' if your API requires it for updates
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updatedProduct.title,
                    description: updatedProduct.description,
                    price: updatedProduct.price,
                    stock: updatedProduct.stock
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            setProducts(prevProducts => prevProducts.map(p => p.id === result.data.id ? result.data : p));
            setEditingProductId(null);
        } catch (error) {
            console.error('Error updating product:', error);
        }
        if (updatedProduct.image) {
            // Similar to handleAddProduct, upload the image file here
            const formData = new FormData();
            formData.append('id', updatedProduct.id); // Assuming this is the product ID
            formData.append('model', 'Product'); // Adjust based on your API
            formData.append('files', updatedProduct.image);
    
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


    const handleAddProduct = async (productData, file) => {
        // First, create the product and get the product ID from the response
        const productPayload = {
            title: productData.title,
            description: productData.description,
            stock: productData.stock,
            price: productData.price,
        };
    
        try {
            const productResponse = await fetch('https://apinvmnt.site/api/products/store', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productPayload),
            });
    
            if (!productResponse.ok) {
                throw new Error('Product creation failed');
            }
    
            const productData = await productResponse.json();
            const productId = productData.data.id; // Assuming the product ID is in the 'id' field of the 'data' object
    
            // Then, if there's a file, upload it with the product ID
            if (file && productId) {
                const formData = new FormData();
                formData.append('id', productId); // Use the product ID from the product creation response
                formData.append('model', 'Product')
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
            setProducts(prevProducts => [...prevProducts, productData.data]);
    
            // Reset the newProduct state to clear the form
            setNewProduct({
                title: '',
                description: '',
                price: 0,
                stock: 0,
                image: null,
            });
    
        } catch (error) {
            console.error('Error in product creation or file upload:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setNewProduct({ ...newProduct, image: files[0] });
        } else {
            setNewProduct({ ...newProduct, [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddProduct(newProduct, newProduct.image);
    };

    
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
    
        try {
            const response = await fetch(`https://apinvmnt.site/api/products/remove`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: productId }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete product');
            }
    
            setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    

    const EditProductForm = ({ product, onSave }) => {
        const [formData, setFormData] = useState({...product, image: null});
    
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
                <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Ціна" />
                <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Кількість на складі" />
                <input
                name="image"
                type="file"
                onChange={handleChange}
            />
                <button type="submit"className="custom-btn btn-7"><span>Зберегти зміни</span></button>
            </form>
        );
    };
    

    return (
        <div className="manage-products">
            <h1>Керування Товарами</h1>
            <form onSubmit={handleSubmit} className="add-product-form">
                <input
                    name="title"
                    type="text"
                    placeholder="Назва товару"
                    value={newProduct.title} // Changed from name to title
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
                <input
                    name="image"
                    type="file"
                    onChange={handleInputChange}
                    // Remove the required attribute if the image is not mandatory for product creation
                />
                <button type="submit" className="custom-btn btn-7"><span>Додати товар</span></button>
            </form>
            <div className='editen-prod'>
            {products.map((product) => (
                editingProductId === product.id ? (
                    <EditProductForm key={product.id} product={product} onSave={saveProductChanges} />
                ) : (
                    // Render product item with an edit button
                    <div key={product.id} className="product-item">
                        <h3>{product.title}</h3>
                        {/* Other product details */}
                        <button onClick={() => setEditingProductId(product.id)}className="custom-btn btn-7"><span>Редагувати</span></button>
                        <button onClick={() => handleDeleteProduct(product.id)}className="custom-btn btn-7"><span>Delete</span></button>

                    </div>
                )
            ))}</div>
            <ProductList products={products}/>
            {/*<ProductList/>*/}
        </div>
    );
};

export default ManageProducts;
