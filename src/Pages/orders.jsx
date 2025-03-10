import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../service/Axiosconfig";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    axiosInstance
      .get("order/list/", {
         })
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, [token]);

  return (
    <div className="bg-gray-100 min-h-screen p-6 lg:p-12">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          My Orders
        </h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.order_id} className="border-b py-4">
                <p><strong>Order ID:</strong> {order.order_id}</p>
                <p><strong>Amount:</strong> ₹{order.amount}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Orders;
