import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductList.css';
import CartPage from "../CartPage/CartPage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import { AuthContext } from '../AuthContext/AuthContext';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';


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
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(9);
    const [quantities, setQuantities] = useState({});
    
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        total: 1,
        per_page: 9
    });
    

    useEffect(() => {
        setLoading(true);
        fetch(`https://apinvmnt.site/api/products?page=${currentPage}&limit=${productsPerPage}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProducts(data.data || []);
                setPaginationInfo(data?.meta || {});
            })
            .catch(error => setError(error.toString()))
            .finally(() => setLoading(false));
    }, [currentPage, productsPerPage]);

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
    
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
          top: 0,
          behavior: 'smooth' // Забезпечує плавну прокрутку
        });
    };

    const Pagination = ({ currentPage, onPageClick, total, last_page }) => {
        if (last_page <= 1) return null;
    
        
        const delta = 2; 
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(last_page - 1, currentPage + delta); i++) {
            range.push(i);
        }
    
        if (currentPage - delta > 2) {
            range.unshift("...");
        }
        if (currentPage + delta < last_page)
            {
            range.push("...");
            }
        range.unshift(1);
            if (last_page !== 1) range.push(last_page);
            
            return (
            <div className="pagination">
                <button onClick={() => onPageClick(1)} disabled={currentPage === 1}>
                    <FontAwesomeIcon icon={faAngleLeft} /> У Початок
                </button>
                <button onClick={() => onPageClick(currentPage - 1)} disabled={currentPage === 1}>
                    <FontAwesomeIcon icon={faAngleLeft} /> 
                </button>
                {range.map((number, index) =>
                    number === "..." ? (
                <span key={index} className="pagination-ellipsis">…</span>
                ) : (
                    <button
                        key={number}
                        onClick={() => onPageClick(number)}
                        className={currentPage === number ? 'active' : ''}
                        >
                        {number}
                    </button>
                )
            )}
                    <button onClick={() => onPageClick(currentPage + 1)} disabled={currentPage === last_page}>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                    <button onClick={() => onPageClick(last_page)} disabled={currentPage === last_page}>
                        У Кінець <FontAwesomeIcon icon={faAngleRight} />
                    </button>
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
            <Pagination 
                currentPage={paginationInfo.current_page} 
                onPageClick={handlePageClick}
                total={paginationInfo.total}
                last_page={paginationInfo.last_page}
            />
        </div>
        
    );
                        
                        
};

export default ProductList;
