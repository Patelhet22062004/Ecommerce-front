import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import axios, { AxiosError } from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../Components/Footer";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
const Home = () => {
  const [products, setProducts] = useState([]);
  const {token,userid}=useSelector(state=>state.auth)
  const dispatch =useDispatch()
  const navigate=useNavigate()
  useEffect(() => {
     axios.get("http://localhost:8000/products/"
    )
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) =>{
        if(error.response.status==401){
             dispatch(logout())
                  }
         console.error("Error fetching products:",error)
       
      });
  }, []);
  useEffect(()=>{
    axios.get(`http://127.0.0.1:8000/user/profile/${userid}/`,
{      headers: { Authorization: `Bearer ${token}` },
}
    )
      .then((response) => {
        console.log(response.data.data)
        if(response.data.isadmin){
          navigate('/dashboard')
        }
        setProducts(response.data);
      })
      .catch((error) =>{
       
         console.error("Error fetching :",error)
       
      });
  }
  ,[])

  const sliderSettings = {
    infinite: true,
    speed: 500,
    navigator,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="">
      
      <div className="relative bg-gray-50 overflow-hidden ">
        <Slider {...sliderSettings}>
          {[1, 2].map((slide, index) => (
            <div key={index} className="h-[600px]">
              <div
                // initial={{ opacity: 0, scale: 0.9 }}
                // animate={{ opacity: 1, scale: 1 }}
                // transition={{ duration: 1 }}
                className="relative bg-cover bg-center h-full"
                style={{
                  backgroundImage: `url('/public/hero-${slide}.jpg')`, // Replace with actual URLs
                }}
              >
                 <div className="absolute inset-0 bg-opacity-50 flex items-center pl-32">
          <div className="text-center ">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-4 "
            >
              Discover Your Style
            </motion.h2>
            <motion.p
               initial={{ opacity: 0, y: 80 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.7 }}
              className="mb-8"
            >
              Upgrade your wardrobe with our latest collection.
            </motion.p>
           <Link to='/shop'> <motion.button
              initial={{ y: 100 ,opacity:0}}
              whileInView={{ y: 0,opacity:1 }}
              transition={{ duration: 1.5,delay:0.2, type: "spring", }}
              className="bg-black px-12 py-3 text-white font-semibold hover:bg-white hover:text-black "
            >
              Shop Now
            </motion.button></Link>
          </div>
        </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className=" mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
          <div className="">
          <div className="flex justify-center flex-wrap gap-8">

            {products.length > 0 ? (
              products.map((product, i) => (
                <Link to='/shop'>
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale:0.9}}
                  whileInView={{ opacity: 1, scale:1}}
                  transition={{ duration: 0.8 }}
                  className="bg-white w-fit  flex flex-col rounded-lg overflow-hidden"
                >
                  <img
                    src={product.image || "https://via.placeholder.com/300x300"}
                    alt={product.name}
                    className=" object-cover"
                  />
                  <div className="p-10  gap-2 flex flex-col ml-12 w-fit">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-gray-600">₹{product.price}</p>
                   
                  </div>
                </motion.div>
                  </Link>
              )
              )
            ) : (
              <p>Loading products...</p>
            )}
          </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16 text-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-neutral-200 p-6 rounded-lg shadow-md"
              >
                <p className="t mb-4">
                  "This is the best shopping experience I've ever had. Highly recommend!"
                </p>
                <p className=" font-bold">- Customer {i + 1}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer/>
    </div>
  );
};

export default Home;
