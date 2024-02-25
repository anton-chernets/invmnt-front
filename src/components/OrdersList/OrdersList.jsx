import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://apinvmnt.site/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setOrders(result.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  if (!user) return <p>Please log in to view orders.</p>;
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='orders-container'>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.created_at} className='order-item'>
            <p>Order ID: {order.id}</p>
            <p>Total Price: {order.total_price}</p>
            <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
            <div className='line-items'>
              {order.line_items.map((item) => (
                <div key={item.product_info.title} className='order-product-item'>
                  <p>Title: {item.product_info.title}</p>
                  <p>Description: {item.product_info.description}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {item.price}</p>
                  <img src={item.product_info.images} alt={item.product_info.title} />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrdersList;
