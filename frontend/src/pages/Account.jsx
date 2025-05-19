import { useUserStore } from '../store/user'
import { Box, Container, useColorModeValue, useDisclosure, useToast, VStack, Text, Heading, Input } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

const Account = () => {
    const { userId } = useParams()
    const { currentUser, fetchUser, logout, updateUser, deleteUser } = useUserStore()
    const [user, setUser] = useState(null)
    const [updatedUser, setUpdatedUser] = useState(null)
    const bg = useColorModeValue("white", "gray.800")
    const textColor = useColorModeValue("light" ? "gray.800" : "whiteAlpha.900")
    const toast = useToast()
    const navigate = useNavigate()

    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    useEffect(() => {
        const loadUser = async () => {
            const { success, data } = await fetchUser(userId)
            if (success) {
                setUser(data)
                setUpdatedUser(data)
            }
        }
        loadUser()
    }, [userId, fetchUser])

    const handleDelete = async (uid) => {
        const { success, message } = await deleteUser(uid)
        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        } else {
            toast({
                title: "Success",
                description: message,
                status: "success",
                duration: 3000,
                isClosable: true,
            })
            navigate('/')
        }
    }

    const handleUpdate = async (cid, updatedUser) => {
        const { success, message } = await updateUser(cid, updatedUser)
        onUpdateClose()

        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        } else {
            toast({
                title: "Success",
                description: "User updated successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            const { success: fetchSuccess, data } = await fetchUser(userId)
            if (fetchSuccess) {
                setUser(data)
                setUpdatedUser(data)
            }
        }
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        const { success, message } = await logout();
        if (success) {
            toast({
                title: "Success",
                description: message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate('/');
        } else {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    return (
        <Container maxW="container.xl" py={14}>
            <VStack spacing={8} align="stretch">
                <Box
                    shadow="lg"
                    rounded="lg"
                    overflow="hidden"
                    bg={bg}
                    p={8}
                >
                    <Heading as="h1" size="2xl" textAlign="center" mb={8} color={textColor}>
                        {currentUser?.userType === "churchgoer" && (
                            <>
                                {currentUser?.username}'s Profile
                            </>
                        )}
                        {currentUser?.userType === "churchRep" && (
                            <>
                                {currentUser?.churchName}'s Profile
                            </>
                        )}
                    </Heading>

                    <VStack align="stretch" spacing={4}>
                        {currentUser?.userType === "churchgoer" && (
                            <Box>
                                <Text>Full Name: {currentUser?.firstName} {currentUser?.lastName}</Text>
                                <Text>Username: {currentUser?.username}</Text>
                                <Text>Email: {currentUser?.email}</Text>
                            </Box>
                        )}
                        {currentUser?.userType === "churchRep" && (
                            <Box>
                                <Text>Church Name: {currentUser?.churchName}</Text>
                                <Text>Email: {currentUser?.email}</Text>
                            </Box>
                        )}
                    </VStack>

                    <Box mt={8} display="flex" justifyContent="space-between">
                        <Button onClick={onUpdateOpen} colorScheme="blue" mr={4}>Update Account</Button>
                        <Button onClick={handleLogout} colorScheme="teal" mr={4}>Logout</Button>
                        <Button onClick={onDeleteOpen} colorScheme="red">Delete Account</Button>
                    </Box>
                </Box>

                <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
                    <ModalOverlay />

                    <ModalContent>
                        <ModalHeader>Edit User Info</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4} p={4} bg={bg} rounded={"lg"} shadow={"md"}>
                                {currentUser?.userType === "churchgoer" && (
                                    <>
                                        <Input
                                            placeholder='First Name'
                                            name='firstName'
                                            value={updatedUser?.firstName || ''}
                                            onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
                                        />
                                        <Input
                                            placeholder='Last Name'
                                            name='lastName'
                                            value={updatedUser?.lastName || ''}
                                            onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
                                        />
                                        <Input
                                            placeholder='Username'
                                            name='username'
                                            value={updatedUser?.username || ''}
                                            onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
                                        />
                                    </>
                                )}
                                {currentUser?.userType === "churchRep" && (
                                    <>
                                        <Input
                                            placeholder='Church Name'
                                            name='churchName'
                                            value={updatedUser?.churchName || ''}
                                            onChange={(e) => setUpdatedUser({ ...updatedUser, churchName: e.target.value })}
                                        />
                                    </>
                                )}
                                <Input
                                    placeholder='Email'
                                    name='email'
                                    value={updatedUser?.email || ''}
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                                />
                                <Input
                                    placeholder='Password'
                                    name='password'
                                    type='password'
                                    value={updatedUser?.password || ''}
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })}
                                />
                            </VStack>

                            <ModalFooter justifyContent={"space-evenly"}>
                                <Button colorScheme="teal" mr={3} onClick={() => handleUpdate(currentUser._id, updatedUser)}>
                                    Update
                                </Button>
                                <Button variant="ghost" onClick={onUpdateClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                    <ModalOverlay />

                    <ModalContent>
                        <ModalHeader>Confirm Deletion</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Are you sure you want to delete {currentUser.email}? This action cannot be undone.
                        </ModalBody>

                        <ModalFooter justifyContent={"space-evenly"}>
                            <Button
                                colorScheme="red"
                                onClick={() => {
                                    handleDelete(currentUser._id);
                                    onDeleteClose();
                                }}
                            >
                                Delete
                            </Button>
                            <Button variant="ghost" onClick={onDeleteClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </VStack>
        </Container >
    )
}

export default Account
