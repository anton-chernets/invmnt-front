import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';

function ProductDetails() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true); // Define loading state here
    const [error, setError] = useState(null);

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
        </div>
    );
}

export default ProductDetails;
