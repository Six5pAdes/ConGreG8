import React from 'react'
import { Box, Container, Grid, GridItem, Heading, Text, Link, Flex, Icon } from '@chakra-ui/react'
import Connect from "./Connect"
import { useState } from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear()
    const [isConnectOpen, setConnectOpen] = useState(false)

    return (
        <Container maxW="container.xl" px={4} borderTop={"1px solid gray"} marginTop={8}
        >
            <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={8}
                paddingTop={8}
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
                        <Link href="/about" color="gray.300" _hover={{ color: "white" }}>About Us</Link>
                        <Link href="/features" color="gray.300" _hover={{ color: "white" }}>Features</Link>
                        <Link color="gray.300" _hover={{ color: "white" }} onClick={e => { e.preventDefault(); setConnectOpen(true); }}>Contact</Link>
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
            </Grid>

            {/* Copyright */}
            <Connect isOpen={isConnectOpen} onClose={() => setConnectOpen(false)} />
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
