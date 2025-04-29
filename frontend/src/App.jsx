import {
  Box,
  useColorModeValue
} from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Create from "./pages/Create"
import NavBar from "./components/NavBar"

function App() {
  return (
    <Box minH={"100vh"}
      bg={useColorModeValue("gray.100", "gray.900")} p={4}
    >
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/new" element={<Create />} />
        {/* <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Box>
  )
}

export default App
