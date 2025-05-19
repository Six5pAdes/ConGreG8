import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { useEffect } from 'react';
import { useUserStore } from './store/user';

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreateChurch from "./pages/CreateChurch";
import Account from "./pages/Account";
import ChurchInfo from "./pages/ChurchInfo";

import NavBar from "./components/NavBar";

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
        <Route path="/church/:churchId" element={<ChurchInfo />} />
        <Route path="/new" element={<CreateChurch />} />
        <Route path="/profile/:userId" element={<Account />} />
      </Routes>
    </Box>
  );
}

export default App;
