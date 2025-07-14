import { Box, Button, Container, Heading, Input, useColorModeValue, useToast, VStack, FormControl, FormLabel, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react'
import { PasswordInput } from "@/components/ui/password-input"
import { useState } from 'react'
import { useUserStore } from '../../store/user'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
    })
    const toast = useToast()
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()

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

    const handleDemoLogin = async (type) => {
        let credentials
        if (type === 'churchgoer') {
            credentials = { email: 'demo@user.io', password: 'password' }
        } else if (type === 'churchRep') {
            credentials = { email: 'demo@familyhomechurch.org', password: 'FaSoHoSp' }
        }
        const { success, message } = await login(credentials)
        if (!success) {
            toast({
                title: 'Error',
                description: message,
                status: 'error',
                isClosable: true,
            })
        } else {
            toast({
                title: 'Success',
                description: message,
                status: 'success',
                isClosable: true,
            })
            navigate('/')
        }
        onClose()
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

                    <HStack width="full" spacing={4}>
                        <Button
                            colorScheme="blue"
                            flex={1}
                            onClick={handleLoginUser}
                            isDisabled={!isFormValid()}
                        >
                            Log In
                        </Button>
                        <Button
                            variant="solid"
                            flex={1}
                            colorScheme="cyan"
                            onClick={() => navigate('/signup')}
                        >
                            Don't have an account? Sign Up
                        </Button>
                    </HStack>

                    <Button
                        width="full"
                        spacing={4}
                        colorScheme="teal"
                        onClick={onOpen}
                    >
                        Demo Login
                    </Button>

                    <Modal isOpen={isOpen} onClose={onClose} isCentered>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Demo Login</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <VStack spacing={4}>
                                    <Button
                                        colorScheme="gray"
                                        width="fit-content"
                                        onClick={() => handleDemoLogin('churchgoer')}
                                    >
                                        Login as Demo Churchgoer
                                    </Button>
                                    <Button
                                        colorScheme="purple"
                                        width="fit-content"
                                        onClick={() => handleDemoLogin('churchRep')}
                                    >
                                        Login as Demo Church Rep
                                    </Button>
                                </VStack>
                            </ModalBody>
                        </ModalContent>
                    </Modal>

                </VStack>
            </Box>
        </VStack>
    </Container>
}

export default Login
