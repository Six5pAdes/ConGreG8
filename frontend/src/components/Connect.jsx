import React from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Box, Flex, Link, Icon, useColorModeValue } from '@chakra-ui/react'
import { FaGithub, FaLinkedin, FaLink } from 'react-icons/fa'

const Connect = ({ isOpen, onClose }) => {
    const bg = useColorModeValue('white', 'gray.800')
    const color = useColorModeValue('gray.800', 'gray.100')
    const linkColor = useColorModeValue('gray.600', 'gray.300')
    const linkHover = useColorModeValue('blue.600', 'white')

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg={bg} color={color}>
                <ModalHeader>Connect with the Developer</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box textAlign="center" py={4}>
                        <Flex gap={4} justify="center">
                            <Link href="https://github.com/Six5pAdes" color={linkColor} _hover={{ color: linkHover }} target="_blank" rel="noopener noreferrer">
                                <Icon as={FaGithub} boxSize={6} />
                            </Link>
                            <Link href="https://www.linkedin.com/in/austinhall-6spades/" color={linkColor} _hover={{ color: linkHover }} target="_blank" rel="noopener noreferrer">
                                <Icon as={FaLinkedin} boxSize={6} />
                            </Link>
                            <Link href="https://six5pades.github.io/" color={linkColor} _hover={{ color: linkHover }} target="_blank" rel="noopener noreferrer">
                                <Icon as={FaLink} boxSize={6} />
                            </Link>
                        </Flex>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default Connect
