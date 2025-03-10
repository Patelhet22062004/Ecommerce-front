import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../service/Axiosconfig";

const Checkout = () => {
  const [cartdata, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const navigate =useNavigate()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const [orderDetails, setOrderDetails] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    axiosInstance
      .get("cart/", { headers: { Authorization: `Bearer ${token}` } }) // Add this!
      .then((response) => setCart(response.data))
      .catch((error) => console.error("Error fetching cart:", error));
  }, [token]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleSubmitDetails = (e) => {
    e.preventDefault();
    setOrderDetails(formData);
    setStep(2);
  };

  const handlePayment = async () => {
    try {
      console.log(token)
      const response = await axiosInstance.post(
        "payment/create/",
        { amount: totalPrice }, // Send amount in the request body
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const { order_id, key } = response.data;
  
      const options = {
        key: key,
        amount: totalPrice,
        currency: "INR",
        order_id: order_id,
        name: "My Store",
        description: "Complete your purchase",
        handler: async function (paymentResponse) {
          try {
            // Send the Razorpay payment verification request with the correct structure
            const verifyResponse = await axiosInstance.post(
              "payment/verify/",
              {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
  
            if (verifyResponse.data.status === "success") {
              alert("Payment Successful! 🎉");
              
              // Save order to DB after successful payment
              await saveOrderToDB(order_id, paymentResponse.razorpay_payment_id);
  
              // Redirect to the orders page
              navigate("/orders");
            } else {
              alert("Payment Verification Failed!");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: orderDetails?.full_name,
          email: orderDetails?.email,
        },
        theme: { color: "#4CAF50" },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment API Error:", error.response ? error.response.data : error.message);
      alert("Something went wrong. Please try again.");
    }
  };
  
  // Save order to database after successful payment
  const saveOrderToDB = async (order_id, payment_id) => {
    try {
      await axiosInstance.post(
        "order/create/",
        {
          ...orderDetails,
          cart_items: cartdata,
          razorpay_order_id: order_id,
          payment_id: payment_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save the order.");
    }
  };
  

 
  const totalPrice = cartdata.reduce((total, item) => total + item.total * 1, 0);

  return (
    <div className="bg-gray-100 min-h-screen p-6 lg:p-12">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Checkout
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white shadow-md p-6 rounded-md">
            {step === 1 ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Enter Shipping Details</h2>
                <form onSubmit={handleSubmitDetails} className="space-y-4">
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full p-2 border rounded-md"
                    required
                  ></textarea>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-800"
                  >
                    Proceed to Payment
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Confirm Your Details</h2>
                <p><strong>Name:</strong> {orderDetails.full_name}</p>
                <p><strong>Email:</strong> {orderDetails.email}</p>
                <p><strong>Address:</strong> {orderDetails.address}, {orderDetails.city}, {orderDetails.state} - {orderDetails.zip_code}</p>
                <button
                  onClick={handlePayment}
                  className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-800"
                >
                  Pay Now
                </button>
              </>
            )}
          </div>

          <div className="bg-white shadow-md p-6 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartdata.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cartdata.map((item) => (
                  <li key={item.id} className="flex justify-between border-b pb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{item.product_name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-700">
                      Rs {item.total}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex justify-between text-xl font-semibold">
              <span>Total:</span>
              <span>Rs {totalPrice} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
