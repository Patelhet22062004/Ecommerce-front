import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "./service/Axiosconfig";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("access_token");
  const IsAuthenticated = localStorage.getItem("IsAuthenticated")
  useEffect(() => {
    if(IsAuthenticated){
    axiosInstance
      .get("cart/")
      .then((response) => setCart(response.data))
      .catch((error) => console.error("Error fetching cart:", error));
  }}, []);
  useEffect(()=>{
    setCart(cart)
  },[cart])

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
