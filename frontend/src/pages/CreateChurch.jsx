import { Box, Button, Container, Heading, Input, Text, useColorModeValue, useToast, VStack, HStack, FormControl, FormLabel, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChurchStore } from '../store/church'

const CreateChurch = () => {
    const [newChurch, setNewChurch] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        description: "",
        phone: "",
        email: "",
        website: "",
        image: ""
    })
    const [selectedFile, setSelectedFile] = useState(null)

    const { createChurch } = useChurchStore()
    const toast = useToast()
    const navigate = useNavigate()

    const isFormValid = () => {
        return (
            newChurch.name.trim() !== "" &&
            newChurch.address.trim() !== "" &&
            newChurch.city.trim() !== "" &&
            newChurch.state.trim() !== "" &&
            newChurch.email.trim() !== "" &&
            newChurch.website.trim() !== "" &&
            (newChurch.image.trim() !== "" || selectedFile !== null)
        )
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            // Clear the URL input when a file is selected
            setNewChurch({ ...newChurch, image: "" })
        }
    }

    const handleAddChurch = async () => {
        /* If there's a selected file, you'll need to handle file upload here
        This would typically involve uploading to a storage service first
        For now, we'll just use the URL if no file is selected */
        const churchData = selectedFile
            ? { ...newChurch, imageFile: selectedFile }
            : newChurch

        const { success, message } = await createChurch(churchData)
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
        setNewChurch({
            name: "",
            address: "",
            city: "",
            state: "",
            description: "",
            phone: "",
            email: "",
            website: "",
            image: ""
        })
        setSelectedFile(null)
        navigate("/")
    }

    return <Container maxW={"container.sm"}>
        <VStack spacing={8} py={8}>
            <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
                Create New Church
            </Heading>

            <Box
                w={"full"} bg={useColorModeValue("white", "gray.800")} p={6} rounded={"lg"} shadow={"md"}
            >
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Church Name</FormLabel>
                        <Input
                            placeholder='Church Name'
                            name='name'
                            value={newChurch.name}
                            onChange={(e) => setNewChurch({ ...newChurch, name: e.target.value })}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Church Address</FormLabel>
                        <Input
                            placeholder='Church Address'
                            name='address'
                            value={newChurch.address}
                            onChange={(e) => setNewChurch({ ...newChurch, address: e.target.value })}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Church City</FormLabel>
                        <Input
                            placeholder='Church City'
                            name='city'
                            value={newChurch.city}
                            onChange={(e) => setNewChurch({ ...newChurch, city: e.target.value })}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Church State</FormLabel>
                        <Input
                            placeholder='Church State'
                            name='state'
                            value={newChurch.state}
                            onChange={(e) => setNewChurch({ ...newChurch, state: e.target.value })}
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Church Description</FormLabel>
                        <Textarea
                            placeholder='Church Description'
                            name='description'
                            value={newChurch.description}
                            onChange={(e) => setNewChurch({ ...newChurch, description: e.target.value })}
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Church Phone</FormLabel>
                        <Input
                            placeholder='Church Phone'
                            name='phone'
                            value={newChurch.phone}
                            onChange={(e) => setNewChurch({ ...newChurch, phone: e.target.value })}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Church Email</FormLabel>
                        <Input
                            placeholder='Church Email'
                            name='email'
                            value={newChurch.email}
                            onChange={(e) => setNewChurch({ ...newChurch, email: e.target.value })}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Church Website</FormLabel>
                        <Input
                            placeholder='Church Website'
                            name='website'
                            value={newChurch.website}
                            onChange={(e) => setNewChurch({ ...newChurch, website: e.target.value })}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Church Name</FormLabel>
                        <HStack w="full" spacing={4}>
                            <Input
                                placeholder='Church Image URL'
                                name='image'
                                value={newChurch.image}
                                onChange={(e) => {
                                    setNewChurch({ ...newChurch, image: e.target.value })
                                    setSelectedFile(null) // Clear file selection when URL is entered
                                }}
                                isDisabled={!!selectedFile}
                            />
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                display="none"
                                id="file-upload"
                            />
                            <Button
                                as="label"
                                htmlFor="file-upload"
                                colorScheme="blue"
                                variant="outline"
                                cursor="pointer"
                            >
                                Upload Image
                            </Button>
                        </HStack>
                        {selectedFile && (
                            <Text fontSize="sm" color="gray.500">
                                Selected file: {selectedFile.name}
                            </Text>
                        )}
                    </FormControl>
                    <Button
                        colorScheme="blue"
                        onClick={handleAddChurch}
                        w='half'
                        isDisabled={!isFormValid()}
                    >
                        Add Church
                    </Button>
                    <Button colorScheme='red' onClick={() => navigate(-1)} w={'half'}>Cancel</Button>
                </VStack>

            </Box>
        </VStack>
    </Container>
}

export default CreateChurch
