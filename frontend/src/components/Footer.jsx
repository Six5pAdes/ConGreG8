import React from 'react'
import { Box, Container, Grid, GridItem, Heading, Text, Link, Flex, useToast } from '@chakra-ui/react'
import Connect from "./Connect"
import { useState } from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear()
    const [isConnectOpen, setConnectOpen] = useState(false)
    const toast = useToast();

    const handleComingSoon = (e) => {
        e.preventDefault();
        toast({
            title: 'Coming Soon',
            description: 'This page will be added soon.',
            status: 'info',
            duration: 2500,
            isClosable: true,
            position: 'top',
        });
    };

    return (
        <Container maxW="container.xl" px={4} borderTop={"1px solid gray"} marginTop={8}>
            <Grid gap={8} paddingTop={8}>
                <GridItem>
                    <Heading
                        as="h3"
                        fontSize="xl"
                        fontWeight="bold"
                        textAlign={"center"}
                        mb={4}
                        bgGradient="linear(to-r, cyan.400, blue.500)"
                        bgClip="text"
                    >
                        Quick Links
                    </Heading>

                    <Flex direction="row" gap={2} justifyContent={"space-around"} paddingTop={5}>
                        <Link href="/about" color="gray.300" _hover={{ color: "white" }}>About Us</Link>
                        <Link href="/features" color="gray.300" _hover={{ color: "white" }}>Features</Link>
                        <Link
                            // href='/faq'
                            color="gray.300" _hover={{ color: "white" }} onClick={handleComingSoon}>FAQ</Link>
                        <Link
                            // href='/terms'
                            color="gray.300" _hover={{ color: "white" }} onClick={handleComingSoon}>Terms of Service</Link>
                        <Link
                            href='/privacy'
                            color="gray.300" _hover={{ color: "white" }} onClick={handleComingSoon}>Privacy Policy</Link>
                        <Link color="gray.300" _hover={{ color: "white" }} onClick={e => { e.preventDefault(); setConnectOpen(true); }}>Contact</Link>
                    </Flex>
                </GridItem>

            </Grid>

            {/* Copyright */}
            <Connect isOpen={isConnectOpen} onClose={() => setConnectOpen(false)} />
            <Box
                borderTop="1px"
                borderColor="gray"
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
