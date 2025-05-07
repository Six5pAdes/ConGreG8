import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom"

import Home from "./pages/Home"
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreateChurch from "./pages/CreateChurch"
import Account from "./pages/Account"

import NavBar from "./components/NavBar"

function App() {
  return (
    <Box minH={"100vh"}
      bg={useColorModeValue("gray.100", "gray.900")} p={4}
    >
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/church/:id" element={<div>Church Details</div>} />
        <Route path="/new" element={<CreateChurch />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Box>
  )
}

export default App
