import React from 'react'
import { Container, Heading, Text, Box, Link, VStack, Divider, Badge, useColorMode } from '@chakra-ui/react'

export default function PrivacyPolicy() {
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'

    return (
        <Container maxW="4xl" py={10} px={6}>
            <VStack spacing={8} align="stretch">

                {/* Header */}
                <Box textAlign="center" py={8}>
                    <Heading
                        fontSize={{ base: "2xl", md: "4xl" }}
                        fontWeight="bold"
                        mb={4}
                        bgGradient="linear(to-r, cyan.400, blue.500)"
                        bgClip="text"
                    >
                        Privacy Policy
                    </Heading>
                    <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                        Last updated: July 16, 2025
                    </Badge>
                </Box>

                {/* Introduction */}
                <Box
                    bg={isDark ? "gray.700" : "gray.50"}
                    p={6}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={isDark ? "gray.600" : "gray.200"}
                >
                    <Text fontSize="lg" mb={4} textAlign="center">
                        This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                    </Text>
                    <Text textAlign="center">
                        We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. <br /> This Privacy Policy has been created with the help of the
                        <Link href="https://www.termsfeed.com/privacy-policy-generator/" target="_blank" color="blue.400" fontWeight="semibold"
                            _hover={{ textDecoration: 'underline' }}
                        > &nbsp;Privacy Policy Generator</Link>.
                    </Text>
                </Box>

                {/* Interpretation and Definitions */}
                <Box>
                    <Heading
                        fontWeight="bold"
                        fontSize="2xl"
                        mb={6}
                        color={isDark ? "gray.100" : "gray.700"}
                        borderBottom="2px solid"
                        borderColor="blue.200"
                        pb={2}
                    >
                        Interpretation and Definitions
                    </Heading>

                    <VStack spacing={6} align="stretch">
                        <Box>
                            <Heading as="h3" fontSize="lg" fontWeight="semibold" mb={3} color={isDark ? "gray.200" : "gray.600"}>
                                Interpretation
                            </Heading>
                            <Text>
                                The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                            </Text>
                        </Box>

                        <Box>
                            <Heading as="h3" fontSize="lg" fontWeight="semibold" mb={3} color={isDark ? "gray.200" : "gray.600"}>
                                Definitions
                            </Heading>
                            <Text mb={4}>For the purposes of this Privacy Policy:</Text>

                            <VStack spacing={3} align="stretch">
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</Text>
                                </Box>
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</Text>
                                </Box>
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to ConGreG8.</Text>
                                </Box>
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</Text>
                                </Box>
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>Country</strong> refers to: California, United States</Text>
                                </Box>
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</Text>
                                </Box>
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</Text>
                                </Box>
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>Service</strong> refers to the Website.</Text>
                                </Box>
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</Text>
                                </Box>
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</Text>
                                </Box>
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>Website</strong> refers to ConGreG8, accessible from <Link href="https://congreg8.onrender.com/" rel="external nofollow noopener" target="_blank" color="blue.400" fontWeight="semibold">https://congreg8.onrender.com/</Link></Text>
                                </Box>
                                <Box p={4} bg={isDark ? "blue.900" : "blue.50"} borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                                    <Text><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</Text>
                                </Box>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>

                <Divider />

                {/* Collecting and Using Your Personal Data */}
                <Box>
                    <Heading
                        fontWeight="bold"
                        fontSize="2xl"
                        mb={6}
                        color={isDark ? "gray.100" : "gray.700"}
                        borderBottom="2px solid"
                        borderColor="blue.200"
                        pb={2}
                    >
                        Collecting and Using Your Personal Data
                    </Heading>

                    <VStack spacing={6} align="stretch">
                        <Box>
                            <Heading as="h3" fontSize="lg" fontWeight="semibold" mb={4} color={isDark ? "gray.200" : "gray.600"}>
                                Types of Data Collected
                            </Heading>

                            <Box mb={6}>
                                <Heading as="h4" fontSize="md" fontWeight="semibold" mb={3} color={isDark ? "gray.300" : "gray.500"}>
                                    Personal Data
                                </Heading>
                                <Text mb={3}>
                                    While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                                </Text>
                                <VStack spacing={2} align="stretch" pl={4}>
                                    <Text>• Email address</Text>
                                    <Text>• First name and last name</Text>
                                    <Text>• Usage Data</Text>
                                </VStack>
                            </Box>

                            <Box mb={6}>
                                <Heading as="h4" fontSize="md" fontWeight="semibold" mb={3} color={isDark ? "gray.300" : "gray.500"}>
                                    Usage Data
                                </Heading>
                                <Text mb={3}>
                                    Usage Data is collected automatically when using the Service.
                                </Text>
                                <Text mb={3}>
                                    Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                                </Text>
                                <Text mb={3}>
                                    When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
                                </Text>
                                <Text>
                                    We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.
                                </Text>
                            </Box>

                            <Box mb={6}>
                                <Heading as="h4" fontSize="md" fontWeight="semibold" mb={3} color={isDark ? "gray.300" : "gray.500"}>
                                    Tracking Technologies and Cookies
                                </Heading>
                                <Text mb={3}>
                                    We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:
                                </Text>
                                <VStack spacing={3} align="stretch" pl={4}>
                                    <Box p={3} bg={isDark ? "yellow.900" : "yellow.50"} borderRadius="md" borderLeft="4px solid" borderColor="yellow.400">
                                        <Text><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</Text>
                                    </Box>
                                    <Box p={3} bg={isDark ? "yellow.900" : "yellow.50"} borderRadius="md" borderLeft="4px solid" borderColor="yellow.400">
                                        <Text><strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</Text>
                                    </Box>
                                </VStack>
                            </Box>
                        </Box>
                    </VStack>
                </Box>

                <Divider />

                {/* Use of Your Personal Data */}
                <Box>
                    <Heading as="h3" fontSize="lg" fontWeight="semibold" mb={4} color={isDark ? "gray.200" : "gray.600"}>
                        Use of Your Personal Data
                    </Heading>
                    <Text mb={4}>The Company may use Personal Data for the following purposes:</Text>

                    <VStack spacing={3} align="stretch">
                        <Box p={4} bg={isDark ? "green.900" : "green.50"} borderRadius="md" borderLeft="4px solid" borderColor="green.400">
                            <Text><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</Text>
                        </Box>
                        <Box p={4} bg={isDark ? "green.900" : "green.50"} borderRadius="md" borderLeft="4px solid" borderColor="green.400">
                            <Text><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</Text>
                        </Box>
                        <Box p={4} bg={isDark ? "green.900" : "green.50"} borderRadius="md" borderLeft="4px solid" borderColor="green.400">
                            <Text><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</Text>
                        </Box>
                        <Box p={4} bg={isDark ? "green.900" : "green.50"} borderRadius="md" borderLeft="4px solid" borderColor="green.400">
                            <Text><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</Text>
                        </Box>
                        <Box p={4} bg={isDark ? "green.900" : "green.50"} borderRadius="md" borderLeft="4px solid" borderColor="green.400">
                            <Text><strong>To provide You</strong> with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.</Text>
                        </Box>
                        <Box p={4} bg={isDark ? "green.900" : "green.50"} borderRadius="md" borderLeft="4px solid" borderColor="green.400">
                            <Text><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</Text>
                        </Box>
                        <Box p={4} bg={isDark ? "green.900" : "green.50"} borderRadius="md" borderLeft="4px solid" borderColor="green.400">
                            <Text><strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</Text>
                        </Box>
                        <Box p={4} bg={isDark ? "green.900" : "green.50"} borderRadius="md" borderLeft="4px solid" borderColor="green.400">
                            <Text><strong>For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</Text>
                        </Box>
                    </VStack>
                </Box>

                <Divider />

                {/* Contact Information */}
                <Box
                    bg={isDark ? "blue.900" : "blue.50"}
                    p={6}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={isDark ? "blue.600" : "blue.200"}
                    textAlign="center"
                >
                    <Heading fontSize="xl" fontWeight="bold" mb={4} color={isDark ? "blue.100" : "blue.700"}>
                        Contact Us
                    </Heading>
                    <Text mb={4}>If you have any questions about this Privacy Policy, You can contact the head developer:</Text>
                    <Text>
                        By email: <Link href="mailto:austinhall6smusic@gmail.com" color="blue.400" fontWeight="semibold">austinhall6smusic@gmail.com</Link>
                    </Text>
                </Box>
            </VStack>
        </Container>
    );
}
