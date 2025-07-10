import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { useEffect } from 'react';
import { useUserStore } from './store/user';
import { LoadScript } from '@react-google-maps/api';

import Home from "./pages/Home";
import Signup from "./pages/userMisc/Signup";
import Login from "./pages/userMisc/Login";
import AddUserPrefs from "./pages/userMisc/AddUserPrefs";
import AddChurchAttrs from "./pages/churchMisc/AddChurchAttrs";

import ChurchInfo from "./pages/churchMisc/ChurchInfo";
import CreateChurch from "./pages/churchMisc/CreateChurch";
import ReviewForm from "./pages/reviewMisc/ReviewForm";
import VolunteerForm from "./components/VolunteerForm";

import Account from "./pages/userMisc/Account";
import UserReviews from "./pages/reviewMisc/UserReviews";
import Saved from './pages/Saved'

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import About from "./pages/footerPages/About"
import Features from './pages/footerPages/Features'
import Map from './pages/Map'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

function App() {
  const { currentUser } = useUserStore();

  useEffect(() => {
    // Check if we have a stored user session
    const checkSession = async () => {
      try {
        const response = await fetch('/api/users/current', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          useUserStore.getState().setCurrentUser(data.data);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    if (!currentUser) {
      checkSession();
    }
  }, [currentUser]);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <Box minH={"100vh"}
        bg={useColorModeValue("gray.100", "gray.900")} p={4}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-user-preferences" element={<AddUserPrefs />} />
          <Route path="/add-church-attributes/:churchId" element={<AddChurchAttrs />} />

          <Route path="/churches/:churchId" element={<ChurchInfo />} />

          <Route path="/new" element={<CreateChurch />} />
          <Route path="/review-new" element={<ReviewForm />} />
          <Route path="/review-edit/:reviewId" element={<ReviewForm />} />
          <Route path="/volunteering-new" element={<VolunteerForm />} />

          <Route path="/profile/:userId" element={<Account />} />
          <Route path="/profile/:userId/reviews" element={<UserReviews />} />
          <Route path="/profile/:userId/saved" element={<Saved />} />

          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/map" element={<Map />} />
        </Routes>
        <Footer />
      </Box>
    </LoadScript>
  );
}

export default App;
