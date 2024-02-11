import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductList.css';
import CartPage from "../../pages/CartPage/CartPage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import { AuthContext } from '../AuthContext/AuthContext';

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('authToken'); // Retrieve the authToken from localStorage
    const [editingProduct, setEditingProduct] = useState(null);




    // Перевірка, чи є користувач адміністратором
    const isAdmin = user && user.role === 'Admin';
    // Перевірка, чи є користувач залогінений (не адмін)
    const isUser = user && user.role === 'customer';
    useEffect(() => {
        setLoading(true);
        const url = 'http://95.217.181.158/api/products';
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProducts(data.data || []);
            })
            .catch(error => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const onAddToCart = (product) => {
        setCart(currentCart => {
            const isProductInCart = currentCart.find(item => item.id === product.id);
            if (isProductInCart) {
                return currentCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentCart, { ...product, quantity: 1 }];
        });
        console.log('Product added to cart:', product);
    };

    const onBuyNow = (product) => {
        onAddToCart(product);
        navigate('/checkout');
    };

    const onDeleteProduct = async (productId) => {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            console.error('Unauthorized: No auth token');
            return;
        }

        try {
            const response = await fetch(`http://95.217.181.158/api/products/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({id: productId})
            });

            const data = await response.json();

            if (response.ok) {
                // Успішне видалення продукту, оновлюємо стан
                setProducts(currentProducts => currentProducts.filter(product => product.id !== productId));
                console.log('Product removed successfully:', data);
            } else {
                // Обробка помилок від сервера
                throw new Error(data.message || 'Failed to delete product');
            }
        } catch (error) {
            // Обробка помилок відсутності зв'язку з сервером або інших
            console.error('Error deleting product:', error);
        }
    };
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        await handleUpdateProduct(editingProduct);
        // After updating, you might want to clear the editing state or give some feedback to the user
    };
    const handleUpdateProduct = async (updatedProductData) => {
        const payload = {
            title: updatedProductData.title,
            description: updatedProductData.description,
            stock: updatedProductData.stock,
            price: updatedProductData.price,
        };

        try {
            const response = await fetch(`http://95.217.181.158/api/products/update/${updatedProductData.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Server responded with status: ' + response.status);
            }

            const updatedProduct = await response.json();
            setProducts(prevProducts => prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product: ' + error.message);
        }
        setEditingProduct(null);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const startEditingProduct = (product) => {
        setEditingProduct(product);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            {isUser && (
                <button onClick={() => setShowCart(!showCart)} className="cart-button">
                    <FontAwesomeIcon icon={faShoppingCart} className="icon-spacing" /> Кошик
                </button>
            )}
            {showCart && isUser && <CartPage cart={cart} setCart={setCart} />}
            <div className="products-container">
                {products.map(product => (
                    <div key={product.id} className="product-item-list">
                        <Link to={`/products/show/${product.id}`} style={{ textDecoration: 'none' }}>
                            <h3>{product.title}</h3>
                            <img src={product.images[0] || defaultImage} alt={product.title} className="product-image"/>
                        </Link>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        {isAdmin && (
                            <>
                                <button onClick={() => onDeleteProduct(product.id)}>Видалити</button>

                                {editingProduct && editingProduct.id === product.id ? (
                                    <form onSubmit={handleSaveChanges} className='form-manager'>
                                        <div>
                                            <label htmlFor="title">Title:</label>
                                            <input
                                                id="title"
                                                name="title"
                                                type="text"
                                                value={editingProduct.title}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="description">Description:</label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={editingProduct.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="price">Price:</label>
                                            <input
                                                id="price"
                                                name="price"
                                                type="number"
                                                value={editingProduct.price}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="stock">Stock:</label>
                                            <input
                                                id="stock"
                                                name="stock"
                                                type="number"
                                                value={editingProduct.stock}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="image">Image URL:</label>
                                            <input
                                                id="image"
                                                name="image"
                                                type="text"
                                                value={editingProduct.image}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <button type="submit">Save Changes</button>
                                        <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
                                    </form>
                                ) : (
                                    <button onClick={() => startEditingProduct(product)}>Редагувати</button>
                                )}
                            </>
                        )}
                        {isUser && (
                            <>
                                <button onClick={() => onAddToCart(product)}>У кошик</button>
                                <button onClick={() => onBuyNow(product)}>Придбати</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

};

export default ProductList;
