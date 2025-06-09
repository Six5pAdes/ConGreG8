import { useUserStore } from '../store/user'
import { useUserPrefStore } from '../store/userPref'
import { Box, Container, useColorModeValue, useDisclosure, useToast, VStack, HStack, Text, Heading, Input, Button, IconButton, Select } from '@chakra-ui/react'
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
        setEditingPrefs({ ...userPrefs })
        setIsEditing(true)
    }

    const handleCancelEdit = () => {
        setEditingPrefs(null)
        setIsEditing(false)
    }

    const handleSavePrefs = async () => {
        const { success, message } = await updateUserPref(userPrefs._id, editingPrefs)
        if (success) {
            setUserPrefs(editingPrefs)
            setIsEditing(false)
            setEditingPrefs(null)
            toast({
                title: "Success",
                description: "Preferences updated successfully",
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

    const handleDeletePref = async (prefId) => {
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
    }

    const handleClearAllPrefs = () => {
        setEditingPrefs({
            size: null,
            ageGroup: null,
            ethnicity: null,
            language: null,
            denomination: null,
            volunteering: false,
            serviceTime: null,
            serviceNumber: null
        });
    }

    const PreferenceRow = ({ label, field, value, options }) => {
        const isEditingField = isEditing && editingPrefs !== null

        return (
            <HStack spacing={8} justify="space-between" align="center">
                <Text>{label}:</Text>
                <HStack spacing={2}>
                    {isEditingField ? (
                        options ? (
                            <Select
                                value={editingPrefs[field]}
                                onChange={(e) => setEditingPrefs({ ...editingPrefs, [field]: e.target.value })}
                                size="sm"
                                width="200px"
                            >
                                {options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </Select>
                        ) : (
                            <Input
                                value={editingPrefs[field]}
                                onChange={(e) => setEditingPrefs({ ...editingPrefs, [field]: e.target.value })}
                                size="sm"
                                width="200px"
                            />
                        )
                    ) : (
                        <Text fontWeight="bold">{value}</Text>
                    )}
                    {isEditingField && (
                        <IconButton
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => setEditingPrefs({ ...editingPrefs, [field]: null })}
                            aria-label="Clear preference"
                        />
                    )}
                </HStack>
            </HStack>
        )
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
                            {userPrefs && !isEditing && (
                                <Button
                                    leftIcon={<EditIcon />}
                                    colorScheme="blue"
                                    size="sm"
                                    onClick={handleEditPrefs}
                                >
                                    Edit Preferences
                                </Button>
                            )}
                            {isEditing && (
                                <HStack spacing={2}>
                                    <Button
                                        leftIcon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={handleClearAllPrefs}
                                    >
                                        Clear All
                                    </Button>
                                    <Button
                                        leftIcon={<EditIcon />}
                                        colorScheme="blue"
                                        size="sm"
                                        onClick={handleEditPrefs}
                                    >
                                        Edit Preferences
                                    </Button>
                                </HStack>
                            )}
                        </HStack>

                        <VStack align="stretch" spacing={4}>
                            {userPrefs ? (
                                <>
                                    <PreferenceRow
                                        label="Preferred Church Size"
                                        field="size"
                                        value={userPrefs.size}
                                        options={["--", "Small", "Midsize", "Big", "Megachurch"]}
                                    />
                                    <PreferenceRow
                                        label="Preferred Age Group"
                                        field="ageGroup"
                                        value={userPrefs.ageGroup}
                                        options={["--", "Family", "Young Adult", "Adult", "Senior"]}
                                    />
                                    <PreferenceRow
                                        label="Preferred Ethnicity"
                                        field="ethnicity"
                                        value={userPrefs.ethnicity}
                                        options={["--", "African American", "Asian", "Caucasian", "Hispanic", "Pacific Islander", "Other"]}
                                    />
                                    <PreferenceRow
                                        label="Preferred Language"
                                        field="language"
                                        value={userPrefs.language}
                                        options={["--", "English", "Spanish", "French", "German", "Mandarin", "Korean", "Other"]}
                                    />
                                    <PreferenceRow
                                        label="Preferred Denomination"
                                        field="denomination"
                                        value={userPrefs.denomination}
                                        options={["--", "Baptist", "Catholic", "Evangelical", "Lutheran", "Methodist", "Orthodox", "Pentecostal", "Presbyterian", "non-denominational"]}
                                    />
                                    <PreferenceRow
                                        label="Preferred Service Time"
                                        field="serviceTime"
                                        value={userPrefs.serviceTime}
                                        options={["--", "Morning", "Afternoon", "Evening"]}
                                    />
                                    <PreferenceRow
                                        label="Number of Services"
                                        field="serviceNumber"
                                        value={userPrefs.serviceNumber}
                                    />
                                    <PreferenceRow
                                        label="Interested in Volunteering"
                                        field="volunteering"
                                        value={userPrefs.volunteering ? "Yes" : "No"}
                                        options={["True", "False"]}
                                    />
                                    <PreferenceRow
                                        label="Looking for Participatory"
                                        field="participatory"
                                        value={userPrefs.participatory ? "Yes" : "No"}
                                        options={["True", "False"]}
                                    />
                                    {isEditing && (
                                        <HStack justify="flex-end" spacing={4} mt={4}>
                                            <Button
                                                leftIcon={<CheckIcon />}
                                                colorScheme="green"
                                                size="sm"
                                                onClick={handleSavePrefs}
                                            >
                                                Save Changes
                                            </Button>
                                            <Button
                                                leftIcon={<CloseIcon />}
                                                colorScheme="gray"
                                                size="sm"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </Button>
                                        </HStack>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Text textAlign="center">No preferences set yet</Text>
                                    <Button onClick={() => navigate("/add-user-preferences")} textAlign={"center"}>Set User Preferences</Button>
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
