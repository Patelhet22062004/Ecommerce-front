import React, { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "react-router-dom";
import axiosInstance from "../service/Axiosconfig";

// import { useHistory } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
//   const history = useHistory();
  const token = localStorage.getItem("access_token");

  // Fetch orders for the logged-in user
  useEffect(() => {
    if (!token) {
      redirect("/login"); // Redirect to login if no token
      return;
    }

    axiosInstance
      .get("payment/orders/", {
         })
      .then((response) => {
        setOrders(response.data); // Set the orders in state
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders.");
      });
  }, [token, history]);

  if (error) return <div>{error}</div>;
  if (!orders.length) return <div>you have not palce order</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="bg-white shadow-md p-6 rounded-md">
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="mb-6">
              <h3 className="text-xl font-semibold">Order #{order.id}</h3>
              <p>user: {order.username}</p>
              <p>Status: {order.status}</p>

              <p>Total Price: Rs {order.amount}</p>
              <p>Placed on: {new Date(order.created_at).toLocaleString()}</p>

              <h4 className="text-lg font-semibold mt-4">Items:</h4>
              <ul>
                
              </ul>

              <button
                onClick={() => history.push(`/order/${order.id}`)} // Redirect to order details page
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyOrders;
