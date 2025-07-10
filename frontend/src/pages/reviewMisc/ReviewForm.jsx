import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Text,
    Textarea,
    VStack,
    useToast,
    useColorModeValue
} from '@chakra-ui/react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useReviewStore } from '../../store/review'
import { useChurchStore } from '../../store/church'
import { useUserStore } from '../../store/user'

const ReviewForm = () => {
    const { reviewId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const toast = useToast()
    const { createReview, updateReview, fetchReview } = useReviewStore()
    const { fetchChurch } = useChurchStore()
    const { currentUser } = useUserStore()
    const [church, setChurch] = useState(null)
    const [rating, setRating] = useState(0)
    const [reviewText, setReviewText] = useState('')
    const bg = useColorModeValue("white", "gray.800")
    const isEditing = Boolean(reviewId)

    // Get churchId from URL search params
    const searchParams = new URLSearchParams(location.search)
    const churchId = searchParams.get('churchId')

    useEffect(() => {
        const loadData = async () => {
            if (!churchId) {
                toast({
                    title: "Error",
                    description: "No church selected.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
                navigate('/')
                return
            }

            const { success: churchSuccess, data: churchData } = await fetchChurch(churchId)
            if (churchSuccess) {
                setChurch(churchData)
            }

            if (isEditing) {
                const { success: reviewSuccess, data: reviewData } = await fetchReview(reviewId)
                if (reviewSuccess) {
                    setRating(reviewData.rating)
                    setReviewText(reviewData.reviewText)
                }
            }
        }
        loadData()
    }, [churchId, reviewId, fetchChurch, fetchReview, isEditing, navigate, toast])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (rating === 0) {
            toast({
                title: "Error",
                description: "Please select a rating.",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        const reviewData = {
            rating,
            reviewText,
            ...(isEditing ? {} : { userId: currentUser._id, churchId })
        }

        const { success, message } = isEditing
            ? await updateReview(reviewId, reviewData)
            : await createReview(reviewData)

        if (success) {
            toast({
                title: "Success",
                description: isEditing ? "Review updated successfully." : "Review submitted successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            navigate(`/churches/${churchId}`)
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

    const handleCancel = () => {
        const fromPage = location.state?.from;
        if (fromPage === 'userReview') {
            navigate(`/profile/${currentUser._id}/reviews`);
        } else {
            navigate(`/churches/${churchId}`);
        }
    }

    if (!church) {
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
                        {isEditing ? 'Edit Review' : 'Write a Review'} for {church.name}
                    </Heading>

                    <Box as="form" onSubmit={handleSubmit}>
                        <VStack spacing={6}>
                            <FormControl isRequired>
                                <FormLabel fontSize="lg">Rating</FormLabel>
                                <HStack spacing={1}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Text
                                            key={star}
                                            cursor="pointer"
                                            fontSize="3xl"
                                            color={star <= rating ? 'yellow.400' : 'gray.300'}
                                            onClick={() => setRating(star)}
                                            _hover={{ transform: 'scale(1.1)' }}
                                            transition="all 0.2s"
                                        >
                                            ★
                                        </Text>
                                    ))}
                                </HStack>
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="lg">Review</FormLabel>
                                <Textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Share your experience with this church..."
                                    size="lg"
                                    rows={6}
                                />
                            </FormControl>

                            <HStack spacing={4} width="100%" justifyContent="flex-end">
                                <Button
                                    variant="ghost"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    colorScheme="teal"
                                    size="lg"
                                    px={8}
                                >
                                    {isEditing ? 'Update Review' : 'Submit Review'}
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                </Box>
            </VStack>
        </Container>
    )
}

export default ReviewForm
