import React, { useEffect, useState } from 'react'
import { Container, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useSavedStore } from '../store/saved'
import { useChurchStore } from '../store/church'
import ChurchCard from '../components/ChurchCard'

const Saved = () => {
    const { fetchSaved, savedChurches, isLoading, error } = useSavedStore()
    const { fetchChurch } = useChurchStore()
    const [churches, setChurches] = useState([])

    useEffect(() => {
        fetchSaved()
    }, [fetchSaved])

    useEffect(() => {
        const fetchChurches = async () => {
            const churchPromises = savedChurches.map(saved => fetchChurch(saved.churchId))
            const results = await Promise.all(churchPromises)
            const validChurches = results
                .filter(result => result.success)
                .map(result => result.data)
            setChurches(validChurches)
        }
        if (savedChurches.length > 0) {
            fetchChurches()
        }
    }, [savedChurches, fetchChurch])

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={14}>
                <Text>Loading your saved churches...</Text>
            </Container>
        )
    }

    if (error) {
        return (
            <Container maxW="container.xl" py={14}>
                <Text color="red.500">Error: {error}</Text>
            </Container>
        )
    }

    return (
        <Container maxW="container.xl" py={14}>
            <VStack spacing={8}>
                <Text
                    fontSize={"4xl"}
                    fontWeight={"bold"}
                    bgGradient={"linear(to-r, teal.500, green.500)"}
                    bgClip={"text"}
                    textAlign={"center"}
                    textTransform={"uppercase"}
                    letterSpacing={"wider"}
                >
                    Your Saved Churches
                </Text>

                <Text fontSize={"xl"} textAlign={"center"} fontWeight={"medium"} color={"gray.600"}>
                    Browse through the churches you've saved for future visits. Click on any church card to view more details.
                </Text>

                <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    spacing={10}
                    w={"full"}
                    justifyItems={"center"}
                >
                    {churches.map((church) => (
                        <ChurchCard key={church._id} church={church} />
                    ))}
                </SimpleGrid>

                {churches.length === 0 && (
                    <Text fontSize={"xl"} textAlign={"center"} fontWeight={"medium"} color={"gray.600"}>
                        You haven't saved any churches yet. Start exploring churches and save the ones you're interested in visiting!
                    </Text>
                )}
            </VStack>
        </Container>
    )
}

export default Saved
