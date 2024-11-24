import React, { useState, useEffect } from 'react';
import axios from "axios";
import ClipLoader from 'react-spinners/ClipLoader';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
Modal.setAppElement('#root'); // Set the root element for accessibility

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
          const response = await axios.get("/api/gallery/allImages");
          console.log(response.data); // Check what the API returns
          setImages(Array.isArray(response.data) ? response.data : []); // Ensure response is an array
      } catch (error) {
          console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const closeImageModal = () => {
    document.body.style.overflowY = 'auto';
    setImageModalIsOpen(false);
    setSelectedImage({});
  };

  const viewImage = (index) => {
    setSelectedImage(images[index]);
    setCurrentIndex(index);
    document.body.style.overflowY = 'hidden';
    setImageModalIsOpen(true);
  };

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#FAFAFA] min-h-[95vh]">
      <div
        className="relative w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/announcement.jpg)' }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-extrabold text-center text-white py-6 px-4 rounded-lg shadow-lg">
            Gallery
          </h1>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl ">
        {Array.isArray(images) && images.length === 0 ? (
          <div className="text-center text-gray-600 text-xl">
            No images found in the gallery.
          </div>
        ) : (
          <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
            {Array.isArray(images) && images.map((image, index) => (
              <img 
                  key={index}
                  onClick={() => viewImage(index)}
                  src={`http://127.0.0.1:8000/storage/${image.image_path}`}
                  className="object-center object-cover rounded shadow shrink-0 grow-1 bg-center bg-cover min-h-[400px] max-h-[400px] cursor-pointer hover:shadow-2xl transition-all border-none outline-none"
                  alt={image.title || 'Gallery Image'}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
  isOpen={imageModalIsOpen}
  onRequestClose={closeImageModal}
  className="flex flex-col md:flex-row bg-transparent rounded-lg shadow-xl max-w-[90%] mx-auto overflow-hidden h-[80vh] md:h-[60vh] lg:h-[50vh]"
  overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4"
  shouldCloseOnOverlayClick={true}
>
  {/* Image Section */}
  <div className="relative flex-1 h-full md:h-auto max-w-full overflow-hidden">
    <img
      src={`http://127.0.0.1:8000/storage/${selectedImage.image_path}`}
      className="object-contain w-full h-full "
      alt={selectedImage.title || 'Selected Image'}
    />

    {/* Navigation Buttons within Image */}
    <button
      onClick={prevImage}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white "
    >
      <FontAwesomeIcon icon={faChevronLeft} className="w-6 h-6" />
    </button>
    <button
      onClick={nextImage}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white "
    >
      <FontAwesomeIcon icon={faChevronRight} className="w-6 h-6" />
    </button>
  </div>

  {/* Text Content Section */}
  <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col justify-center text-center md:text-left w-full max-w-full">
    <div>
      <h5 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-4 overflow-hidden text-ellipsis whitespace-normal">
        {selectedImage.title}
      </h5>
      <p className="text-xs sm:text-sm md:text-base text-white text-justify">
        {selectedImage.description}
      </p>
    </div>
  </div>
</Modal>
    </div>
  );
};

export default Gallery;