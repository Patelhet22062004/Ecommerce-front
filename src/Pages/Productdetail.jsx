import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProduct(response.data);
        setSelectedImage(response.data.images.length > 0 ? response.data.images[0].image : "");
      })
      .catch((error) => console.error("Error fetching product details:", error));
  }, [id, token]);

  const handleAddToCart = () => {
    axios
      .post(
        "http://127.0.0.1:8000/cart/",
        { product_id: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Added to cart!");
      })
      .catch((error) => console.error("Error adding product to cart:", error));
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto py-32 ">
      <div className="flex flex-wrap justify-center  gap-20">
        <div className="flex flex-col justify-center ">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-fit max-w-lg border border-gray-300 rounded-lg"
          />
          <div className="flex mt-4 justify-center space-x-4">
          <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={3}
        navigation
        autoplay
        className="mt-4 w-64"
      >
        {product.images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img.image}
              alt={product.name}
              className="w-20 h-20 object-cover border border-gray-300 rounded cursor-pointer"
              onClick={() => setSelectedImage(img.image)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
          </div>
        </div>

         <div className="flex flex-col ">
          <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>
          <h2 className="text-xl text-gray-600 mt-2">{product.brand}</h2>
          <p className="text-lg mt-4 text-gray-800">{product.description}</p>
          <div className="mt-6 flex items-center">
            <p className="text-xl font-bold text-blue-500">Rs {product.price}</p>
            <p className="text-sm text-gray-500 ml-20">In Stock: {product.stock}</p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex space-x-4">
            <button className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transition duration-300" onClick={handleAddToCart}>
              Add to Cart
            </button>
           <Link to='/cart'> <button className="border-2 hover:shadow-lg border-blue-500 text-blue-500 py-2 px-6 rounded-md hover:bg-blue-500 hover:text-white transition duration-300"onClick={handleAddToCart}>
              Buy Now
            </button></Link> 
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ProductDetail;
