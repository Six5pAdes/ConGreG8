import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Select,
    VStack,
    Text,
    useToast,
    Checkbox,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import { useUserPrefStore } from '../store/userPref'

const AddUserPrefs = () => {
    const navigate = useNavigate()
    const toast = useToast()
    const { createUserPref } = useUserPrefStore()

    const [preferences, setPreferences] = useState({
        size: '',
        ageGroup: '',
        ethnicity: '',
        language: '',
        denomination: '',
        volunteering: false,
        serviceNumber: 1,
        serviceTime: '',
        participatory: false
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setPreferences(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleNumberChange = (value, name) => {
        setPreferences(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { success, message } = await createUserPref(preferences)
        if (success) {
            toast({
                title: "Success",
                description: "Preferences saved successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            })
            navigate('/')
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

    const handleSkip = () => {
        navigate('/')
    }

    return (
        <Container maxW="container.md" py={10}>
            <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                    <Heading as="h1" size="xl" mb={4}>Tell Us About Your Church Preferences</Heading>
                    <Text color="gray.600">Help us find the perfect church for you. You can skip this step for now.</Text>
                </Box>

                <Box as="form" onSubmit={handleSubmit}>
                    <VStack spacing={6}>
                        <FormControl>
                            <FormLabel>Preferred Church Size</FormLabel>
                            <Select name="size" value={preferences.size} onChange={handleChange}>
                                <option value="">Select size</option>
                                <option value="small">Small (25-200 members)</option>
                                <option value="midsize">Midsize (200-400 members)</option>
                                <option value="big">Big (400-2000 members)</option>
                                <option value="megachurch">Megachurch (2000+ members)</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Age Group</FormLabel>
                            <Select name="ageGroup" value={preferences.ageGroup} onChange={handleChange}>
                                <option value="">Select age group</option>
                                <option value="family">Family-oriented</option>
                                <option value="youngAdult">Young Adult</option>
                                <option value="adult">Adult</option>
                                <option value="senior">Senior</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Ethnicity</FormLabel>
                            <Select name="ethnicity" value={preferences.ethnicity} onChange={handleChange}>
                                <option value="">Select ethnicity</option>
                                <option value="africanAmerican">African American</option>
                                <option value="asian">Asian</option>
                                <option value="caucasian">Caucasian</option>
                                <option value="hispanic">Hispanic</option>
                                <option value="pacificIslander">Pacific Islander</option>
                                <option value="other">Other</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Language</FormLabel>
                            <Select name="language" value={preferences.language} onChange={handleChange}>
                                <option value="">Select language</option>
                                <option value="english">English</option>
                                <option value="spanish">Spanish</option>
                                <option value="french">French</option>
                                <option value="german">German</option>
                                <option value="mandarin">Mandarin</option>
                                <option value="korean">Korean</option>
                                <option value="other">Other</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Denomination</FormLabel>
                            <Select name="denomination" value={preferences.denomination} onChange={handleChange}>
                                <option value="">Select denomination</option>
                                <option value="baptist">Baptist</option>
                                <option value="catholic">Catholic</option>
                                <option value="evangelical">Evangelical</option>
                                <option value="lutheran">Lutheran</option>
                                <option value="methodist">Methodist</option>
                                <option value="orthodox">Orthodox</option>
                                <option value="pentecostal">Pentecostal</option>
                                <option value="presbyterian">Presbyterian</option>
                                <option value="non-denominational">Non-denominational</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Service Time</FormLabel>
                            <Select name="serviceTime" value={preferences.serviceTime} onChange={handleChange}>
                                <option value="">Select service time</option>
                                <option value="morning">Morning</option>
                                <option value="afternoon">Afternoon</option>
                                <option value="evening">Evening</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Number of Services per Week</FormLabel>
                            <NumberInput
                                min={1}
                                max={7}
                                value={preferences.serviceNumber}
                                onChange={(value) => handleNumberChange(value, 'serviceNumber')}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>

                        <FormControl>
                            <Checkbox
                                name="volunteering"
                                isChecked={preferences.volunteering}
                                onChange={handleChange}
                            >
                                Interested in volunteering opportunities
                            </Checkbox>
                        </FormControl>

                        <FormControl>
                            <Checkbox
                                name="participatory"
                                isChecked={preferences.participatory}
                                onChange={handleChange}
                            >
                                Prefer participatory worship style
                            </Checkbox>
                        </FormControl>

                        <Box w="full" display="flex" justifyContent="space-between" pt={4}>
                            <Button
                                colorScheme="gray"
                                onClick={handleSkip}
                            >
                                Skip for Now
                            </Button>
                            <Button
                                type="submit"
                                colorScheme="teal"
                            >
                                Save Preferences
                            </Button>
                        </Box>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    )
}

export default AddUserPrefs
