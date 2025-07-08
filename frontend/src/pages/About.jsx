import React from 'react'
import { Container, Heading, Text, Link } from '@chakra-ui/react'

const About = () => {
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
                About ConGreG8
            </Heading>

            <Text fontSize={"50px"}
                textAlign={"start"}
                fontWeight={"bolder"}
                paddingLeft={20}
                paddingRight={800}
                textTransform={"capitalize"}
            >
                Your church search begins here!
            </Text>

            <Text fontSize={20} textAlign={"right"} paddingLeft={500} paddingRight={20}>
                ConGreG8 was built with one mission in mind: to make it easier for people to find
                a church community that feels like home. Whether you're new to an area or just
                exploring, we help connect you with churches that match your values and needs. <br />

                From service times and ministries to values and accessibility, we provide the
                information you need to make confident decisions. Think of us as your digital
                compass on your spiritual journey—bringing clarity, connection, and community
                to your church search.
            </Text>

            <Text fontSize={"m"} textAlign={"center"} fontWeight={"medium"} paddingTop={8}>
                Click {" "}
                <Link
                    href="/features"
                    color="turquoise">
                    here
                </Link> {" "}
                to learn more about how the site works.
            </Text>
        </Container>
    )
}

export default About
