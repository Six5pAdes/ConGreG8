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
    useToast,
    Textarea,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useChurchStore } from '../store/church'
import { useUserStore } from "../store/user"
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons"
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../pages/ReviewForm'
import { useReviewStore } from '../store/review'

const ChurchInfo = () => {
    const { churchId } = useParams()
    const { currentUser } = useUserStore()
    const { fetchChurch, deleteChurch, updateChurch } = useChurchStore()
    const { fetchReviewByChurch, createReview, updateReview, deleteReview } = useReviewStore()
    const [church, setChurch] = useState(null)
    const [updatedChurch, setUpdatedChurch] = useState(null)
    const [reviews, setReviews] = useState([])
    const [selectedReview, setSelectedReview] = useState(null)
    const bg = useColorModeValue("white", "gray.800")
    const textColor = useColorModeValue("gray.800", "whiteAlpha.900")
    const toast = useToast()
    const navigate = useNavigate()

    const { isOpen: isChurchUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure()
    const { isOpen: isChurchDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const { isOpen: isReviewDeleteOpen, onOpen: onReviewDeleteOpen, onClose: onReviewDeleteClose } = useDisclosure()

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
                description: "Church updated successfully",
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

    const handleReviewUpdate = async (reviewId, reviewData) => {
        const { success, message } = await updateReview(reviewId, reviewData)
        if (success) {
            toast({
                title: "Success",
                description: "Review updated successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            onReviewFormClose()
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
                description: "Review deleted successfully",
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
                        <Heading as="h1" size="2xl" mb={4} color="teal.500">
                            {church.name}
                        </Heading>

                        <VStack align="stretch" spacing={4}>
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" color={textColor}>
                                    Location
                                </Text>
                                <Text>
                                    {church.address}, {church.city}, {church.state}
                                </Text>
                            </Box>

                            {church.description && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg" color={textColor}>
                                        About
                                    </Text>
                                    <Text>{church.description}</Text>
                                </Box>
                            )}

                            <Box>
                                <Text fontWeight="bold" fontSize="lg" color={textColor}>
                                    Contact Information
                                </Text>
                                {church.phone && <Text>Phone: {church.phone}</Text>}
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

                    {currentUser && currentUser.userType === "churchRep" && (
                        <Box p={4}>
                            <HStack spacing={2}>
                                <IconButton icon={<EditIcon />} colorScheme="teal" size="sm" onClick={onUpdateOpen} />
                                <IconButton icon={<DeleteIcon />} colorScheme="red" size="sm" onClick={onDeleteOpen} />
                            </HStack>
                        </Box>
                    )}
                </Box>

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
                                onClick={() => navigate(`/review-new?churchId=${churchId}`)}
                            >
                                Write a Review
                            </Button>
                        )}
                    </HStack>

                    <VStack spacing={4} align="stretch">
                        {reviews.map((review) => {
                            console.log('Review:', review)
                            console.log('Current User:', currentUser)
                            console.log('User ID Match:', currentUser?._id === review.userId)
                            return (
                                <Box key={review._id}>
                                    <ReviewCard
                                        review={review}
                                        onEdit={
                                            currentUser &&
                                                currentUser.userType === "churchgoer" &&
                                                currentUser._id === review.userId
                                                ? () => navigate(`/review-edit/${review._id}?churchId=${churchId}`)
                                                : null
                                        }
                                        onDelete={
                                            currentUser &&
                                                currentUser.userType === "churchgoer" &&
                                                currentUser._id === review.userId
                                                ? () => handleReviewDelete(review._id)
                                                : null
                                        }
                                    />
                                </Box>
                            )
                        })}
                    </VStack>
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
                                <Input
                                    placeholder='Church State'
                                    name='state'
                                    value={updatedChurch?.state || ''}
                                    onChange={(e) => setUpdatedChurch({ ...updatedChurch, state: e.target.value })}
                                />
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
