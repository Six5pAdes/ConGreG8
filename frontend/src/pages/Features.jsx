import { Container, Heading } from "@chakra-ui/react"

const Features = () => {
    return (
        <Container maxW="none" px={0}>
            <Heading
                fontSize={"3xl"}
                fontWeight={"bold"}
                mb={4}
                bgGradient="linear(to-r, cyan.400, blue.500)"
                bgClip="text"
                textAlign="center"
                paddingTop={"20px"}
            >
                How ConGreG8 Works
            </Heading>
        </Container>
    )
}

export default Features
