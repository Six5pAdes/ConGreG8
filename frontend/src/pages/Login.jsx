import { Box, Button, Container, Heading, Input, useColorModeValue, useToast, VStack, FormControl, FormLabel } from '@chakra-ui/react'
import { PasswordInput } from "@/components/ui/password-input"
import { useState } from 'react'
import { useUserStore } from '../store/user'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
    })
    const toast = useToast()
    const navigate = useNavigate()

    const isFormValid = () => {
        return (
            newUser.email.trim() !== "" &&
            newUser.password.trim() !== ""
        )
    }

    const { login } = useUserStore()

    const handleLoginUser = async () => {
        const { success, message } = await login(newUser)

        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                isClosable: true,
            })
        } else {
            toast({
                title: "Success",
                description: message,
                status: "success",
                isClosable: true,
            })
            navigate('/')
        }

        setNewUser({
            email: "",
            password: "",
        })
    }


    return <Container maxW={"container.sm"}>
        <VStack spacing={8} py={8}>
            <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
                Log In
            </Heading>

            <Box
                w={"full"} bg={useColorModeValue("white", "gray.800")} p={6} rounded={"lg"} shadow={"md"}
            >
                <VStack spacing={4}>

                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <PasswordInput
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Enter your password"
                        />
                    </FormControl>

                    <Button
                        colorScheme="blue"
                        width="full"
                        onClick={handleLoginUser}
                        isDisabled={!isFormValid()}
                    >
                        Log In
                    </Button>

                    <Button
                        variant="solid"
                        width="half"
                        colorScheme="cyan"
                        onClick={() => navigate('/signup')}
                    >
                        Don't have an account? Sign In
                    </Button>
                </VStack>
            </Box>
        </VStack>
    </Container>
}

export default Login
