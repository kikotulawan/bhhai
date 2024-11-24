import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/css';
import { Pagination, Navigation } from 'swiper';

const ImageSlider = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <Swiper
      modules={[Pagination, Navigation]}
      pagination={{ clickable: true }}
      navigation
      spaceBetween={20}
      slidesPerView={1}
      onSlideChange={(swiper) => setSelectedImage(images[swiper.activeIndex])}
      className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="relative">
            <img
              src={image.src}
              alt={image.title}
              className="w-full h-[80vh] object-cover rounded-lg"
            />
            <div className="bg-gradient-to-b from-transparent to-black text-white p-4 absolute bottom-0 inset-x-0">
              <h5 className="text-lg sm:text-2xl font-bold text-center">{image.title}</h5>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-justify">{image.description}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;
