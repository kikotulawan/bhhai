import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/styles.css";
import { fetchLatest } from "../api/user";
import axios from "axios"

const Home = () => {
    const [latestAnnouncements, setLatestAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`/api/gallery/latestImages`);
                setSlides(response.data || []);
            } catch (error) {
                console.error('Error fetching images:', error);
            } 
        };

        const loadAnnouncements = async () => {
            try {
                const announcements = await fetchLatest();
                console.log("Fetched Announcements:", announcements);
                setLatestAnnouncements(announcements);
            } catch (error) {
                console.error("Failed to fetch latest announcements:", error);
                setError("Failed to fetch latest announcements");
            } finally {
                setLoading(false);
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        loadAnnouncements();
        handleResize();
        fetchImages()
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const settings = {
        dots: true,
        infinite: slides.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: slides.length > 1,
        autoplaySpeed: 3000,
        prevArrow: <SamplePrevArrow />,
        nextArrow: <SampleNextArrow />,
    };

    const openModal = (image) => {
        if (!isMobile) {
            setSelectedImage(image);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage("");
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    const showPreviousImage = () => {
        const currentIndex = slides.findIndex(
            (slide) => slide.src === selectedImage
        );
        const previousIndex =
            currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
        setSelectedImage(slides[previousIndex].src);
    };

    const showNextImage = () => {
        const currentIndex = slides.findIndex(
            (slide) => slide.src === selectedImage
        );
        const nextIndex =
            currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        setSelectedImage(slides[nextIndex].src);
    };

    
   

    return (
        <div className="max-h-full overflow-y-auto bg-[#FAFAFA] p-2">
            <HeroSection sliderImages={slides} sliderOptions={settings} />
            <main className="container py-12 px-4 flex flex-col items-center mx-auto bg">
                <div className="w-full flex flex-col justify-items-center gap-6 ">
                    <Section title="Latest Announcements" className="mb-4  ">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto max-w-screen-lg overflow-hidden">
                                {latestAnnouncements.map(
                                    (announcement, index) => (
                                        <AnnouncementCard
                                            key={index}
                                            announcement={announcement}
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </Section>
                </div>
            </main>
        </div>
    );
};

const HeroSection = ({ sliderImages, sliderOptions }) => (
    <div
        className="relative flex flex-col md:flex-row items-center justify-center h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen p-4"
        style={{
            backgroundImage: "url('/images/Houses.JPG')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "24px",
        }}
    >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-70 rounded-3xl"></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col md:flex-row items-center w-full max-w-7xl mx-auto space-y-6 md:space-y-0 md:space-x-10 p-4">
            
            {/* Slider Section */}
            <div className="flex-1 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
                <Slider {...sliderOptions}>
                    {sliderImages.map((slide, index) => (
                        <div
                            key={index}
                            className="h-40 sm:h-60 md:h-80 lg:h-96 bg-black/50 rounded-lg overflow-hidden relative"
                            onClick={() => openModal(slide.src)}
                        >
                            <img
                                src={`http://127.0.0.1:8000/storage/${slide.image_path}`}
                                alt={`Slide ${index + 1}`}
                                className="object-cover h-full w-full"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-black/50 p-5 flex flex-col gap-2">
                                        <h5 className="capitalize text-gray-300 font-semibold text-xl">{slide.title}</h5>
                                        <p className="capitalize text-gray-300 line-clamp-3">{slide.description}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Text Content */}
            <div className="flex-1 text-white text-center md:text-left px-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-4">
                    Welcome to Brooklyn
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-6 max-w-md">
                    Welcome to Brooklyn Heights – Your serene escape in
                    Guiguinto, Bulacan, with easy access to schools and
                    commercial hubs, perfect for families and professionals.
                </p>
                <Link
                    to="/about"
                    className="bg-[#F28705] text-white px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                >
                    Explore more
                </Link>
            </div>
        </div>
    </div>
);

// Section Component
const Section = ({ title, children, className }) => (
    <section className={`mb-8 ${className}`}>
        <h1 className="text-5xl font-sans font-bold text-center mb-6 p-4">
            {title}
        </h1>

        {children}
    </section>
);

const AnnouncementCard = ({ announcement }) => {
    const isVideo = (file) => {
        const videoExtensions = [".mp4", ".mov", ".avi"];
        return videoExtensions.some((ext) => file.endsWith(ext));
    };

    const isPDF = (file) => {
        return file.endsWith(".pdf");
    };

    return (
        <Link
            to={`/announcements/${announcement.id}`}
            key={announcement.id}
            className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-300 flex flex-col justify-between mb-4"
        >
            <div className="h-40 overflow-hidden flex items-center justify-center bg-gray-100 border-b border-gray-300">
                {isPDF(announcement.image) ? (
                    <div className="flex flex-col items-center">
                        <svg
                            className="w-12 h-12 text-gray-800 dark:text-white mb-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M5 17v-5h1.5a1.5 1.5 0 1 1 0 3H5m12 2v-5h2m-2 3h2M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m6 4v5h1.375A1.627 1.627 0 0 0 14 15.375v-1.75A1.627 1.627 0 0 0 12.375 12H11Z"
                            />
                        </svg>
                        <p className="text-gray-700 text-sm">PDF Document</p>
                    </div>
                ) : isVideo(announcement.image) ? (
                    <video
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => e.target.pause()}
                        onTouchStart={(e) => e.target.play()}
                    >
                        <source
                            src={`/storage/${announcement.image}`}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img
                        src={`/storage/${announcement.image}`}
                        alt={announcement.title}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="p-2 flex-1 min-h-[150px]">
                <h2 className="text-base font-semibold mb-1 font-sans">
                    {announcement.title}
                </h2>
                <p className="text-gray-600 mb-1 text-sm font-sans">
                    {announcement.details.length > 100
                        ? `${announcement.details.substring(0, 100)}...`
                        : announcement.details}
                </p>
            </div>

            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <svg
                        className="w-4 h-4 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                        />
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M15 12a3 3 0 1 1 -6 0 3 3 0 0 1 6 0Z"
                        />
                    </svg>
                    <p className="text-xs text-gray-700 font-sans">
                        {announcement.views || 0} views
                    </p>
                </div>
                <p className="text-gray-500 text-xs font-sans">
                    {new Date(announcement.posted_date).toLocaleString()}
                </p>
            </div>
        </Link>
    );
};

// Slider Arrows
const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} block sm:right-10 right-2`} // Adjusts position on smaller screens
            style={{
                ...style,
                display: "block",
                zIndex: 10, // Higher z-index than images
                fontSize: "1.5rem", // Adjust size if needed
            }}
            onClick={onClick}
        />
    );
};

const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} block sm:left-10 left-2`} // Adjusts position on smaller screens
            style={{
                ...style,
                display: "block",
                zIndex: 10, // Higher z-index than images
                fontSize: "1.5rem", // Adjust size if needed
            }}
            onClick={onClick}
        />
    );
};

export default Home;
