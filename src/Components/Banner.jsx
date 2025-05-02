import { motion } from 'framer-motion';
import React from 'react';

import { FaFacebookF } from "react-icons/fa";
import { FaInstagram, FaLinkedinIn, FaLinode, FaTwitter, FaXTwitter } from 'react-icons/fa6';

import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const Banner = () => {
  
  const icons=[

  { component: <FaFacebookF className="hover:text-blue-700" />, key: "facebook" },
  { component: <FaInstagram className="hover:text-pink-700" />, key: "instagram" },
  { component: <FaXTwitter className="hover:text-slate-700" />, key: "twitter" },
  { component: <FaLinkedinIn className="hover:text-sky-700" />, key: "linkedin" },
];
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
                  backgroundImage: `url('/banner-${slide}.jpg')`, // Replace with actual URLs
                }}
              >
                 <div className="absolute  inset-0 bg-opacity-50 flex items-center sm:pl-32">
          <div className="text-center pl-6 gap-4 md:pl-0 pb-40 md:pb-0 flex justify-end flex-col  ">
          <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-red-600 flex justify-start  font-semibold mb-4 "
            >
              Summer Style
            </motion.h2> <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="md:text-5xl flex text-4xl justify-start  font-bold mb-4 "
            >
              Discover Your Style
            </motion.h2>
            <motion.p
               initial={{ opacity: 0, y: 80 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.7 }}
              className="mb-8 text-base md:text-2xl flex flex-wrap justify-start"
            > 
              Upgrade your wardrobe with our latest collection.
            </motion.p>
           <Link to='/shop'> <motion.button
              initial={{ y: 100 ,opacity:0}}
              whileInView={{ y: 0,opacity:1 }}
              transition={{ duration: 1.5,delay:0.2, type: "spring", }}
              className="bg-black  flex justify-start px-12 py-3 text-white font-semibold hover:bg-white hover:text-black "
            >
              Shop Now
            </motion.button></Link>
          </div>
        </div>
       
        <div className="absolute flex bottom-12 md:left-32 left-8 gap-7">
      {icons.map((icon, index) => (
        <motion.div
          key={icon.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.25, duration: 0.5 }}
        >
          {icon.component}
        </motion.div>
      ))}
    </div>

              </div>
            </div>
          ))}
        </Slider>
      </div>
  );
};

export default Banner;
