import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("access_token");

  // Fetch the cart from the backend when the component mounts
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/cart/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setCart(response.data))
    .catch(error => console.error('Error fetching cart:', error));
  }, [token]);

  const handleRemoveFromCart = (productId) => {
    axios.delete(`http://127.0.0.1:8000/cart/${productId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      // alert(response.data.message);
      // Remove the item from the cart state after deletion
      setCart(cart.filter(item => item.product_id !== productId));
    })
    .catch(error => console.error('Error removing from cart:', error));
  };

  const handleUpdateQuantity = (productId, quantityChange,product_price) => {
    axios.post('http://127.0.0.1:8000/cart/', {
      product_id: productId,
      quantity: quantityChange,
      total: (product_price * quantityChange)
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      // Re-fetch the cart to reflect the updated quantity
      axios.get('http://127.0.0.1:8000/cart/', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => setCart(response.data));
    })
    .catch(error => console.error('Error updating quantity:', error));
  };

  const totalPrice = cart.reduce((total, item) => total + item.product_price * item.quantity, 0);

  return (
    <div className=" shadow-lg mx-auto my-28 py-20 md:px-20">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. <Link to="/shop" className="text-blue-500">Go back to shopping</Link></p>
      ) : (
        <div className='flex gap-10  flex-wrap md:flex-nowrap'>
          <ul className="space-y-10 md:w-2/3 shadow-sm p-12 pl-14">
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
                  className="text-red-500 p-2 shadow-md bg-neutral-50 rounded-sm ease-in-out duration-300 hover:scale-90"
                  onClick={() => handleRemoveFromCart(item.product_id)}
                >
                  Remove
                </button>
              </div>
            ))}
           <Link to='/shop'>
            <button className="hover:bg-black hover:text-white py-2 md:px-14 px-4  my-3 border  bg-white transition duration-300">
              COUNTINUE SHOPPING
            </button>
           </Link>
          </ul>

          <div className=" p-10 mt-2 md:ml-0 ml-20 flex flex-col gap-6 md:w-1/3 h-fit justify-center bg-gray-50 ">
            
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

import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProductDetails,
  removeFromCart,
  updateCartQuantity,
} from "../../Slice/cartSlice";
import {
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Link,
} from "@mui/material";
import { Delete as DeleteIcon, Add, Remove } from "@mui/icons-material";

function CartScreen() {
  const { id } = useParams(); // Extract product ID from the URL
  const location = useLocation(); // Access query string
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Extract qty from query string and set default to 1 if not provided
  const qty = new URLSearchParams(`location`.search).getAll("qty")[0];
  console.log({qty})

  const { cartItems, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
      console.log(`Product ID: ${id}, Quantity: ${qty}`);
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const incrementQty = (id, currentQty) => {
    dispatch(updateCartQuantity({ id, qty: currentQty + 1 }));
  };

  const decrementQty = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateCartQuantity({ id, qty: currentQty - 1 }));
    }
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  const calculateSubtotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : cartItems.length === 0 ? (
        <Typography>
          Your cart is empty. <Link to="/">Go Back</Link>
        </Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.product}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={item.image}
                            alt={item.productname}
                            style={{ width: 60, height: 60, marginRight: 16 }}
                          />
                          <Typography>{item.productname}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            color="primary"
                            onClick={() =>
                              decrementQty(item.product, item.qty)  
                            }
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ mx: 2 }}>{item.qty}</Typography>
                          <IconButton
                            color="primary"
                            onClick={() =>
                              incrementQty(item.product, item.qty)
                            }
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        Rs. {(item.price * item.qty).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() =>
                            removeFromCartHandler(item.product)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Cart Total
              </Typography>
              <Typography>Subtotal: Rs. {calculateSubtotal()}</Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default CartScreen;
