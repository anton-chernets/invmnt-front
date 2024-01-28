import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css'

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false); // Стан для відслідковування, чи товар доданий у кошик

  
  const onAddToCart = (product) => {
    // Логіка додавання товару у кошик
    console.log("Додано у кошик:", product.title);
    setIsAddedToCart(true); // Встановлюємо стан у true, коли товар доданий у кошик
  };

  const onDeleteFromCart = () => {
    // Логіка видалення товару з кошика
    console.log("Видалено з кошика:", product.title);
    setIsAddedToCart(false); // Встановлюємо стан у false, коли товар видалено з кошика
  };

  const onBuyNow = (product) => {
    // Додайте логіку покупки товару відразу
    console.log("Куплено:", product.title);
  };


  useEffect(() => {
    // Тут має бути запит до вашого API за деталями товару
    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => response.json())
        .then(data => setProduct(data));
  }, [productId]);

  if (!product) {
    return <div className="loading-message">Завантаження деталей товару...</div>;
  }

  return (
    <div className="product-details">
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} className="product-image" />
      <p>{product.description}</p>
      <p><strong>Ціна:</strong> ${product.price}</p>
      <div className="product-actions">
        {!isAddedToCart && (
          <button onClick={() => onAddToCart(product)}>Додати у кошик</button>
        )}
        {isAddedToCart && (
          <>
            <button onClick={() => onBuyNow(product)}>Купити</button>
            <button onClick={() => onDeleteFromCart(product.id)}>Видалити з кошика</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
