import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Checkbox,
    VStack,
    Heading,
    useToast,
    Spinner
} from '@chakra-ui/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVolunteerOpStore } from '../store/volunteer'

const VolunteerForm = () => {
    const [searchParams] = useSearchParams()
    const churchId = searchParams.get('churchId')
    const navigate = useNavigate()
    const toast = useToast()
    const { createVolunteerOp, isLoading } = useVolunteerOpStore()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isActive: false,
        isMember: false,
        churchId: ''
    })

    useEffect(() => {
        if (!churchId) {
            toast({
                title: 'Error',
                description: 'Church ID is missing',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            navigate(-1)
            return
        }
        setFormData(prev => ({ ...prev, churchId }))
    }, [churchId, navigate, toast])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title || !formData.description) {
            toast({
                title: 'Error',
                description: 'Please fill in all required fields',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            return
        }

        if (!formData.churchId) {
            toast({
                title: 'Error',
                description: 'Church ID is required',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            return
        }

        try {
            const result = await createVolunteerOp(formData)

            if (result.success) {
                toast({
                    title: 'Success',
                    description: 'Volunteer opportunity created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                navigate(`/churches/${churchId}`)
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            toast({
                title: 'Error',
                description: error.message || 'Failed to create volunteer opportunity',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    if (!churchId) {
        return (
            <Box maxW="md" mx="auto" p={6} textAlign="center">
                <Spinner size="xl" />
            </Box>
        )
    }

    return (
        <Box maxW="md" mx="auto" p={6} bg="white" borderRadius="lg" boxShadow="md">
            <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                    <Heading size="lg">Create Volunteer Opportunity</Heading>

                    <FormControl isRequired>
                        <FormLabel>Title</FormLabel>
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter title"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tell us what the volunteer is going to do in this opportunity..."
                            rows={4}
                        />
                    </FormControl>

                    <FormControl>
                        <Checkbox
                            name="isActive"
                            isChecked={formData.isActive}
                            onChange={handleChange}
                        >
                            Is the opportunity still active?
                        </Checkbox>
                    </FormControl>

                    <FormControl>
                        <Checkbox
                            name="isMember"
                            isChecked={formData.isMember}
                            onChange={handleChange}
                        >
                            Does the volunteer need to be a member?
                        </Checkbox>
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        width="full"
                        isLoading={isLoading}
                        loadingText="Creating..."
                    >
                        Create Opportunity
                    </Button>
                    <Button
                        colorScheme='red'
                        onClick={() => navigate(-1)}
                        w={'full'}
                        isDisabled={isLoading}
                    >
                        Cancel
                    </Button>
                </VStack>
            </form>
        </Box>
    )
}

export default VolunteerForm
