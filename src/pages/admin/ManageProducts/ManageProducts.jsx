import React, { useEffect, useState } from 'react';
import './ManageProducts.css';
import ProductList from "../../../components/ProductList/ProductList";



const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);

// const startEditing = (productId) => {
//     setEditingProductId(productId);
// };

    const [newProduct, setNewProduct] = useState({
        title: '',
        description: '',
        price: 0,
        stock: 0, // Added stock field
        // image: null, // Uncomment if you need to handle image upload
        // imageUrl: '' // Uncomment if you need to handle imageUrl
    });
    const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://apinvmnt.site/api/products');
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }
                const data = await response.json();
                // Assuming the data is in an array format inside a 'data' property
                if (!data || !data.data || !Array.isArray(data.data)) {
                    throw new Error('Fetched data is not in expected format');
                }
                setProducts(data.data); // If the array is within a 'data' property
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
            setEditingProductId(null); // Reset editing state
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleAddProduct = async (productData) => {
        const payload = {
            title: productData.title,
            description: productData.description,
            stock: productData.stock,
            price: productData.price,
        };

        try {
            const response = await fetch('https://apinvmnt.site/api/products/store', {
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

            const newProduct = await response.json();
            setProducts(prevProducts => [...prevProducts, newProduct]); // Update the state with the new product

            // Reset form fields after successful product addition
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

    const handleSubmit = (e) => {

        e.preventDefault();
        handleAddProduct(newProduct).then(() => {
            // Reset the form only if the product was added successfully
            setNewProduct({
                title: '',
                description: '',
                price: 0,
                // image: null
            });
        });
    };

    const EditProductForm = ({ product, onSave }) => {
        const [formData, setFormData] = useState(product);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
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
