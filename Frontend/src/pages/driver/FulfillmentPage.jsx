import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FulfillmentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/driver/orders/${orderId}`);
        setOrder(response.data.payload);
      } catch (error) {
        console.error("Error fetching order:", error);
        alert("Unable to load order details.");
      }
    };
    fetchOrder();
  }, [orderId]);

  // Handle photo upload
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("status", "DELIVERED");
    if (photo) formData.append("photo", photo);

    try {
      await axios.put(`/driver/orders/${orderId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Order updated successfully!");
      navigate("/driver/my-orders");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Unable to update order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="fulfillment-page">
      <h1>Order Fulfillment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer Name:</label>
          <input
            type="text"
            value={`${order.firstName} ${order.lastName}`}
            readOnly
          />
        </div>
        <div>
          <label>Delivery Address:</label>
          <input type="text" value={order.deliveryAddress} readOnly />
        </div>
        <div>
          <label>Items:</label>
          <ul>
            {order.items.map((item) => (
              <li key={item.menuItem._id}>
                {item.menuItem.name} (x{item.quantity})
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label>Upload Delivery Photo:</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Mark as Delivered"}
        </button>
      </form>
    </div>
  );
};

export default FulfillmentPage;
