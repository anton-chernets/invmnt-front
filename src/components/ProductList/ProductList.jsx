import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';
import CartPage from "../CartPage/CartPage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import { AuthContext } from '../AuthContext/AuthContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('authToken'); // Retrieve the authToken from localStorage
    const [editingProduct, setEditingProduct] = useState(null);
    const isAdmin = user && user.role === 'Admin';
    const isUser = user && user.role === 'customer';
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        setLoading(true);
        fetch('https://apinvmnt.site/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setProducts(data.data || []))
            .catch(error => setError(error.toString()))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {

        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);


    const onAddToCart = (product) => {
        setCart(currentCart => {
            const productIndex = currentCart.findIndex(item => item.id === product.id);
            let newCart;

            if (productIndex !== -1) {
                // Product already in cart, update the quantity
                newCart = currentCart.map((item, index) =>
                    index === productIndex ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Product not in cart, add as a new item
                newCart = [...currentCart, { ...product, quantity: 1 }];
            }

            localStorage.setItem('cart', JSON.stringify(newCart)); // Update localStorage with the new cart
            return newCart;
        });
    };



    const onDeleteProduct = async (productId) => {
        const authToken = localStorage.getItem('authToken');
        
        // Check if authToken exists before making the request
        if (!authToken) {
            console.error('Unauthorized: No auth token');
            return;
        }
    
        // Confirm with the user before deleting
        if (window.confirm('Ви впевнені, що хочете видалити товар?')) {
            try {
                const response = await fetch(`http://95.217.181.158/api/products/remove`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({id: productId})
                });
    
                // It's better to check response.ok before trying to parse the response body
                if (response.ok) {
                    const data = await response.json();
                    // Successful deletion of the product, update the state
                    setProducts(currentProducts => currentProducts.filter(product => product.id !== productId));
                    console.log('Product removed successfully:', data);
                } else {
                    // If response is not ok, you could still try to read the response body for error details
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete product');
                }
            } catch (error) {
                // Handle errors in connecting to the server or others
                console.error('Error deleting product:', error);
            }
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

    async function onBuyNow(product) {

        const orderDetails = {
            products: [
                {
                    id: product.id,
                    quantity: 1,
                },
            ],
        };

        try {
            const response = await fetch('http://95.217.181.158/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Make sure the token is accessible here
                },
                body: JSON.stringify(orderDetails),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            console.log('Order created successfully:', data);
            alert('Thank you for your purchase!');
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('An error occurred during checkout. Please try again.');
        }
    }

    return (
        <div>
            {isUser && (
                <button onClick={() => setShowCart(!showCart)} className="custom-btn btn-7"><span>
                    <FontAwesomeIcon icon={faShoppingCart} className="icon-spacing" /> Кошик
                </span></button>
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
                                <button className="custom-btn btn-7" onClick={() => onDeleteProduct(product.id)}><span>Видалити</span></button>

                                {editingProduct && editingProduct.id === product.id ? (
                                    <form onSubmit={handleSaveChanges} className='form-manager'>
                                        <div>
                                            <label htmlFor="title">Назва товару:</label>
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
                                            <label htmlFor="description">Опис:</label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={editingProduct.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="price">Ціна:</label>
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
                                            <label htmlFor="stock">Запас:</label>
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
                                            {/*<label htmlFor="image">Image URL:</label>*/}
                                            {/*<input*/}
                                            {/*    id="image"*/}
                                            {/*    name="image"*/}
                                            {/*    type="text"*/}
                                            {/*    value={editingProduct.image}*/}
                                            {/*    onChange={handleChange}*/}
                                            {/*/>*/}
                                        </div>
                                        <button type="submit" className="custom-btn btn-7"><span>Зберегти зміни</span></button>
                                        <button type="button" className="custom-btn btn-7" onClick={() => setEditingProduct(null)}><span>Скасувати</span></button>
                                    </form>
                                ) : (
                                    <button className="custom-btn btn-7" onClick={() => startEditingProduct(product)}><span>Редагувати</span></button>
                                )}
                            </>
                        )}
                        {isUser && (
                            <>
                                <button className="custom-btn btn-7" onClick={() => onAddToCart(product)}><span>У кошик</span></button>
                                <button className="custom-btn btn-7" onClick={() => onBuyNow(product)}><span>Придбати</span></button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

};

export default ProductList;
