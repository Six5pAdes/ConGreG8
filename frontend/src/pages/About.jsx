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
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. <br />

                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
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
