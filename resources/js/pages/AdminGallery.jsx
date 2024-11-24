import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiX } from 'react-icons/hi'; 
import { BeatLoader } from 'react-spinners';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement('#root'); // Set the root element for accessibility

function AdminGallery() {
   const [images, setImages] = useState([]);
   const [selectedImage, setSelectedImage] = useState(null);
   const [currentPage, setCurrentPage] = useState(1);
   const [mediaPreview, setMediaPreview] = useState(null);
   const [totalPages, setTotalPages] = useState(1);
   const [modalIsOpen, setModalIsOpen] = useState(false);
   const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [formData, setFormData] = useState({
       id: null,
       title: '',
       description: '',
       image: null,
   });

   useEffect(() => {
       fetchImages();
   }, [currentPage]);

   const fetchImages = async () => {
       try {
           setIsLoading(true);
           const response = await axios.get(`/api/galleries?page=${currentPage}`);
           setImages(response.data.data || []);
           setTotalPages(response.data.last_page || 1);
       } catch (error) {
           console.error('Error fetching images:', error);
       } finally {
           setIsLoading(false);
       }
   };

   const openModal = (image = null) => {
       setIsEditing(!!image);
       setFormData(image ? { ...image, image: null } : { id: null, title: '', description: '', image: null });
       setModalIsOpen(true);
   };

   const closeModal = () => {
       setModalIsOpen(false);
       setFormData({ id: null, title: '', description: '', image: null });
   };

   const closeImageModal = () => {
       setImageModalIsOpen(false);
       setSelectedImage(null);
   };

   const handleChange = (e) => {
       const { name, value } = e.target;
       setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleFileChange = (e) => {
       setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
   };

   const handleSubmit = async (e) => {
       e.preventDefault();

       const data = new FormData();
       data.append('title', formData.title);
       data.append('description', formData.description);
       if (formData.image) data.append('image', formData.image);

       console.log([...data.entries()]); // Log form data for debugging

       try {
           if (isEditing) {
               await handleUpdateImage(formData.id);
           } else {
               await axios.post('/api/galleries', data);
               toast.success("Image added successfully");
           }
           closeModal();
           fetchImages();
       } catch (error) {
           if (error.response && error.response.data) {
               console.error('Error response:', error.response.data);
               toast.error("Error saving image: " + JSON.stringify(error.response.data));
           } else {
               toast.error("Error saving image, try again.");
           }
           console.error('Error saving image:', error);
       }
   };

   const handleUpdateImage = async (id) => {
       const data = new FormData();
       data.append('title', formData.title);
       data.append('description', formData.description || '');
       if (formData.image) {
           data.append('image', formData.image);
       }

       console.log([...data.entries()]); // Log form data for debugging

       try {
           await axios.post(`/api/galleries/${id}`, data, {
               headers: {
                   'Content-Type': 'multipart/form-data',
                   'X-HTTP-Method-Override': 'PUT'
               },
           });
           toast.success("Image updated successfully");
           fetchImages();
       } catch (error) {
           if (error.response && error.response.data && error.response.data.errors) {
               toast.error("Update failed: " + Object.values(error.response.data.errors).join(", "));
           } else {
               toast.error("Failed to update image");
           }
       }
   };

   const handleDelete = async (id) => {
       if (window.confirm('Are you sure you want to delete this image?')) {
           try {
               await axios.delete(`/api/galleries/${id}`);
               toast.success("Image deleted");
               fetchImages();
           } catch (error) {
               console.error('Error deleting image:', error);
           }
       }
   };

   const viewImage = (url) => {
       if (!url) return toast.error("Image not found");
       setImageModalIsOpen(true);
       setSelectedImage(url);
   };

   const handlePageChange = (newPage) => {
       setCurrentPage(newPage);
   };

   return (
       <div className="admin-gallery p-8 bg-gray-100 min-h-screen">
           <ToastContainer />
           <h2 className="text-2xl font-bold mb-6">Gallery Management</h2>
           <button
               onClick={() => openModal()}
               className="mb-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
           >
               Add New Image
           </button>

           <div className="overflow-x-auto">
                 <table className="table-auto min-w-full bg-white">
                   <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-medium">
                           <th className="px-5 py-3 text-center font-medium text-gray-600 border-b">Title</th>
                           <th className="px-5 py-3 text-center font-medium text-gray-600 border-b">Description</th>
                           <th className="px-5 py-3 text-center font-medium text-gray-600 border-b">Image</th>
                           <th className="px-5 py-3 text-center font-medium text-gray-600 border-b">Actions</th>
                       </tr>
                   </thead>
                   <tbody>
                       {images.length > 0 ? (
                           images.map((image) => (
                               <tr key={image.id} className="border-b hover:bg-gray-50">
                                   <td className="py-3 px-5">{image.title}</td>
                                   <td className="py-3 px-5 max-w-lg">
                                        {image.description ? (
                                            <span>{image.description.substring(0, 120)}...</span>
                                        ) : 'No description'}
                                    </td>
                                   <td className="py-3 px-5">
                                       <div
                                           onClick={() => viewImage(`http://127.0.0.1:8000/storage/${image.image_path}`)}
                                           style={{ backgroundImage: `url(http://127.0.0.1:8000/storage/${image.image_path})` }}
                                           className="w-12 h-12 max-h-12 max-w-12 bg-cover"
                                       ></div>
                                   </td>
                                   <td className="px-3 py-5 text-center">
                                   <div className="flex justify-center space-x-2">
                                       <button
                                           onClick={() => openModal(image)}
                                        className="bg-[#1D4ED8] text-white p-2 rounded hover:bg-blue-800 text-xs sm:text-base flex items-center"
                                       >
                                          <FaEdit className="mr-1" /> 
                                          Update
                                       </button>
                                       <button
                                           onClick={() => handleDelete(image.id)}
                                            className="bg-[#C81E1E] text-white p-2 rounded hover:bg-red-800 text-xs sm:text-base flex items-center"
                                       >
                                            <FaTrash className="mr-1" /> 
                                            Delete
                                       </button>
                                       </div>
                                   </td>
                               </tr>
                           ))
                       ) : (
                           <tr>
                               <td colSpan="5" className="text-center py-6 text-gray-500">
                                   {!isLoading && images.length === 0 ? 'No images found.' : 'Fetching images...'}
                               </td>
                           </tr>
                       )}
                   </tbody>
               </table>
           </div>

           <div className="flex justify-center mt-4">
               {Array.from({ length: totalPages }, (_, index) => (
                   <button
                       key={index + 1}
                       onClick={() => handlePageChange(index + 1)}
                       className={`px-3 py-1 mx-1 rounded ${
                           currentPage === index + 1
                               ? 'bg-blue-600 text-white'
                               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                       }`}
                   >
                       {index + 1}
                   </button>
               ))}
           </div>

           <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="relative w-full max-w-full sm:max-w-lg lg:max-w-2xl bg-white shadow-lg rounded-md p-6 sm:p-8 overflow-y-auto max-h-full"
                overlayClassName="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-8"
                >
                {/* Modal Header */}
                <div className="relative mb-5">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                    {isEditing ? 'Edit Image' : 'Add Announcement'}
                    </h3>
                    <button
                    onClick={closeModal}
                    className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Close"
                    >
                    <HiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title Input */}
                    <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                        required
                    />
                    </div>

                    {/* Description Textarea */}
                    <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Details</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                        rows="6"
                        style={{ resize: 'none', overflowY: 'auto' }}
                        required
                    />
                    </div>

                    {/* Media Input */}
                    <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Upload Image</label>
                    <input
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                        type="file"
                        name="image"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        required={!isEditing}
                    />
                    {mediaPreview && (
                        <div className="mt-3">
                        {media?.type.startsWith('video/') ? (
                            <video controls className="w-full h-40 object-cover rounded-lg shadow-md">
                            <source src={mediaPreview} type={media.type} />
                            Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                            src={mediaPreview}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg shadow-md"
                            />
                        )}
                        </div>
                    )}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-green-700 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        disabled={isLoading} // Use isLoading here
                        >
                        {isLoading ? ( // Use isLoading here
                            <div className="flex items-center justify-center">
                            <BeatLoader size={10} color="#fff" />
                            <span className="ml-2">{isEditing ? 'Updating...' : 'Posting...'}</span>
                            </div>
                        ) : (
                            isEditing ? 'Update' : 'Add'
                        )}
                        </button>
                    </div>
                </form>
                </Modal>

           <Modal
               isOpen={imageModalIsOpen}
               onRequestClose={closeImageModal}
               className="bg-white p-8 rounded shadow-lg max-w-lg mx-auto mt-10 "
               overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[999]"
           >
               <img src={selectedImage} alt="image" />
           </Modal>
       </div>
   );
}

export default AdminGallery;
