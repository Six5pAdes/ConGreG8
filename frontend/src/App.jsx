import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { useEffect } from 'react';
import { useUserStore } from './store/user';

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AddUserPrefs from "./pages/AddUserPrefs";
import AddChurchAttrs from "./pages/AddChurchAttrs";

import ChurchInfo from "./pages/ChurchInfo";
import CreateChurch from "./pages/CreateChurch";
import ReviewForm from "./pages/ReviewForm";
import VolunteerForm from "./components/VolunteerForm";

import Account from "./pages/Account";
import UserReviews from "./pages/UserReviews";
import Saved from './pages/Saved'

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import About from "./pages/About"
import Features from './pages/Features'
import Map from './pages/Map'

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
  );
}

export default App;
