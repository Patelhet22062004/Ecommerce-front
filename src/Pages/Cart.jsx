import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateCartItem } from '../redux/productSlice';
import axiosInstance from '../service/Axiosconfig';
updateCartItem
const Cart = () => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("access_token");
const dispatch = useDispatch()
  // Fetch the cart from the backend when the component mounts
  useEffect(() => {
    axiosInstance.get('cart/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setCart(response.data);
      dispatch(updateCartItem(response.data.reduce((total, item) => total + item.quantity, 0))); // Dispatch cart count
    })
    .catch(error => console.error('Error fetching cart:', error));
  }, [token, dispatch]);
  
  const handleRemoveFromCart = (productId) => {
    axiosInstance.delete(`cart/${productId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      // alert(response.data.message);
      // Remove the item from the cart state after deletion
      setCart(cart.filter(item => item.product_id !== productId));
      dispatch(updateCartItem(response.data.reduce((total, item) => total + item.quantity, 0))); // Dispatch cart count

    })
    .catch(error => console.error('Error removing from cart:', error));
  };

  const handleUpdateQuantity = (productId, quantityChange, product_price) => {
    const updatedItem = cart.find(item => item.product_id === productId);
    if (!updatedItem) return;
  
    const newQuantity = updatedItem.quantity + quantityChange;
  
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      axiosInstance.post('cart/', {
        product_id: productId,
        quantity: quantityChange,
        total: product_price * newQuantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // Refresh cart to reflect updated quantity
        axiosInstance.get('cart/', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
          dispatch(updateCartItem({quantity:newQuantity}))
          setCart(response.data)}

        );
      })
      .catch(error => console.error('Error updating quantity:', error));
    }
  };
  

  const totalPrice = cart.reduce((total, item) => total + item.product_price * item.quantity, 0);
  const itemtotal= cart.reduce((totalitem,item)=>totalitem+item,0)
  return (
    <div className=" mx-auto my-28 py-20 md:px-20">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Your Cart</h1>
      {cart.length === 0 ? (
       <div>

         <p>Your cart is empty. <Link to="/shop" className="text-blue-500">Go back to shopping</Link></p>
       </div>
      ) : (
        <div className='flex gap-10  flex-wrap md:flex-nowrap'>
          <ul className="space-y-10 md:w-2/3 shadow-sm p-12 md:pl-14">
            <div className=' flex justify-between '>
              <div className=' text-lg font-bold md:mb-4 md:ml-10'>Product</div>
              <div className=' text-lg font-bold  md:mb-4 md:ml-28'>Quantity</div>
              <div className=' text-lg font-bold  mb-4 mr-3'>price</div>

            </div>
            {cart.map(item => (
              <div key={item.product_id} className="flex items-center justify-between border-b pb-4">
                <div className="flex flex-wrap ">
                  <img 
                    src={'http://127.0.0.1:8000'+item.product_image} 
                    alt={item.product_name} 
                    className="md:w-40 w-24 rounded-lg hover:opacity-75 object-contain" 
                  />
                  <div className="flex flex-col justify-center  md:pl-9 pl-2">
                    <p className="text-xl font-semibold">{item.product_name}</p>
                    <p className="text-md font-bold text-slate-800">Rs {item.product_price}</p>
                    </div>
                      </div>
                    <div className="flex items-center mr-12 ">
                      <button
                        className="md:px-3 px-1  py-1 bg-gray-200 rounded-md"
                        onClick={() => handleUpdateQuantity(item.product_id, -1,item.Product_price)} // Decrease quantity
                      >
                        -
                      </button>
                      <p className="md:px-4 px-1 font-bold">{item.quantity}</p>
                      <button
                        className="md:px-3 px-1 py-1 bg-gray-200 rounded-md"
                        onClick={() => handleUpdateQuantity(item.product_id, 1,item.product_price)} // Increase quantity
                      >
                        +
                      </button>

                      
                    </div>
                 
               
                <button
                  className="text-red-500   border-red-500   hover:bg-red-500 hover:text-white transition p-2 shadow-md bg-neutral-50 rounded-lg ease-in-out duration-300 hover:scale-95"
                  onClick={() => handleRemoveFromCart(item.product_id)}
                >
                  Remove
                </button>
              </div>
            ))}
           <Link to='/shop'>
            <button className="md:hover:bg-black md:hover:text-white py-2 md:px-14 px-4  my-3 border  md:bg-white transition duration-300">
              COUNTINUE SHOPPING
            </button>
           </Link>
          </ul>

          <div className=" p-10 mt-2 md:ml-0 sm:ml-20 flex flex-col gap-6 md:w-1/3 h-fit justify-center bg-gray-50 ">
            
            <p className="text-lg font-semibold ">Cart Total</p>
            <div className='flex justify-between'>
            <p className="text-lg font-semibold">Total</p>
            <p className="text-lg font-semibold text-red-500">Rs {totalPrice}.00</p>
          
            </div>

            
           <Link to='/checkout'>
            <button className="bg-black text-white py-2 px-20  hover:bg-slate-600 transition duration-300">
              Checkout
            </button>
           </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
