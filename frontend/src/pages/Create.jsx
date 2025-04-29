import { Container, VStack, Heading, Box, Text, Input, Button, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { useChurchStore } from '../store/church'

const Create = () => {
    const [newChurch, setNewChurch] = useState({
        name: "",
        latitude: "",
        longitude: "",
        address: "",
        city: "",
        state: "",
        description: "",
        phone: "",
        email: "",
        website: ""
    })

    const { createChurch } = useChurchStore()
    const handleAddChurch = async () => {
        const { success, message } = await createChurch(newChurch)
        console.log("Success:", success)
        console.log("Message:", message)
    }

    return <Container maxW={"container.sm"}>
        <VStack
            spacing={8}
        >
            <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
                Create New Church
            </Heading>

            <Box
                w={"full"} bg={useColorModeValue("white", "gray.800")}
                p={6} rounded={"lg"} shadow={"md"}
            >
                <VStack spacing={4}>
                    <Text as={"h4"} textAlign={"start"}>✪ = required field</Text>
                    <Input
                        placeholder='Church Name ✪'
                        name='name'
                        value={newChurch.name}
                        onChange={(e) => setNewChurch({ ...newChurch, name: e.target.value })}
                    />
                    <Input
                        placeholder='Church Latitude'
                        name='latitude'
                        type='number'
                        value={newChurch.latitude}
                        onChange={(e) => setNewChurch({ ...newChurch, latitude: e.target.value })}
                    />
                    <Input
                        placeholder='Church Longitude'
                        name='longitude'
                        type='number'
                        value={newChurch.longitude}
                        onChange={(e) => setNewChurch({ ...newChurch, longitude: e.target.value })}
                    />
                    <Input
                        placeholder='Church Address ✪'
                        name='address'
                        value={newChurch.address}
                        onChange={(e) => setNewChurch({ ...newChurch, address: e.target.value })}
                    />
                    <Input
                        placeholder='Church City ✪'
                        name='city'
                        value={newChurch.city}
                        onChange={(e) => setNewChurch({ ...newChurch, city: e.target.value })}
                    />
                    <Input
                        placeholder='Church State ✪'
                        name='state'
                        value={newChurch.state}
                        onChange={(e) => setNewChurch({ ...newChurch, state: e.target.value })}
                    />
                    <Input
                        placeholder='Church Description'
                        name='description'
                        value={newChurch.description}
                        onChange={(e) => setNewChurch({ ...newChurch, description: e.target.value })}
                    />
                    <Input
                        placeholder='Church Phone ✪'
                        name='phone'
                        value={newChurch.phone}
                        onChange={(e) => setNewChurch({ ...newChurch, phone: e.target.value })}
                    />
                    <Input
                        placeholder='Church Email ✪'
                        name='email'
                        value={newChurch.email}
                        onChange={(e) => setNewChurch({ ...newChurch, email: e.target.value })}
                    />
                    <Input
                        placeholder='Church Website ✪'
                        name='website'
                        value={newChurch.website}
                        onChange={(e) => setNewChurch({ ...newChurch, website: e.target.value })}
                    />
                    <Button colorScheme="blue" onClick={handleAddChurch} w='full'>Add Church</Button>
                </VStack>

            </Box>
        </VStack>
    </Container>
}

export default Create
