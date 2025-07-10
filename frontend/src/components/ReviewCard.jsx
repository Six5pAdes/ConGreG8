import React from 'react'
import {
    Box,
    Text,
    HStack,
    VStack,
    Avatar,
    IconButton,
    useColorModeValue
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'

const ReviewCard = ({ review, onEdit, onDelete, showChurchInfo = false }) => {
    const bgColor = useColorModeValue('white', 'gray.700')
    const borderColor = useColorModeValue('gray.200', 'gray.600')
    const textColor = useColorModeValue('gray.700', 'gray.200')

    if (!review) return null

    return (
        <Box
            p={4}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            _hover={{ shadow: 'md' }}
            transition="all 0.2s"
        >
            <VStack align="start" spacing={3}>
                <HStack spacing={4} width="100%" justify="space-between">
                    <HStack spacing={4}>
                        <Avatar size="sm" name={review.userId?.firstName + ' ' + review.userId?.lastName} />
                        <VStack align="start" spacing={0}>
                            <Text fontWeight="bold">
                                {review.userId?.firstName} {review.userId?.lastName}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </Text>
                        </VStack>
                    </HStack>
                    {(onEdit || onDelete) && (
                        <HStack spacing={2}>
                            {onEdit && (
                                <IconButton
                                    icon={<EditIcon />}
                                    size="sm"
                                    colorScheme="teal"
                                    variant="ghost"
                                    onClick={onEdit}
                                    aria-label="Edit review"
                                />
                            )}
                            {onDelete && (
                                <IconButton
                                    icon={<DeleteIcon />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={onDelete}
                                    aria-label="Delete review"
                                />
                            )}
                        </HStack>
                    )}
                </HStack>

                <HStack spacing={1}>
                    {[...Array(5)].map((_, index) => (
                        <Text key={index} color={index < review.rating ? 'yellow.400' : 'gray.300'}>
                            ★
                        </Text>
                    ))}
                </HStack>

                {showChurchInfo && review.churchId && (
                    <Box>
                        <Text fontSize="sm" fontWeight="semibold" color="teal.500">
                            {review.churchId.name}
                        </Text>
                        {review.churchId.address && (
                            <Text fontSize="xs" color="gray.500">
                                {review.churchId.address}
                            </Text>
                        )}
                    </Box>
                )}

                {review.reviewText && (
                    <Text fontSize="md" color={textColor}>
                        {review.reviewText}
                    </Text>
                )}
            </VStack>
        </Box>
    )
}

export default ReviewCard
