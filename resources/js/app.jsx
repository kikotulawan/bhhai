import React, { useState, useEffect , useRef} from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import HomeOwner_Step1 from "./pages/HomeOwner_Step1";
import HomeOwner_Step2 from "./pages/HomeOwner_Step2";
import HomeOwner_Step3 from "./pages/HomeOwner_Step3";
import Renter_Step1 from "./pages/Renter_Step1";
import Renter_Step2 from "./pages/Renter_Step2";
import Renter_Step3 from "./pages/Renter_Step3";
import UserAnnouncements from "./pages/AnnouncementPage";
import ForgotPassword from "./pages/forgot-password";
import Home from "./pages/Home";
import Navbar from "./components/nav/Navbar";
import NewApp from "./NewApp";
import AboutPage from "./pages/about-page";
import Footer from "./components/footer";
import AnnouncementDetails from "./pages/AnnouncementDetails";
import ResetPassword from "./pages/ResetPassword";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/scroll.css";
import NotificationComponent from "./components/NotificationComponent";
import Error500Page from "./pages/500errorpage";
import { setupAxiosInterceptors } from "./axiosConfig";
import Notfound4page04 from "./pages/notfound404";
import Gallery from "./pages/Gallery";
import UserProfile from "./pages/ProfileUser";
import UserAccountSettings from "./pages/UserAccountSetting";
import { fetchUserDetails } from "./api/user";
import Dashboard from "./pages/Dashboard";
import ViewAllNotifications from "./pages/AllNotification";
import ProofOfPayment from "./pages/ProofofPayment";
import ContactUs from "./pages/Contactus";

function App() {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        email: "",
        contact_number: "",
        block: "",
        lot: "",
        nameOfOwner: "",
        proofOfResidency: null,
        role: localStorage.getItem("role")?.toLowerCase() || "homeowner",
    });

    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

      // Refs for AboutPage sections
      const missionRef = useRef(null);
      const visionRef = useRef(null);
      const boardRef = useRef(null);

      

    useEffect(() => {
        const getUserDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No authentication token found.");
                return;
            }
    
            try {
                const data = await fetchUserDetails();
                if (data && data.id) {
                    localStorage.setItem("userId", `${data.id}`);
                    setUser(data); // Update user state with fetched data
    
                    // Redirect only if `is_first_login` is true
                    if (data.is_first_login === 1 && data.usertype !== "1") {
                        navigate("/profile/user-account-settings?tab=password", { replace: true });
                    }
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
    
        getUserDetails();
    }, []);
    

    useEffect(() => {
        setupAxiosInterceptors(navigate);
    }, [navigate]);

    const hideNavbarPaths = [
        "/login",
        "/500",
        "/404",
        "/forgot-pass",
        "/reset-pass",
        "/registration",
        "/homeowner_step1",
        "/homeowner_step2",
        "/homeowner_step3",
        "/renter_step1",
        "/renter_step2",
        "/renter_step3",
    ];

    const shouldHideNavbar = hideNavbarPaths.includes(
        location.pathname.toLowerCase()
    );
    const usertype = localStorage.getItem("usertype");

    const allowedPaths = ["/home", "/about", "/announcement", "/announcements", '/gallery','/contactus'];
    const disallowedPaths = [
        "/admin",
        "/users",
        "/registrant",
        "/houselist",
        "/notification",
        "/board-of-directors",
        "/myprofile",
        "/account-settings",
        "/homeowner_step1",
        "/homeowner_step2",
        "/homeowner_step3",
    ];

    const shouldShowFooter =
        allowedPaths.some((path) =>
            location.pathname.toLowerCase().startsWith(path)
        ) &&
        !disallowedPaths.some(
            (path) =>
                location.pathname.toLowerCase().startsWith(path) && path !== "/"
        );

    useEffect(() => {
        // If the user is an admin and on the root URL, redirect to admin dashboard
        if (usertype === "1" && location.pathname === "/") {
            navigate("/admin-dashboard");
        }
        // If the user is not logged in and on the root URL, redirect to /home
        else if (!usertype && location.pathname === "/") {
            navigate("/home");
        }
    }, [usertype, location, navigate]);

    return (
        <div className="min-h-screen flex-grow overflow-y-auto">
         {!shouldHideNavbar && usertype !== "1" && (
                <Navbar 
                    missionRef={location.pathname === '/about' ? missionRef : null}
                    visionRef={location.pathname === '/about' ? visionRef : null}
                    boardRef={location.pathname === '/about' ? boardRef : null}
                />
            )}
                <NotificationComponent />
                <Routes>
                    {/* Check if the user is an admin */}
                    {usertype === "1" ? (
                        // If the user is an admin, redirect all routes to the admin app component
                        <Route path="*" element={<NewApp />} />
                    ) : (
                        // If the user is not an admin, render the public and protected routes
                        <>
                            {/* Public Routes */}
                            <Route path="/500" element={<Error500Page />} />
                            <Route path="/404" element={<Notfound4page04 />} />
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/about" element={<AboutPage missionRef={missionRef} visionRef={visionRef} boardRef={boardRef} />} />
                            <Route
                                path="/announcement"
                                element={<UserAnnouncements />}
                            />
                            <Route
                                path="/gallery"
                                element={<Gallery />}
                            />
                             <Route
                                path="/contactus"
                                element={<ContactUs />}
                            />
                            <Route
                                path="/announcements/:id"
                                element={<AnnouncementDetails />}
                            />
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/registration"
                                element={<Registration />}
                            />
                            <Route
                                path="/reset-pass"
                                element={<ResetPassword />}
                            />
                            <Route
                                path="/forgot-pass"
                                element={<ForgotPassword />}
                            />
                            <Route
                                path="/homeowner_step1"
                                element={
                                    <HomeOwner_Step1
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                }
                            />
                            <Route
                                path="/homeowner_step2"
                                element={
                                    <HomeOwner_Step2
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                }
                            />
                            <Route
                                path="/homeowner_step3"
                                element={
                                    <HomeOwner_Step3
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                }
                            />
                            <Route
                                path="/renter_step1"
                                element={
                                    <Renter_Step1
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                }
                            />
                            <Route
                                path="/renter_step2"
                                element={
                                    <Renter_Step2
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                }
                            />
                            <Route
                                path="/renter_step3"
                                element={
                                    <Renter_Step3
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                }
                            />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/ProofOfPayment" element={<ProofOfPayment />} />
                            <Route path="/all-notifications" element={<ViewAllNotifications />} />
                            <Route path="/profile/*" element={<UserProfile />}>
                                <Route
                                    path="user-account-settings"
                                    element={<UserAccountSettings />}
                                />
                            </Route>
                        </>
                    )}
                </Routes>
            {shouldShowFooter && <Footer />}
        </div>
    );
}

export default App;
