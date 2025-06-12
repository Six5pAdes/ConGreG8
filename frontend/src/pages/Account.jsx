import { useUserStore } from '../store/user'
import { useUserPrefStore } from '../store/userPref'
import { Box, Container, useColorModeValue, useDisclosure, useToast, VStack, HStack, Text, Heading, Input, Button, IconButton, Select, Badge } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons'

const Account = () => {
    const { userId } = useParams()
    const { currentUser, fetchUser, logout, updateUser, deleteUser } = useUserStore()
    const { fetchSingleUserPref, updateUserPref, deleteUserPref } = useUserPrefStore()

    const [user, setUser] = useState(null)
    const [updatedUser, setUpdatedUser] = useState(null)
    const [userPrefs, setUserPrefs] = useState(null)
    const [editingPrefs, setEditingPrefs] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

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
                // Fetch user preferences if user is a churchgoer
                if (data.userType === "churchgoer") {
                    const { success: prefSuccess, data: prefData } = await fetchSingleUserPref(data._id)
                    if (prefSuccess) {
                        setUserPrefs(prefData)
                    }
                }
            }
        }
        loadUser()
    }, [userId, fetchUser, fetchSingleUserPref])

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

    const handleEditPrefs = () => {
        navigate('/add-user-preferences', { state: { existingPrefs: userPrefs } })
    }

    const handleDeletePref = async (prefId, field) => {
        if (!field) {
            // If no field is specified, delete the entire preferences document
            const { success, message } = await deleteUserPref(prefId)
            if (success) {
                setUserPrefs(null)
                toast({
                    title: "Success",
                    description: "Preferences deleted successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: "Error",
                    description: message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            }
        } else {
            // Update the preferences document to remove the specific field
            const updatedPrefs = { ...userPrefs }
            if (Array.isArray(updatedPrefs[field])) {
                updatedPrefs[field] = []
            } else {
                updatedPrefs[field] = null
            }

            const { success, message } = await updateUserPref(prefId, updatedPrefs)
            if (success) {
                setUserPrefs(updatedPrefs)
                toast({
                    title: "Success",
                    description: `${field} preference removed successfully`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: "Error",
                    description: message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            }
        }
    }

    const handleClearAllPrefs = async (prefId) => {
        const clearedPrefs = {
            size: [],
            ageGroup: [],
            ethnicity: [],
            language: [],
            denomination: [],
            volunteering: false,
            serviceTime: [],
            serviceNumber: null,
            participatory: false
        }

        const { success, message } = await updateUserPref(prefId, clearedPrefs)
        if (success) {
            setUserPrefs(clearedPrefs)
            toast({
                title: "Success",
                description: "All preferences cleared successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            })
        } else {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true,
            })
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
                            <HStack spacing={8} justify="space-between">
                                <Text>Full Name: {currentUser?.firstName} {currentUser?.lastName}</Text>
                                <Text>Username: {currentUser?.username}</Text>
                                <Text>Email: {currentUser?.email}</Text>
                            </HStack>
                        )}
                        {currentUser?.userType === "churchRep" && (
                            <HStack spacing={8} justify="space-between">
                                <Text>Church Name: {currentUser?.churchName}</Text>
                                <Text>Email: {currentUser?.email}</Text>
                            </HStack>
                        )}
                    </VStack>

                    <Button onClick={onUpdateOpen} colorScheme="blue" mr={4} marginTop={10}>Update Account</Button>
                </Box>

                {/* box for user's prefs */}
                {currentUser?.userType === "churchgoer" && (
                    <Box
                        shadow="lg"
                        rounded="lg"
                        overflow="hidden"
                        bg={bg}
                        p={8}
                    >
                        <HStack justify="space-between" mb={8}>
                            <Heading as="h1" size="2xl" color={textColor}>
                                {currentUser?.username}'s Church Preferences
                            </Heading>
                            {userPrefs && Object.values(userPrefs).some(value =>
                                (Array.isArray(value) && value.length > 0) ||
                                (typeof value === 'boolean' && value) ||
                                (typeof value === 'number' && value !== null)
                            ) ? (
                                <HStack>
                                    <Button
                                        leftIcon={<EditIcon />}
                                        colorScheme="blue"
                                        size="sm"
                                        onClick={handleEditPrefs}
                                    >
                                        Edit Preferences
                                    </Button>
                                    <Button
                                        leftIcon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleClearAllPrefs(userPrefs._id)}
                                    >
                                        Delete All Preferences
                                    </Button>
                                </HStack>
                            ) : null}
                        </HStack>

                        <VStack align="stretch" spacing={4}>
                            {userPrefs && Object.values(userPrefs).some(value =>
                                (Array.isArray(value) && value.length > 0) ||
                                (typeof value === 'boolean' && value) ||
                                (typeof value === 'number' && value !== null)
                            ) ? (
                                <HStack wrap="wrap" spacing={4}>
                                    {userPrefs.size && userPrefs.size.length > 0 && (
                                        <Badge colorScheme="blue" p={2} borderRadius="md">
                                            Size: {userPrefs.size.map(size =>
                                                size.charAt(0).toUpperCase() + size.slice(1)
                                            ).join(', ')}
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeletePref(userPrefs._id, 'size')}
                                                aria-label="Delete size preference"
                                            />
                                        </Badge>
                                    )}
                                    {userPrefs.ageGroup && userPrefs.ageGroup.length > 0 && (
                                        <Badge colorScheme="green" p={2} borderRadius="md">
                                            Age Group: {userPrefs.ageGroup.map(group =>
                                                group.split(/(?=[A-Z])/).join(' ')
                                            ).join(', ')}
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeletePref(userPrefs._id, 'ageGroup')}
                                                aria-label="Delete age group preference"
                                            />
                                        </Badge>
                                    )}
                                    {userPrefs.ethnicity && userPrefs.ethnicity.length > 0 && (
                                        <Badge colorScheme="purple" p={2} borderRadius="md">
                                            Ethnicity: {userPrefs.ethnicity.map(ethnicity =>
                                                ethnicity.split(/(?=[A-Z])/).join(' ')
                                            ).join(', ')}
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeletePref(userPrefs._id, 'ethnicity')}
                                                aria-label="Delete ethnicity preference"
                                            />
                                        </Badge>
                                    )}
                                    {userPrefs.language && userPrefs.language.length > 0 && (
                                        <Badge colorScheme="orange" p={2} borderRadius="md">
                                            Language: {userPrefs.language.map(lang =>
                                                lang.charAt(0).toUpperCase() + lang.slice(1)
                                            ).join(', ')}
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeletePref(userPrefs._id, 'language')}
                                                aria-label="Delete language preference"
                                            />
                                        </Badge>
                                    )}
                                    {userPrefs.denomination && userPrefs.denomination.length > 0 && (
                                        <Badge colorScheme="teal" p={2} borderRadius="md">
                                            Denomination: {userPrefs.denomination.map(denom =>
                                                denom.split('-').map(word =>
                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                ).join(' ')
                                            ).join(', ')}
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeletePref(userPrefs._id, 'denomination')}
                                                aria-label="Delete denomination preference"
                                            />
                                        </Badge>
                                    )}
                                    {userPrefs.serviceTime && userPrefs.serviceTime.length > 0 && (
                                        <Badge colorScheme="cyan" p={2} borderRadius="md">
                                            Service Time: {userPrefs.serviceTime.map(time =>
                                                time.charAt(0).toUpperCase() + time.slice(1)
                                            ).join(', ')}
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeletePref(userPrefs._id, 'serviceTime')}
                                                aria-label="Delete service time preference"
                                            />
                                        </Badge>
                                    )}
                                    {userPrefs.serviceNumber && (
                                        <Badge colorScheme="pink" p={2} borderRadius="md">
                                            Services per Week: {userPrefs.serviceNumber}
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeletePref(userPrefs._id, 'serviceNumber')}
                                                aria-label="Delete service number preference"
                                            />
                                        </Badge>
                                    )}
                                    {userPrefs.volunteering && (
                                        <Badge colorScheme="yellow" p={2} borderRadius="md">
                                            Interested in Volunteering
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeletePref(userPrefs._id, 'volunteering')}
                                                aria-label="Delete volunteering preference"
                                            />
                                        </Badge>
                                    )}
                                    {userPrefs.participatory && (
                                        <Badge colorScheme="red" p={2} borderRadius="md">
                                            Prefers Participatory Worship
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeletePref(userPrefs._id, 'participatory')}
                                                aria-label="Delete participatory preference"
                                            />
                                        </Badge>
                                    )}
                                </HStack>
                            ) : (
                                <>
                                    <Text textAlign="center">No preferences set yet</Text>
                                    <Box display="flex" justifyContent="center" mt={4}>
                                        <Button
                                            onClick={() => navigate("/add-user-preferences")}
                                            size="sm"
                                            colorScheme='purple'
                                        >
                                            Set User Preferences
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </VStack>
                    </Box>
                )}

                <Box mt={8} display="flex" justifyContent="space-between">
                    <Button onClick={handleLogout} colorScheme="teal" mr={4}>Logout</Button>
                    <Button onClick={onDeleteOpen} colorScheme="red">Delete Account</Button>
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
                            Are you sure you want to delete {currentUser?.email || user?.email}? This action cannot be undone.
                        </ModalBody>

                        <ModalFooter justifyContent={"space-evenly"}>
                            <Button
                                colorScheme="red"
                                onClick={() => {
                                    handleDelete(currentUser?._id || user?._id);
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
