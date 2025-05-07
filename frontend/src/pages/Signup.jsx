import { Box, Button, Container, Heading, Input, Text, useColorModeValue, useToast, VStack, HStack, RadioGroup, Radio, FormControl, FormLabel } from '@chakra-ui/react'
import { useState } from 'react'
import { useUserStore } from '../store/user'

const Signup = () => {
    const [newUser, setNewUser] = useState({
        isChurchgoer: "",
        firstName: "",
        lastName: "",
        username: "",
        churchName: "",
        email: "",
        password: "",
    })
    const [churchgoerType, setChurchgoerType] = useState("")
    const toast = useToast()

    const isFormValid = () => {
        return (
            newUser.isChurchgoer !== "" &&
            (newUser.isChurchgoer === true || newUser.isChurchgoer === "yes") &&
            (newUser.firstName.trim() !== "" &&
                newUser.lastName.trim() !== "" &&
                newUser.username.trim() !== "" &&
                newUser.email.trim() !== "" &&
                newUser.password.trim() !== ""
            ) ||
            (newUser.isChurchgoer === false || newUser.isChurchgoer === "no") &&
            (newUser.churchName.trim() !== "" &&
                newUser.email.trim() !== "" &&
                newUser.password.trim() !== "")
        )
    }

    const { createUser } = useUserStore()

    const handleAddUser = async () => {
        const { success, message } = await createUser(newUser)

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
        }

        setNewUser({
            isChurchgoer: "",
            firstName: "",
            lastName: "",
            username: "",
            churchName: "",
            email: "",
            password: "",
        })
        setChurchgoerType("")
    }

    const handleChurchgoerChange = (value) => {
        setChurchgoerType(value)
        // Convert string to boolean if needed
        const isChurchgoer = value === "yes" ? true : value === "no" ? false : value
        setNewUser(prev => ({ ...prev, isChurchgoer }))
    }

    return <Container maxW={"container.sm"}>
        <VStack spacing={8} py={8}>
            <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
                Welcome, new congregant!
            </Heading>
            <Text as={"h3"} size={"1xl"} >
                Please sign up, and we'll help you with your churchly needs.
            </Text>

            <Box
                w={"full"} bg={useColorModeValue("white", "gray.800")} p={6} rounded={"lg"} shadow={"md"}
            >
                <VStack spacing={4}>

                    <FormControl isRequired>
                        <FormLabel>Are you a churchgoer?</FormLabel>
                        <RadioGroup onChange={handleChurchgoerChange} value={churchgoerType}>
                            <HStack spacing={4}>
                                <Radio value="yes">Yes</Radio>
                                <Radio value="no">No</Radio>
                            </HStack>
                        </RadioGroup>
                    </FormControl>

                    {(newUser.isChurchgoer === true || newUser.isChurchgoer === "yes") && (
                        <VStack spacing={4} w="full">
                            <FormControl isRequired>
                                <FormLabel>First Name</FormLabel>
                                <Input
                                    value={newUser.firstName}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                                    placeholder="Enter your first name"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Last Name</FormLabel>
                                <Input
                                    value={newUser.lastName}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                                    placeholder="Enter your last name"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    value={newUser.username}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                                    placeholder='Enter your username'
                                />
                            </FormControl>

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
                                <Input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="Enter your password"
                                />
                            </FormControl>
                        </VStack>
                    )}

                    {(newUser.isChurchgoer === false || newUser.isChurchgoer === "no") && (
                        <VStack spacing={4} w="full">
                            <FormControl isRequired>
                                <FormLabel>Church Name</FormLabel>
                                <Input
                                    value={newUser.churchName}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, churchName: e.target.value }))}
                                    placeholder="Enter your church name"
                                />
                            </FormControl>

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
                                <Input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="Enter your password"
                                />
                            </FormControl>
                        </VStack>
                    )}

                    <Button
                        colorScheme="blue"
                        width="full"
                        onClick={handleAddUser}
                        isDisabled={!isFormValid()}
                    >
                        Sign Up
                    </Button>
                </VStack>
            </Box>
        </VStack>
    </Container>
}

export default Signup
