import React, { useEffect, useState } from 'react'
import {
    Box,
    Container,
    Heading,
    VStack,
    Text,
    useColorModeValue,
    useToast,
    Button,
    HStack,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { useReviewStore } from '../store/review'
import { useUserStore } from '../store/user'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import ReviewCard from '../components/ReviewCard'

const UserReviews = () => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const toast = useToast()
    const { currentUser } = useUserStore()
    const { fetchReviewByUser, deleteReview } = useReviewStore()
    const [reviews, setReviews] = useState([])
    const [selectedReview, setSelectedReview] = useState(null)
    const bg = useColorModeValue("white", "gray.800")
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    useEffect(() => {
        const loadReviews = async () => {
            const { success, data } = await fetchReviewByUser(userId)
            if (success) {
                setReviews(data)
            }
        }
        loadReviews()
    }, [userId, fetchReviewByUser])

    const handleReviewDelete = async (reviewId) => {
        setSelectedReview(reviews.find(review => review._id === reviewId))
        onDeleteOpen()
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
            setReviews(reviews.filter(review => review._id !== selectedReview._id))
        } else {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
        onDeleteClose()
    }

    if (!reviews) {
        return (
            <Container maxW="container.xl" py={14}>
                <Text>Loading...</Text>
            </Container>
        )
    }

    return (
        <Container maxW="container.xl" py={14}>
            <VStack spacing={8} align="stretch">
                <Box shadow="lg" rounded="lg" overflow="hidden" bg={bg} p={8}>
                    <Heading as="h1" size="xl" mb={6} color="teal.500">
                        My Reviews
                    </Heading>

                    {reviews.length === 0 ? (
                        <Text fontSize="lg" color="gray.500">
                            You haven't written any reviews yet.
                        </Text>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            {reviews.map((review) => (
                                <Box key={review._id}>
                                    <ReviewCard
                                        review={review}
                                        onEdit={
                                            currentUser && currentUser._id === review.userId._id
                                                ? () => navigate(`/review-edit/${review._id}?churchId=${review.churchId}`)
                                                : null
                                        }
                                        onDelete={
                                            currentUser && currentUser._id === review.userId._id
                                                ? () => handleReviewDelete(review._id)
                                                : null
                                        }
                                    />
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>

                {/* Review Delete Modal */}
                <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Confirm Deletion</ModalHeader>
                        <ModalBody>
                            Are you sure you want to delete this review? This action cannot be undone.
                        </ModalBody>
                        <ModalFooter>
                            <HStack spacing={4}>
                                <Button variant="ghost" onClick={onDeleteClose}>
                                    Cancel
                                </Button>
                                <Button colorScheme="red" onClick={confirmReviewDelete}>
                                    Delete
                                </Button>
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </VStack>
        </Container>
    )
}

export default UserReviews
