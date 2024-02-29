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
    // const [editingProduct, setEditingProduct] = useState(null);
    
    const isUser = user && user.role === 'customer';
    const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    
    return savedCart ? JSON.parse(savedCart) : [];
    });
    

    const [quantities, setQuantities] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    
    const [paginationMeta, setPaginationMeta] = useState(null);
    

    useEffect(() => {
        setLoading(true);
        fetch(`https://apinvmnt.site/api/products?page=${currentPage}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProducts(data.data || []);
                setPaginationMeta(data.meta || null); // Update this line
            })
            .catch(error => setError(error.toString()))
            .finally(() => setLoading(false));
    }, [currentPage]);

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
            
            const quantity = quantities[product.id] || 1; 
            onBuyNow(product, quantity);
        }
    };

    async function onBuyNow(product, quantity) {
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
    
    const handlePageChange = (pageNumber) => {
        if (pageNumber) {
            setCurrentPage(pageNumber);
            // Optionally update the URL or make a new API call here
        }
    };
    const Pagination = ({ meta, onPageChange }) => {
        if (!meta || meta.total <= meta.per_page) return null;
    
        const handlePageClick = (url) => {
            // Extract the page number from the URL or simply pass the URL to a parent handler
            const pageNumber = url ? parseInt(new URL(url).searchParams.get('page'), 10) : null;
            onPageChange(pageNumber);
        };
    
        return (
            <div className="pagination">
                {meta.links.map((link, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageClick(link.url)}
                        disabled={!link.url || link.active}
                        className={link.active ? 'active' : ''}
                        dangerouslySetInnerHTML={{ __html: link.label }} // Use this to render HTML entities like &laquo; and &raquo;
                    />
                ))}
            </div>
        );
    };

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
                            <h4>{product.title}</h4>
                            <img src={product.images[0] || defaultImage} alt={product.title}
                                    className={`product-img`} />
                            
                            
                            
                        </Link>
                        </div><p>{product.description}</p>
                        <p>Ціна: ${product.price}</p>
                        <div className='product-but'>
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
            {paginationMeta && (
                <Pagination meta={paginationMeta} onPageChange={handlePageChange} />
            )}
        </div>
        
    );
                        
                        
};

export default ProductList;
