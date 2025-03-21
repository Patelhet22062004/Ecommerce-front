import React from "react";

const InstagramSection = () => {
  return (
    <section className="container mx-auto px-6">
      <div className="flex flex-wrap md:flex-nowrap justify-center gap-3 md:px-20">
        {/* Image Grid */}
        <div className="md:col-span-3  md:p-16 md:w-2/3 grid grid-cols-3 ">
          <img src="instagram-1.jpg" alt="Fashion 1" className="w-full h-auto" />
          <img src="instagram-2.jpg" alt="Fashion 2" className="w-full h-auto" />
          <img src="instagram-3.jpg" alt="Fashion 3" className="w-full h-auto" />
          <img src="instagram-4.jpg" alt="Fashion 4" className="w-full h-auto" />
          <img src="instagram-5.jpg" alt="Fashion 5" className="w-full h-auto" />
          <img src="instagram-6.jpg" alt="Fashion 6" className="w-full h-auto" />
        </div>

        {/* Instagram Text Section */}
        <div className="flex flex-col flex-wrap md:w-1/3 justify-center p-6">
          <h2 className="text-3xl font-bold">Instagram</h2>
          <p className="text-gray-500 mt-4 flex flex-wrap">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <span className="text-red-500 font-bold text-xl mt-4">#Male_Fashion</span>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
