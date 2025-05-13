import { Container, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useChurchStore } from '../store/church'
import { useUserStore } from '../store/user'
import ChurchCard from '../components/ChurchCard'

const Home = () => {
    const { fetchChurches, churches } = useChurchStore()
    const { currentUser } = useUserStore();

    useEffect(() => {
        fetchChurches()
    }, [fetchChurches])

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
                    All Available Churches
                </Text>

                <Text fontSize={"xl"} textAlign={"center"} fontWeight={"medium"} color={"gray.600"}>
                    Welcome to the ultimate church directory! Here you can find a list of all the churches in your area. Whether you're looking for a place to worship, volunteer, or connect with others, we have something for everyone. Explore our directory and discover the perfect church for you!
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

                {churches.length === 0 && currentUser && !currentUser.isChurchgoer && (
                    <Text as="span" textAlign={"center"} fontSize={"xl"} fontWeight={"medium"} color={"gray.600"}>
                        The congregation is empty. Come help populate ConGreG8!
                        <br />
                        <Link to={"/new"} color="teal.500" fontWeight="bold" _hover={{ textDecoration: "underline" }}>
                            <Text as="span" color="teal.500" fontWeight="bold" _hover={{ textDecoration: "underline" }}> Add a new church</Text>
                        </Link>
                    </Text>
                )}

            </VStack>
        </Container>
    )
}

export default Home
