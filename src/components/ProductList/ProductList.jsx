import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductList.css';
import CartPage from "../CartPage/CartPage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import { AuthContext } from '../AuthContext/AuthContext';

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('authToken');
    const [editingProduct, setEditingProduct] = useState(null);
    const isAdmin = user && user.role === 'Admin';
    const isUser = user && user.role === 'customer';
    const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    
    return savedCart ? JSON.parse(savedCart) : [];
    });
    

    const [quantities, setQuantities] = useState({});
    

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
            const quantityToAdd = quantities[product.id] || 1; // Get the quantity to add, defaulting to 1 if not specified
    
            let newCart;
            if (productIndex !== -1) {
                // Product is already in the cart, update its quantity
                newCart = currentCart.map((item, index) =>
                    index === productIndex ? { ...item, quantity: item.quantity + quantityToAdd } : item
                );
            } else {
                // Product is not in the cart, add it with the specified quantity
                newCart = [...currentCart, { ...product, quantity: quantityToAdd }];
            }
    
            localStorage.setItem('cart', JSON.stringify(newCart)); // Save the updated cart to localStorage
            return newCart; // Update the cart state
        });
    };

    

    const onDeleteProduct = async (productId) => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            console.error('Unauthorized: No auth token');
            return;
        }
    
        if (window.confirm('Ви впевнені, що хочете видалити товар?')) {
            try {
                const response = await fetch(`https://apinvmnt.site/api/products/remove`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({id: productId})
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setProducts(currentProducts => currentProducts.filter(product => product.id !== productId));
                    console.log('Product removed successfully:', data);
                } else {
                    // If response is not ok, you could still try to read the response body for error details
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };
    
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        await handleUpdateProduct(editingProduct);
    };
    const handleUpdateProduct = async (updatedProductData) => {
        const payload = {
            title: updatedProductData.title,
            description: updatedProductData.description,
            stock: updatedProductData.stock,
            price: updatedProductData.price,
        };

        try {
            const response = await fetch(`https://apinvmnt.site/api/products/update/${updatedProductData.id}`, {
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

    const handleAddToCartClick = (product) => {
        if (!user) {
          navigate('/login');
        } else {
          onAddToCart(product);
        }
      };
    
      const handleBuyNowClick = (product) => {
        if (!user) {
            navigate('/login');
        } else {
            // Retrieve the quantity for the product
            const quantity = quantities[product.id] || 1; // Default to 1 if not specified
            onBuyNow(product, quantity); // Pass the quantity to onBuyNow
        }
    };

    async function onBuyNow(product, quantity) {
        // Ensure a valid quantity is always passed
        const quantityToBuy = quantity || 1;
    
        const orderDetails = {
            products: [
                {
                    id: product.id,
                    quantity: quantityToBuy,
                },
            ],
        };
    
        try {
            const response = await fetch('https://apinvmnt.site/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
        <div className='wrapper-product'>
            {isUser && (
                <button onClick={() => setShowCart(!showCart)} className="custom-btn btn-7">
                    <span><FontAwesomeIcon icon={faShoppingCart} className="icon-spacing" /> Кошик</span>
                </button>
            )}
            {showCart && isUser && <CartPage cart={cart} setCart={setCart} />}
            <div className="products-container">
                {products.map(product => (
                    <div key={product.id} className="product-item-list">
                        <div className='img-dis'>
                        <Link to={`/products/show/${product.id}`} style={{  textDecoration: 'none' }}>
                                <img src={product.images[0] || defaultImage} alt={product.title}
                                    className={`product-img`} />
                            
                            
                            <h3>{product.title}</h3>
                        </Link>
                        </div><p>{product.description}</p>
                        <p>Ціна: ${product.price}</p>
                        <div className='product-but'>
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
                                        </form>
                                    ) : (
                                        <button className="custom-btn btn-7" onClick={() => startEditingProduct(product)}><span>Редагувати</span></button>
                                    )}
                                </>
                            )}
                            {isUser && (
                                <>
                                <div className='quantity'>
                            <label htmlFor={`quantity-${product.id}`}>Кількість:</label>
                            <input
                                type="number"
                                id={`quantity-${product.id}`}
                                value={quantities[product.id] || 1}
                                onChange={(e) => setQuantities({ ...quantities, [product.id]: Math.max(1, parseInt(e.target.value, 10)) })}
                                min="1"
                                style={{ width: '60px' }}
                            />
                        </div>
                                    <button className="custom-btn btn-7" onClick={() => onAddToCart(product)}><span>У кошик</span></button>
                                    <button className="custom-btn btn-7" onClick={() => handleBuyNowClick(product)}><span>Придбати</span></button>
                                </>
                            )}
                            {!user && (
                                <>
                                <div>
                            <label htmlFor={`quantity-${product.id}`}>Кількість:</label>
                            <input
                                type="number"
                                id={`quantity-${product.id}`}
                                value={quantities[product.id] || 1}
                                onChange={(e) => setQuantities({ ...quantities, [product.id]: Math.max(1, parseInt(e.target.value, 10)) })}
                                min="1"
                                style={{ width: '60px' }}
                            />
                        </div>
                                    <button className="custom-btn btn-7" onClick={() => handleAddToCartClick(product)}><span>У кошик</span></button>
                                    <button className="custom-btn btn-7" onClick={() => handleBuyNowClick(product)}><span>Придбати</span></button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
    );
                        
                        
};

export default ProductList;
