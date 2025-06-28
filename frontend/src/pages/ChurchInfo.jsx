import {
    Box, Container, Heading, Image, Text, VStack, useColorModeValue, useDisclosure, HStack, Input, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Button,
    IconButton,
    Select,
    useToast,
    Textarea,
    Checkbox,
    Badge,
} from '@chakra-ui/react'

import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import { useChurchStore } from '../store/church'
import { useUserStore } from "../store/user"
import { useReviewStore } from '../store/review'
import { useSavedStore } from '../store/saved'
import { useVolunteerOpStore } from '../store/volunteer'
import { useChurchAttrStore } from '../store/churchAttr'

import { DeleteIcon, EditIcon, AddIcon, StarIcon } from "@chakra-ui/icons"
import ReviewCard from '../components/ReviewCard'
import { US_STATES } from '../../../backend/models/church.model.js'

const ChurchInfo = () => {
    // All hooks must be declared at the top level
    const { churchId } = useParams()
    const { currentUser } = useUserStore()
    const navigate = useNavigate()
    const toast = useToast()
    const bg = useColorModeValue("white", "gray.800")
    const textColor = useColorModeValue("gray.800", "whiteAlpha.900")
    const cardBg = useColorModeValue("white", "gray.700")
    const location = useLocation()

    // Store hooks
    const { fetchChurch, deleteChurch, updateChurch } = useChurchStore()
    const { fetchReviewByChurch, deleteReview } = useReviewStore()
    const { createSaved, deleteSaved, fetchSavedByUser } = useSavedStore()
    const { fetchVolunteerOpsByChurch, updateVolunteerOp, deleteVolunteerOp } = useVolunteerOpStore()
    const { fetchSingleChurchAttr, updateChurchAttr, deleteChurchAttr } = useChurchAttrStore()

    // State hooks
    const [church, setChurch] = useState(null)
    const [updatedChurch, setUpdatedChurch] = useState(null)
    const [volunteerOps, setVolunteerOps] = useState([])
    const [selectedVolunteerOp, setSelectedVolunteerOp] = useState(null)
    const [updatedVolunteerOp, setUpdatedVolunteerOp] = useState(null)
    const [reviews, setReviews] = useState([])
    const [selectedReview, setSelectedReview] = useState(null)
    const [isSaved, setIsSaved] = useState(false)
    const [savedId, setSavedId] = useState(null)
    const [churchAttrs, setChurchAttrs] = useState(null)

    // Disclosure hooks
    const { isOpen: isChurchUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure()
    const { isOpen: isChurchDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const { isOpen: isReviewDeleteOpen, onOpen: onReviewDeleteOpen, onClose: onReviewDeleteClose } = useDisclosure()
    const { isOpen: isVolunteerOpEditOpen, onOpen: onVolunteerOpEditOpen, onClose: onVolunteerOpEditClose } = useDisclosure()
    const { isOpen: isVolunteerOpDeleteOpen, onOpen: onVolunteerOpDeleteOpen, onClose: onVolunteerOpDeleteClose } = useDisclosure()

    useEffect(() => {
        if (!churchId) {
            toast({
                title: "Error",
                description: "Invalid church ID.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            navigate('/')
            return
        }
    }, [churchId, navigate, toast])

    useEffect(() => {
        const loadChurch = async () => {
            const { success, data } = await fetchChurch(churchId)
            if (success) {
                setChurch(data)
                setUpdatedChurch(data)
            }
        }
        loadChurch()
    }, [churchId, fetchChurch])

    useEffect(() => {
        const loadReviews = async () => {
            const { success, data } = await fetchReviewByChurch(churchId)
            if (success) {
                setReviews(data)
            }
        }
        loadReviews()
    }, [churchId, fetchReviewByChurch])

    useEffect(() => {
        const checkSavedStatus = async () => {
            if (currentUser && currentUser.userType === "churchgoer") {
                const { success, data } = await fetchSavedByUser(currentUser._id)
                if (success) {
                    const savedChurch = data.find(saved => saved.churchId === churchId)
                    if (savedChurch) {
                        setIsSaved(true)
                        setSavedId(savedChurch._id)
                    }
                }
            }
        }
        checkSavedStatus()
    }, [currentUser, churchId, fetchSavedByUser])

    useEffect(() => {
        const loadVolunteerOps = async () => {
            const { success, data } = await fetchVolunteerOpsByChurch(churchId)
            if (success) {
                setVolunteerOps(data)
            }
        }
        loadVolunteerOps()
    }, [churchId, fetchVolunteerOpsByChurch])

    useEffect(() => {
        const loadChurchAttrs = async () => {
            const { success, data } = await fetchSingleChurchAttr(churchId)
            if (success) {
                setChurchAttrs(data[0]) // Get the first (and should be only) attribute set
            }
        }
        if (churchId) {
            loadChurchAttrs()
        }
    }, [churchId, fetchSingleChurchAttr, location.state])

    useEffect(() => {
        if (location.state && location.state.message) {
            toast({
                title: "Success",
                description: location.state.message,
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        }
    }, [location, toast])

    const formatPhoneNumber = (phoneNumber) => {
        // Remove all non-digit characters
        const cleaned = phoneNumber.replace(/\D/g, '');

        // Check if we have a valid 10-digit number
        if (cleaned.length === 10) {
            // Format as (NPA) NXX-XXXX
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }

        // Return original if not a valid 10-digit number
        return phoneNumber;
    };

    const hasAnyAttrs = (attrs) => {
        if (!attrs) return false;
        // Check if any array field has length, or any boolean/number is truthy
        return (
            (attrs.size && attrs.size.length > 0) ||
            (attrs.ageGroup && attrs.ageGroup.length > 0) ||
            (attrs.ethnicity && attrs.ethnicity.length > 0) ||
            (attrs.language && attrs.language.length > 0) ||
            (attrs.denomination && attrs.denomination.length > 0) ||
            (attrs.serviceTime && attrs.serviceTime.length > 0) ||
            !!attrs.serviceNumber ||
            !!attrs.volunteering ||
            !!attrs.participatory
        );
    };

    if (!church) {
        return (
            <Container maxW="container.xl" py={14}>
                <Text>Loading...</Text>
            </Container>
        )
    }

    const handleDelete = async (cid) => {
        const { success, message } = await deleteChurch(cid)
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
                description: message,
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            navigate('/')
        }
    }

    const handleUpdate = async (cid, updatedChurch) => {
        const { success, message } = await updateChurch(cid, updatedChurch)
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
                description: "Church updated successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            const { success: fetchSuccess, data } = await fetchChurch(churchId)
            if (fetchSuccess) {
                setChurch(data)
                setUpdatedChurch(data)
            }
        }
    }

    const handleEditAttrs = () => {
        navigate(`/add-church-attributes/${churchId}`, {
            state: { existingAttrs: churchAttrs }
        })
    }

    const handleDeleteAttr = async (attrId, field) => {
        if (!field) {
            // If no field is specified, delete the entire preferences document
            const { success, message } = await deleteChurchAttr(attrId)
            if (success) {
                setChurchAttrs(null)
                toast({
                    title: "Success",
                    description: "Attributes deleted successfully.",
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
            // Update the attributes document to remove the specific field
            const updatedAttrs = { ...churchAttrs }
            if (Array.isArray(updatedAttrs[field])) {
                updatedAttrs[field] = []
            } else {
                updatedAttrs[field] = null
            }

            const { success, message } = await updateChurchAttr(attrId, updatedAttrs)
            if (success) {
                setChurchAttrs(updatedAttrs)
                toast({
                    title: "Success",
                    description: `${field} attribute removed successfully.`,
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

    const handleClearAllAttrs = async (attrId) => {
        const { success, message } = await deleteChurchAttr(attrId)
        if (success) {
            setChurchAttrs(null)
            toast({
                title: "Success",
                description: "All attributes deleted successfully.",
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

    const handleReviewDelete = async (reviewId) => {
        setSelectedReview(reviews.find(review => review._id === reviewId))
        onReviewDeleteOpen()
    }

    const confirmReviewDelete = async () => {
        const { success, message } = await deleteReview(selectedReview._id)
        if (success) {
            toast({
                title: "Success",
                description: "Review deleted successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            const { success: fetchSuccess, data } = await fetchReviewByChurch(churchId)
            if (fetchSuccess) {
                setReviews(data)
            }
        } else {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
        onReviewDeleteClose()
    }

    const handleSaveChurch = async () => {
        if (!isSaved) {
            const { success, message } = await createSaved({
                userId: currentUser._id,
                churchId: churchId
            })
            if (success) {
                setIsSaved(true)
                toast({
                    title: "Success",
                    description: "Church saved successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: "Error",
                    description: message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        } else {
            const { success, message } = await deleteSaved(savedId)
            if (success) {
                setIsSaved(false)
                setSavedId(null)
                toast({
                    title: "Success",
                    description: "Church removed from saved list.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: "Error",
                    description: message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
    }

    const handleVolunteerOpEdit = (op) => {
        setSelectedVolunteerOp(op)
        setUpdatedVolunteerOp(op)
        onVolunteerOpEditOpen()
    }

    const handleVolunteerOpDelete = (op) => {
        setSelectedVolunteerOp(op)
        onVolunteerOpDeleteOpen()
    }

    const confirmVolunteerOpDelete = async () => {
        const { success, message } = await deleteVolunteerOp(selectedVolunteerOp._id)
        if (success) {
            toast({
                title: "Success",
                description: "Volunteer opportunity deleted successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            const { success: fetchSuccess, data } = await fetchVolunteerOpsByChurch(churchId)
            if (fetchSuccess) {
                setVolunteerOps(data)
            }
        } else {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
        onVolunteerOpDeleteClose()
    }

    const handleVolunteerOpUpdate = async () => {
        const { success, message } = await updateVolunteerOp(selectedVolunteerOp._id, updatedVolunteerOp)
        onVolunteerOpEditClose()

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
                description: "Volunteer opportunity updated successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            const { success: fetchSuccess, data } = await fetchVolunteerOpsByChurch(churchId)
            if (fetchSuccess) {
                setVolunteerOps(data)
            }
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
                >
                    <Image
                        src={church.image}
                        alt={church.name}
                        h={96}
                        w="full"
                        objectFit="cover"
                    />
                    <Box p={8}>
                        <HStack justify="space-between" align="center" mb={4}>
                            <Heading as="h1" size="2xl" color="teal.500">
                                {church.name}
                            </Heading>
                            {currentUser && currentUser.userType === "churchgoer" && (
                                <IconButton
                                    icon={<StarIcon />}
                                    colorScheme={isSaved ? "yellow" : "gray"}
                                    onClick={handleSaveChurch}
                                    aria-label={isSaved ? "Remove from saved" : "Save church"}
                                />
                            )}
                        </HStack>

                        <VStack align="stretch" spacing={4}>
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" color={textColor}>
                                    Location
                                </Text>
                                <Text>
                                    {church.address}, {church.city}, {church.state}
                                </Text>
                            </Box>

                            <Box>
                                <Text fontWeight="bold" fontSize="lg" color={textColor}>
                                    About
                                </Text>
                                {church.description && (
                                    <Text>{church.description}</Text>
                                )}
                            </Box>

                            <Box>
                                <Text fontWeight="bold" fontSize="lg" color={textColor}>
                                    Contact Information
                                </Text>
                                {church.phone && <Text>Phone: {formatPhoneNumber(church.phone)}</Text>}
                                {church.email && <Text>Email: {church.email}</Text>}
                                {church.website && (
                                    <Text>
                                        Website:{' '}
                                        <a
                                            href={church.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#319795' }}
                                        >
                                            {church.website}
                                        </a>
                                    </Text>
                                )}
                            </Box>
                        </VStack>
                    </Box>

                    {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                        <Box p={4}>
                            <HStack spacing={2}>
                                <IconButton icon={<EditIcon />} colorScheme="teal" size="sm" onClick={onUpdateOpen} />
                                <IconButton icon={<DeleteIcon />} colorScheme="red" size="sm" onClick={onDeleteOpen} />
                            </HStack>
                        </Box>
                    )}
                </Box>

                {/* Church Update Modal */}
                <Modal isOpen={isChurchUpdateOpen} onClose={onUpdateClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader textAlign={"center"} paddingTop={50}>Update Church</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4} p={4} bg={bg} rounded={"lg"} shadow={"md"}>
                                <Input
                                    placeholder='Church Name'
                                    name='name'
                                    value={updatedChurch?.name || ''}
                                    onChange={(e) => setUpdatedChurch({ ...updatedChurch, name: e.target.value })}
                                />
                                <Input
                                    placeholder='Church Address'
                                    name='address'
                                    value={updatedChurch?.address || ''}
                                    onChange={(e) => setUpdatedChurch({ ...updatedChurch, address: e.target.value })}
                                />
                                <Input
                                    placeholder='Church City'
                                    name='city'
                                    value={updatedChurch?.city || ''}
                                    onChange={(e) => setUpdatedChurch({ ...updatedChurch, city: e.target.value })}
                                />
                                <Select
                                    placeholder='Select state'
                                    name='state'
                                    value={updatedChurch.state}
                                    onChange={(e) => setUpdatedChurch({ ...updatedChurch, state: e.target.value })}
                                >
                                    {Object.entries(US_STATES).map(([abbr, name]) => (
                                        <option key={abbr} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </Select>
                                <Textarea
                                    placeholder='Church Description'
                                    name='description'
                                    value={updatedChurch?.description || ''}
                                    onChange={(e) => setUpdatedChurch({ ...updatedChurch, description: e.target.value })}
                                />
                                <Input
                                    placeholder='Church Phone'
                                    name='phone'
                                    value={updatedChurch?.phone || ''}
                                    onChange={(e) => setUpdatedChurch({ ...updatedChurch, phone: e.target.value })}
                                />
                                <Input
                                    placeholder='Church Email'
                                    name='email'
                                    value={updatedChurch?.email || ''}
                                    onChange={(e) => setUpdatedChurch({ ...updatedChurch, email: e.target.value })}
                                />
                                <Input
                                    placeholder='Church Website'
                                    name='website'
                                    value={updatedChurch?.website || ''}
                                    onChange={(e) => setUpdatedChurch({ ...updatedChurch, website: e.target.value })}
                                />
                                <Input
                                    placeholder='Church Image URL'
                                    name='image'
                                    value={updatedChurch?.image || ''}
                                    onChange={(e) => setUpdatedChurch({ ...updatedChurch, image: e.target.value })}
                                />
                            </VStack>
                        </ModalBody>

                        <ModalFooter justifyContent={"space-evenly"}>
                            <Button colorScheme="teal" mr={3} onClick={() => handleUpdate(church._id, updatedChurch)}>
                                Update
                            </Button>
                            <Button variant="ghost" onClick={onUpdateClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Church Delete Modal */}
                <Modal isOpen={isChurchDeleteOpen} onClose={onDeleteClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Confirm Deletion</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Are you sure you want to delete {church.name}? This action cannot be undone.
                        </ModalBody>

                        <ModalFooter justifyContent={"space-evenly"}>
                            <Button
                                colorScheme="red"
                                onClick={() => {
                                    handleDelete(church._id);
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

                {/* Church Attribute Section */}
                <Box shadow='lg' rounded='lg' overflow='hidden' bg={bg} p={8}>
                    <HStack justify="space-between" mb={6}>
                        <Heading as="h2" size="xl" color="teal.500">
                            Church Attributes
                        </Heading>
                        {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && churchAttrs && hasAnyAttrs(churchAttrs) && (
                            <HStack>
                                <Button
                                    leftIcon={<EditIcon />}
                                    colorScheme="teal"
                                    size="sm"
                                    onClick={handleEditAttrs}
                                >
                                    Edit Attributes
                                </Button>
                                <Button
                                    leftIcon={<DeleteIcon />}
                                    colorScheme="red"
                                    size="sm"
                                    onClick={() => handleClearAllAttrs(churchAttrs._id)}
                                >
                                    Delete All Attributes
                                </Button>
                            </HStack>
                        )}
                    </HStack>

                    <VStack spacing={4} align="stretch">
                        {churchAttrs && hasAnyAttrs(churchAttrs) ? (
                            <HStack wrap="wrap" spacing={4}>
                                {churchAttrs.size && churchAttrs.size.length > 0 && (
                                    <Badge colorScheme="blue" p={2} borderRadius="md">
                                        Size: {churchAttrs.size.map(size =>
                                            size.charAt(0).toUpperCase() + size.slice(1)
                                        ).join(', ')}
                                        {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeleteAttr(churchAttrs._id, 'size')}
                                                aria-label="Delete size attribute"
                                            />
                                        )}
                                    </Badge>
                                )}
                                {churchAttrs.ageGroup && churchAttrs.ageGroup.length > 0 && (
                                    <Badge colorScheme="green" p={2} borderRadius="md">
                                        Age Group: {churchAttrs.ageGroup.map(group =>
                                            group.split(/(?=[A-Z])/).join(' ')
                                        ).join(', ')}
                                        {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeleteAttr(churchAttrs._id, 'ageGroup')}
                                                aria-label="Delete age group attribute"
                                            />
                                        )}
                                    </Badge>
                                )}
                                {churchAttrs.ethnicity && churchAttrs.ethnicity.length > 0 && (
                                    <Badge colorScheme="purple" p={2} borderRadius="md">
                                        Ethnicity: {churchAttrs.ethnicity.map(ethnicity =>
                                            ethnicity.split(/(?=[A-Z])/).join(' ')
                                        ).join(', ')}
                                        {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeleteAttr(churchAttrs._id, 'ethnicity')}
                                                aria-label="Delete ethnicity attribute"
                                            />
                                        )}
                                    </Badge>
                                )}
                                {churchAttrs.language && churchAttrs.language.length > 0 && (
                                    <Badge colorScheme="orange" p={2} borderRadius="md">
                                        Language: {churchAttrs.language.map(lang =>
                                            lang.charAt(0).toUpperCase() + lang.slice(1)
                                        ).join(', ')}
                                        {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeleteAttr(churchAttrs._id, 'language')}
                                                aria-label="Delete language attribute"
                                            />
                                        )}
                                    </Badge>
                                )}
                                {churchAttrs.denomination && churchAttrs.denomination.length > 0 && (
                                    <Badge colorScheme="teal" p={2} borderRadius="md">
                                        Denomination: {churchAttrs.denomination.map(denom =>
                                            denom.split('-').map(word =>
                                                word.charAt(0).toUpperCase() + word.slice(1)
                                            ).join(' ')
                                        ).join(', ')}
                                        {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeleteAttr(churchAttrs._id, 'denomination')}
                                                aria-label="Delete denomination attribute"
                                            />
                                        )}
                                    </Badge>
                                )}
                                {churchAttrs.serviceTime && churchAttrs.serviceTime.length > 0 && (
                                    <Badge colorScheme="cyan" p={2} borderRadius="md">
                                        Service Time: {churchAttrs.serviceTime.map(time =>
                                            time.charAt(0).toUpperCase() + time.slice(1)
                                        ).join(', ')}
                                        {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeleteAttr(churchAttrs._id, 'serviceTime')}
                                                aria-label="Delete serviceTime attribute"
                                            />
                                        )}
                                    </Badge>
                                )}
                                {churchAttrs.serviceNumber && (
                                    <Badge colorScheme="pink" p={2} borderRadius="md">
                                        Services per Week: {churchAttrs.serviceNumber}
                                        {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeleteAttr(churchAttrs._id, 'serviceNumber')}
                                                aria-label="Delete serviceNumber attribute"
                                            />
                                        )}
                                    </Badge>
                                )}
                                {churchAttrs.volunteering && (
                                    <Badge colorScheme="yellow" p={2} borderRadius="md">
                                        Offers Volunteering
                                        {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeleteAttr(churchAttrs._id, 'volunteering')}
                                                aria-label="Delete volunteering attribute"
                                            />
                                        )}
                                    </Badge>
                                )}
                                {churchAttrs.participatory && (
                                    <Badge colorScheme="red" p={2} borderRadius="md">
                                        Participatory Worship
                                        {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                ml={2}
                                                onClick={() => handleDeleteAttr(churchAttrs._id, 'participatory')}
                                                aria-label="Delete participatory attribute"
                                            />
                                        )}
                                    </Badge>
                                )}
                            </HStack>
                        ) : (
                            <>
                                <Text textAlign="center">No attributes have been set for this church.</Text>
                                {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                                    <Box display="flex" justifyContent="center" mt={4}>
                                        <Button
                                            onClick={() => navigate(`/add-church-attributes/${churchId}`)}
                                            textAlign="center"
                                            size="sm"
                                            colorScheme="purple"
                                        >
                                            Set Church Attributes
                                        </Button>
                                    </Box>
                                )}
                            </>
                        )}
                    </VStack>
                </Box>

                {/* Volunteer Opportunity Section */}
                <Box shadow='lg' rounded='lg' overflow='hidden' bg={bg} p={8}>
                    <HStack justify="space-between" mb={6}>
                        <Heading as="h2" size="xl" color="teal.500">
                            {church.name}'s Volunteer Opportunities
                        </Heading>
                        {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                            <Button
                                leftIcon={<AddIcon />}
                                colorScheme="teal"
                                padding={5}
                                onClick={() => navigate(`/volunteering-new?churchId=${churchId}`)}
                            >
                                Create a New Volunteer Opportunity
                            </Button>
                        )}
                    </HStack>

                    <VStack spacing={4} align="stretch">
                        {volunteerOps.length === 0 ? (
                            <Text>No volunteer opportunities available at this time.</Text>
                        ) : (
                            volunteerOps.map((op) => (
                                <Box
                                    key={op._id}
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    bg={cardBg}
                                >
                                    <VStack align="stretch" spacing={2}>
                                        <HStack justify="space-between">
                                            <Heading size="md">{op.title}</Heading>
                                            <HStack>
                                                {op.isActive ? (
                                                    <Text color="green.500" fontWeight="bold">Active</Text>
                                                ) : (
                                                    <Text color="red.500" fontWeight="bold">Inactive</Text>
                                                )}
                                                {currentUser && currentUser.userType === "churchRep" && currentUser._id === church.userId && (
                                                    <HStack spacing={2}>
                                                        <IconButton
                                                            icon={<EditIcon />}
                                                            colorScheme="teal"
                                                            size="sm"
                                                            onClick={() => handleVolunteerOpEdit(op)}
                                                        />
                                                        <IconButton
                                                            icon={<DeleteIcon />}
                                                            colorScheme="red"
                                                            size="sm"
                                                            onClick={() => handleVolunteerOpDelete(op)}
                                                        />
                                                    </HStack>
                                                )}
                                            </HStack>
                                        </HStack>
                                        <Text>{op.description}</Text>
                                        {op.isMember && (
                                            <Text color="blue.500" fontWeight="bold">
                                                Church Membership Required
                                            </Text>
                                        )}
                                    </VStack>
                                </Box>
                            ))
                        )}
                    </VStack>
                </Box>

                {/* Volunteer Opportunity Edit Modal */}
                <Modal isOpen={isVolunteerOpEditOpen} onClose={onVolunteerOpEditClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Edit Volunteer Opportunity</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4} p={4} bg={bg} rounded={"lg"} shadow={"md"}>
                                <Input
                                    placeholder='Title'
                                    name='title'
                                    value={updatedVolunteerOp?.title || ''}
                                    onChange={(e) => setUpdatedVolunteerOp({ ...updatedVolunteerOp, title: e.target.value })}
                                />
                                <Textarea
                                    placeholder='Description'
                                    name='description'
                                    value={updatedVolunteerOp?.description || ''}
                                    onChange={(e) => setUpdatedVolunteerOp({ ...updatedVolunteerOp, description: e.target.value })}
                                />
                                <Checkbox
                                    isChecked={updatedVolunteerOp?.isActive}
                                    onChange={(e) => setUpdatedVolunteerOp({ ...updatedVolunteerOp, isActive: e.target.checked })}
                                >
                                    Is Active
                                </Checkbox>
                                <Checkbox
                                    isChecked={updatedVolunteerOp?.isMember}
                                    onChange={(e) => setUpdatedVolunteerOp({ ...updatedVolunteerOp, isMember: e.target.checked })}
                                >
                                    Requires Church Membership
                                </Checkbox>
                            </VStack>
                        </ModalBody>

                        <ModalFooter justifyContent={"space-evenly"}>
                            <Button colorScheme="teal" mr={3} onClick={handleVolunteerOpUpdate}>
                                Update
                            </Button>
                            <Button variant="ghost" onClick={onVolunteerOpEditClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Volunteer Opportunity Delete Modal */}
                <Modal isOpen={isVolunteerOpDeleteOpen} onClose={onVolunteerOpDeleteClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Confirm Deletion</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Are you sure you want to delete this volunteer opportunity? This action cannot be undone.
                        </ModalBody>

                        <ModalFooter justifyContent={"space-evenly"}>
                            <Button
                                colorScheme="red"
                                onClick={confirmVolunteerOpDelete}
                            >
                                Delete
                            </Button>
                            <Button variant="ghost" onClick={onVolunteerOpDeleteClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Reviews Section */}
                <Box shadow="lg" rounded="lg" overflow="hidden" bg={bg} p={8}>
                    <HStack justify="space-between" mb={6}>
                        <Heading as="h2" size="xl" color="teal.500">
                            Reviews
                        </Heading>
                        {currentUser && currentUser.userType === "churchgoer" && (
                            <Button
                                leftIcon={<AddIcon />}
                                colorScheme="teal"
                                onClick={() => navigate(`/review-new?churchId=${churchId}`, { state: { from: 'church' } })}
                            >
                                Write a Review
                            </Button>
                        )}
                    </HStack>

                    <VStack spacing={4} align="stretch">
                        {reviews.length === 0 ? (
                            <Text>No reviews yet. Be the first to write a review!</Text>
                        ) : (
                            reviews.map((review) => {
                                return (
                                    <Box key={review._id}>
                                        <ReviewCard
                                            review={review}
                                            onEdit={
                                                currentUser &&
                                                    currentUser.userType === "churchgoer" &&
                                                    currentUser._id === review.userId._id
                                                    ? () => navigate(`/review-edit/${review._id}?churchId=${churchId}`, { state: { from: 'church' } })
                                                    : null
                                            }
                                            onDelete={
                                                currentUser &&
                                                    currentUser.userType === "churchgoer" &&
                                                    currentUser._id === review.userId._id
                                                    ? () => handleReviewDelete(review._id)
                                                    : null
                                            }
                                        />
                                    </Box>
                                )
                            })
                        )}
                    </VStack>
                </Box>

                {/* Review Delete Modal */}
                <Modal isOpen={isReviewDeleteOpen} onClose={onReviewDeleteClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Confirm Deletion</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Are you sure you want to delete this review? This action cannot be undone.
                        </ModalBody>

                        <ModalFooter justifyContent={"space-evenly"}>
                            <Button
                                colorScheme="red"
                                onClick={confirmReviewDelete}
                            >
                                Delete
                            </Button>
                            <Button variant="ghost" onClick={onReviewDeleteClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </VStack>
        </Container>
    )
}

export default ChurchInfo
