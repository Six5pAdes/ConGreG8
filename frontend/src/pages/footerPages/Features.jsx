import React from 'react'
import { Container, Heading, Text, Box, List, ListItem, ListIcon } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

const Features = () => {
    return (
        <Container maxW="4xl" py={10} px={6}>
            <Heading
                fontSize="4xl"
                fontWeight="bold"
                mb={6}
                bgGradient="linear(to-r, cyan.400, blue.500)"
                bgClip="text"
                textAlign="center"
            >
                How ConGreG8 Works
            </Heading>

            <Text fontSize="lg" mb={6} textAlign="center">
                ConGreG8 helps you discover churches that align with your values, preferences, and community goals. Here's how:
            </Text>

            <Box mb={8}>
                <Heading fontSize="xl" mb={3}>Personalized Discovery</Heading>
                <List spacing={3}>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="cyan.500" />
                        Create an account as a churchgoer or a church representative.
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="cyan.500" />
                        Set your <strong>User Preferences</strong>: size, age group, ethnicity, language, denomination, and more.
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="cyan.500" />
                        Get matched to churches based on your preferences using structured church attribute data.
                    </ListItem>
                </List>
            </Box>

            <Box mb={8}>
                <Heading fontSize="xl" mb={3}>Church Profiles</Heading>
                <List spacing={3}>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="cyan.500" />
                        Churches can register and manage detailed profiles including images, descriptions, service times, contact info, and more.
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="cyan.500" />
                        Attributes like denomination, language, and age group help users filter effectively.
                    </ListItem>
                </List>
            </Box>

            <Box mb={8}>
                <Heading fontSize="xl" mb={3}>Reviews & Feedback</Heading>
                <List spacing={3}>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="cyan.500" />
                        Churchgoers can leave ratings and written reviews on church profiles.
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="cyan.500" />
                        View authentic feedback from the community to help guide your decisions.
                    </ListItem>
                </List>
            </Box>

            <Box mb={8}>
                <Heading fontSize="xl" mb={3}>Save & Compare</Heading>
                <List spacing={3}>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="cyan.500" />
                        Save churches to your favorites to revisit and compare later.
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="cyan.500" />
                        All your saved churches appear on your personalized Saved page.
                    </ListItem>
                </List>
            </Box>

            <Box>
                <Heading fontSize="xl" mb={3}>Volunteer Opportunities</Heading>
                <List spacing={3}>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="cyan.500" />
                        View or list opportunities to serve—filtered by membership status and role.
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="cyan.500" />
                        Indicate your interest in serving during preference setup to receive targeted opportunities.
                    </ListItem>
                </List>
            </Box>
        </Container>
    )
}

export default Features
