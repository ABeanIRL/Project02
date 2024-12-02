import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById, updateOrder } from '../../api/orderApi'; // Optional, if you have an API helper

const OrderUpdatePage = () => {
  const { orderId } = useParams(); // Get the orderId from the URL
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    items: [],
    deliveryAddress: '',
  });

  useEffect(() => {
    // Fetch order details by orderId
    const getOrder = async () => {
      try {
        const response = await fetchOrderById(orderId); // Make an API call to fetch the order
        setOrder(response.data);
        setFormData({
          status: response.data.status,
          items: response.data.items,
          deliveryAddress: response.data.deliveryAddress,
        });
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    
    getOrder();
  }, [orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrder(orderId, formData); // Make an API call to update the order
      navigate(`/order/${orderId}`); // Redirect to the order details page or another page after update
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (!order) {
    return <div>Loading...</div>; // Show loading indicator while order is being fetched
  }

  return (
    <div>
      <h1>Update Order</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="ready">Ready</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label>Delivery Address:</label>
          <input
            type="text"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
          />
        </div>

        <div>
          <h3>Order Items</h3>
          {formData.items.map((item, index) => (
            <div key={index}>
              <label>Item: {item.menuItem.name}</label>
              <input
                type="number"
                name={`item-${index}-quantity`}
                value={item.quantity}
                onChange={(e) => {
                  const updatedItems = [...formData.items];
                  updatedItems[index].quantity = e.target.value;
                  setFormData((prevData) => ({
                    ...prevData,
                    items: updatedItems,
                  }));
                }}
              />
            </div>
          ))}
        </div>

        <button type="submit">Update Order</button>
      </form>
    </div>
  );
};

export default OrderUpdatePage;
