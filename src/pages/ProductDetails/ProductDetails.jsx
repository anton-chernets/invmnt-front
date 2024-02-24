import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';
import { AuthContext } from '../../components/AuthContext/AuthContext';

function ProductDetails() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Use AuthContext
    const isUser = user && user.role === 'customer';

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://apinvmnt.site/api/products/show/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setProduct(data.data); // Assuming the API response has a 'data' field which contains the product details
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); // Now that setLoading is defined, this won't cause an error
            }
        };

        fetchProduct();
    }, [productId]);

    const goBack = () => {
        navigate(-1); // Перенаправлення назад
    };

    const onAddToCart = (product) => {
        // Define how to add product to cart
    };

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
            // Define buy now functionality
        }
    };


    // Conditional rendering based on the loading state
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>Product not found</p>;

    // Assuming your API returns an object and not an array for a single product
    const productDetails = product;

    return (
        <div className="product-details">
            <h2>{productDetails.title}</h2>
            <img src={productDetails.images[0]} alt={productDetails.title} />
            <p>{productDetails.description}</p>
            <p>Price: ${productDetails.price}</p>
            <button onClick={goBack} className="custom-btn btn-7"><span>Назад</span></button>
            <div className='details-but'>
            {isUser && (
                <>
                    <button className="custom-btn btn-7" onClick={() => onAddToCart(product)}><span>У кошик</span></button>
                    <button className="custom-btn btn-7" onClick={() => handleBuyNowClick(product)}><span>Придбати</span></button>
                </>
            )}
            {!user && (
                <>
                    <button className="custom-btn btn-7" onClick={() => handleAddToCartClick(product)}><span>У кошик</span></button>
                    <button className="custom-btn btn-7" onClick={() => handleBuyNowClick(product)}><span>Придбати</span></button>
                </>
            )}
        </div>
        </div>
    );
}

export default ProductDetails;
