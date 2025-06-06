import React from 'react'
import { Box, Container, Grid, GridItem, Heading, Text, Link, Flex, Icon } from '@chakra-ui/react'
import { FaGithub, FaLinkedin, FaLink } from 'react-icons/fa'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <Container maxW="container.xl" px={4} borderTop={"1px solid gray"}
        >
            <Heading
                as="h3"
                fontSize="xl"
                fontWeight="bold"
                mb={4}
                bgGradient="linear(to-r, cyan.400, blue.500)"
                bgClip="text"
                textAlign="center"
                paddingTop={"20px"}
            >
                ConGreG8
            </Heading>
            <Text
                color="gray.300"
                textAlign="center"
                paddingBottom={"40px"}
            >
                Making the search for a new church simple and efficient.
            </Text>
            <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap={8}
            >
                {/* Quick Links */}
                <GridItem>
                    <Heading
                        as="h3"
                        fontSize="xl"
                        fontWeight="bold"
                        mb={4}
                        bgGradient="linear(to-r, cyan.400, blue.500)"
                        bgClip="text"
                    >
                        Quick Links
                    </Heading>
                    <Flex direction="column" gap={2}>
                        <Link href="#" color="gray.300" _hover={{ color: "white" }}>About Us</Link>
                        <Link href="#" color="gray.300" _hover={{ color: "white" }}>Features</Link>
                        <Link href="#" color="gray.300" _hover={{ color: "white" }}>Contact</Link>
                    </Flex>
                </GridItem>

                {/* Resources */}
                <GridItem>
                    <Heading
                        as="h3"
                        fontSize="xl"
                        fontWeight="bold"
                        mb={4}
                        bgGradient="linear(to-r, cyan.400, blue.500)"
                        bgClip="text"
                    >
                        Resources
                    </Heading>
                    <Flex direction="column" gap={2}>
                        <Link href="#" color="gray.300" _hover={{ color: "white" }}>Documentation</Link>
                        <Link href="#" color="gray.300" _hover={{ color: "white" }}>Support</Link>
                        <Link href="#" color="gray.300" _hover={{ color: "white" }}>FAQ</Link>
                    </Flex>
                </GridItem>

                {/* Social Media */}
                <GridItem>
                    <Heading
                        as="h3"
                        fontSize="xl"
                        fontWeight="bold"
                        mb={4}
                        bgGradient="linear(to-r, cyan.400, blue.500)"
                        bgClip="text"
                    >
                        Connect With Us
                    </Heading>
                    <Flex gap={4}>
                        <Link href="https://github.com/Six5pAdes" color="gray.300" _hover={{ color: "white" }} target="_blank" rel="noopener noreferrer">
                            <Icon as={FaGithub} boxSize={6} />
                        </Link>
                        <Link href="https://www.linkedin.com/in/austinhall-6spades/" color="gray.300" _hover={{ color: "white" }} target="_blank" rel="noopener noreferrer">
                            <Icon as={FaLinkedin} boxSize={6} />
                        </Link>
                        <Link href="https://six5pades.github.io/" color="gray.300" _hover={{ color: "white" }} target="_blank" rel="noopener noreferrer">
                            <Icon as={FaLink} boxSize={6} />
                        </Link>
                    </Flex>
                </GridItem>
            </Grid>

            {/* Copyright */}
            <Box
                borderTop="1px"
                borderColor="gray.700"
                mt={8}
                pt={8}
                textAlign="center"
                color="gray.300"
            >
                <Text>&copy; {currentYear} ConGreG8. All rights reserved.</Text>
            </Box>
        </Container>
    )
}

export default Footer
