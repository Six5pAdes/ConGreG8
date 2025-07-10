import { Box, Button, Container, Heading, Input, Text, useColorModeValue, useToast, VStack, HStack, FormControl, FormLabel, Textarea, Select } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChurchStore } from '../../store/church.js'
import { useUserStore } from '../../store/user.js'
import { US_STATES } from '../../../../backend/models/church.model.js'
import axios from 'axios'

const CreateChurch = () => {
    const [newChurch, setNewChurch] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        description: "",
        phone: "",
        email: "",
        website: "",
        image: ""
    })
    const [selectedFile, setSelectedFile] = useState(null)

    const { createChurch } = useChurchStore()
    const { currentUser } = useUserStore()
    const toast = useToast()
    const navigate = useNavigate()

    // Check if user is authenticated
    useEffect(() => {
        if (!currentUser) {
            toast({
                title: "Authentication Required",
                description: "Please log in to create a church.",
                status: "warning",
                isClosable: true,
            })
            navigate('/login')
        } else if (currentUser.userType === 'churchgoer') {
            toast({
                title: "Access Denied",
                description: "Only church representatives can create churches.",
                status: "error",
                isClosable: true,
            })
            navigate('/')
        }
    }, [currentUser, navigate, toast])

    // Show loading or redirect if not authenticated
    if (!currentUser || currentUser.userType === 'churchgoer') {
        return null
    }

    const isFormValid = () => {
        return (
            newChurch.name.trim() !== "" &&
            newChurch.address.trim() !== "" &&
            newChurch.city.trim() !== "" &&
            newChurch.state.trim() !== "" &&
            newChurch.zipcode.trim() !== "" &&
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
        // Use backend geocoding endpoint
        let latitude = null;
        let longitude = null;
        try {
            const geoRes = await axios.post('/api/churches/geocode', {
                address: newChurch.address,
                city: newChurch.city,
                state: newChurch.state,
                zip: newChurch.zipcode
            });
            if (geoRes.data && geoRes.data.success) {
                latitude = geoRes.data.latitude;
                longitude = geoRes.data.longitude;
            } else {
                throw new Error("Address not found");
            }
        } catch (error) {
            toast({
                title: "Geocoding Error",
                description: "Could not determine location from address. Please check address and try again.",
                status: "error",
                isClosable: true
            });
            return;
        }

        /* If there's a selected file, you'll need to handle file upload here
        This would typically involve uploading to a storage service first
        For now, we'll just use the URL if no file is selected */
        const churchData = {
            ...newChurch,
            latitude,
            longitude,
            imageFile: selectedFile || undefined
        };

        const { success, message, data } = await createChurch(churchData);
        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                isClosable: true,
            });
        } else {
            toast({
                title: "Success",
                description: message,
                status: "success",
                isClosable: true,
            });
            setNewChurch({
                name: "",
                address: "",
                city: "",
                state: "",
                zipcode: "",
                description: "",
                phone: "",
                email: "",
                website: "",
                image: ""
            });
            setSelectedFile(null);
            navigate(`/add-church-attributes/${data._id}`);
        }
    };

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
                        <Select
                            placeholder='Select state'
                            name='state'
                            value={newChurch.state}
                            onChange={(e) => setNewChurch({ ...newChurch, state: e.target.value })}
                        >
                            {Object.entries(US_STATES).map(([abbr, name]) => (
                                <option key={abbr} value={name}>
                                    {name}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Church Zipcode</FormLabel>
                        <Input
                            placeholder='Church Zipcode'
                            name='zipcode'
                            value={newChurch.zipcode}
                            onChange={(e) => setNewChurch({ ...newChurch, zipcode: e.target.value })}
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
                        <FormLabel>Church Image</FormLabel>
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
