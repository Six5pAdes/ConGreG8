import { Container, Heading, VStack } from '@chakra-ui/react';

const Map = () => {
    return (
        <Container maxW="container.xl" py={14}>
            <VStack spacing={8} align="center">
                <Heading as="h1" size="2xl" color="teal.500">
                    Map View Coming Soon!
                </Heading>
            </VStack>
        </Container>
    );
};

export default Map;
