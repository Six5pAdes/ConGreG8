import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
    CheckboxGroup,
    Stack,
} from '@chakra-ui/react'
import { useUserPrefStore } from '../store/userPref'
import { useUserStore } from '../store/user'

const AddUserPrefs = () => {
    const { currentUser } = useUserStore()
    const { createUserPref, updateUserPref } = useUserPrefStore()
    const navigate = useNavigate()
    const toast = useToast()
    const location = useLocation()
    const existingPrefs = location.state?.existingPrefs

    const [preferences, setPreferences] = useState({
        size: existingPrefs?.size?.[0] || '',
        ageGroups: existingPrefs?.ageGroup || [],
        ethnicities: existingPrefs?.ethnicity || [],
        languages: existingPrefs?.language || [],
        denominations: existingPrefs?.denomination || [],
        serviceTime: existingPrefs?.serviceTime?.[0] || '',
        volunteering: existingPrefs?.volunteering || false,
        serviceNumber: existingPrefs?.serviceNumber || 1,
        participatory: existingPrefs?.participatory || false
    })

    useEffect(() => {
        if (existingPrefs) {
            setPreferences({
                size: existingPrefs.size?.[0] || '',
                ageGroups: existingPrefs.ageGroup || [],
                ethnicities: existingPrefs.ethnicity || [],
                languages: existingPrefs.language || [],
                denominations: existingPrefs.denomination || [],
                volunteering: existingPrefs.volunteering || false,
                serviceNumber: existingPrefs.serviceNumber || 1,
                serviceTime: existingPrefs.serviceTime?.[0] || '',
                participatory: existingPrefs.participatory || false
            })
        }
    }, [existingPrefs])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setPreferences(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleMultiSelectChange = (name, values) => {
        setPreferences(prev => ({
            ...prev,
            [name]: values
        }))
    }

    const handleServiceNumberChange = (valueString) => {
        const value = parseInt(valueString)
        setPreferences(prev => ({
            ...prev,
            serviceNumber: isNaN(value) ? 1 : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Format the preferences properly
        const formattedPrefs = {
            userId: existingPrefs?.userId || currentUser?._id,
            size: preferences.size ? [preferences.size] : [],
            ageGroup: preferences.ageGroups || [],
            ethnicity: preferences.ethnicities || [],
            language: preferences.languages || [],
            denomination: preferences.denominations || [],
            serviceTime: preferences.serviceTime ? [preferences.serviceTime] : [],
            volunteering: preferences.volunteering || false,
            serviceNumber: preferences.serviceNumber || 1,
            participatory: preferences.participatory || false
        }

        try {
            if (existingPrefs) {
                const { success, message } = await updateUserPref(existingPrefs._id, formattedPrefs)
                if (success) {
                    toast({
                        title: "Success",
                        description: "Preferences updated successfully.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    })
                    navigate('/profile/' + existingPrefs.userId)
                } else {
                    console.error("Update failed:", message)
                    toast({
                        title: "Error",
                        description: message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    })
                }
            } else {
                const { success, message } = await createUserPref(formattedPrefs)
                if (success) {
                    toast({
                        title: "Success",
                        description: "Preferences saved successfully.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    })
                    navigate('/')
                } else {
                    console.error("Create failed:", message)
                    toast({
                        title: "Error",
                        description: message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    })
                }
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error)
            toast({
                title: "Error",
                description: "An error occurred while saving preferences.",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
    }

    const handleSkip = () => {
        navigate('/')
    }

    // Add logging for preference changes
    const handlePreferenceChange = (name, value) => {
        setPreferences(prev => {
            const newPrefs = {
                ...prev,
                [name]: value
            }
            return newPrefs
        })
    }

    return (
        <Container maxW="container.md" py={10}>
            <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                    <Heading as="h1" size="xl" mb={4}>
                        {existingPrefs ? 'Edit Your Church Preferences' : 'Tell Us About Your Church Preferences'}
                    </Heading>
                    <Text color="gray.600">
                        {existingPrefs
                            ? 'Update your preferences to better help us find the perfect church for you.'
                            : 'Tell us about what you are looking for in a church. You can also skip this step for now and tell us later.'}
                    </Text>
                </Box>

                <Box as="form" onSubmit={handleSubmit}>
                    <VStack spacing={6}>
                        <FormControl>
                            <FormLabel>Preferred Church Size</FormLabel>
                            <Select name="size" value={preferences.size} onChange={(e) => handlePreferenceChange('size', e.target.value)}>
                                <option value="" disabled>Select size</option>
                                <option value="small">Small (25-200 members)</option>
                                <option value="midsize">Midsize (200-400 members)</option>
                                <option value="big">Big (400-2000 members)</option>
                                <option value="megachurch">Megachurch (2000+ members)</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Age Groups</FormLabel>
                            <CheckboxGroup value={preferences.ageGroups} onChange={(values) => handleMultiSelectChange('ageGroups', values)}>
                                <Stack spacing={2}>
                                    <Checkbox value="family">Family-oriented</Checkbox>
                                    <Checkbox value="youngAdult">Young Adult</Checkbox>
                                    <Checkbox value="adult">Adult</Checkbox>
                                    <Checkbox value="senior">Senior</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Ethnicities</FormLabel>
                            <CheckboxGroup value={preferences.ethnicities} onChange={(values) => handleMultiSelectChange('ethnicities', values)}>
                                <Stack spacing={2}>
                                    <Checkbox value="africanAmerican">African American</Checkbox>
                                    <Checkbox value="asian">Asian</Checkbox>
                                    <Checkbox value="caucasian">Caucasian</Checkbox>
                                    <Checkbox value="hispanic">Hispanic</Checkbox>
                                    <Checkbox value="pacificIslander">Pacific Islander</Checkbox>
                                    <Checkbox value="other">Other</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Languages</FormLabel>
                            <CheckboxGroup value={preferences.languages} onChange={(values) => handleMultiSelectChange('languages', values)}>
                                <Stack spacing={2}>
                                    <Checkbox value="english">English</Checkbox>
                                    <Checkbox value="spanish">Spanish</Checkbox>
                                    <Checkbox value="french">French</Checkbox>
                                    <Checkbox value="german">German</Checkbox>
                                    <Checkbox value="mandarin">Mandarin</Checkbox>
                                    <Checkbox value="korean">Korean</Checkbox>
                                    <Checkbox value="other">Other</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Denominations</FormLabel>
                            <CheckboxGroup value={preferences.denominations} onChange={(values) => handleMultiSelectChange('denominations', values)}>
                                <Stack spacing={2}>
                                    <Checkbox value="baptist">Baptist</Checkbox>
                                    <Checkbox value="catholic">Catholic</Checkbox>
                                    <Checkbox value="evangelical">Evangelical</Checkbox>
                                    <Checkbox value="lutheran">Lutheran</Checkbox>
                                    <Checkbox value="methodist">Methodist</Checkbox>
                                    <Checkbox value="orthodox">Orthodox</Checkbox>
                                    <Checkbox value="pentecostal">Pentecostal</Checkbox>
                                    <Checkbox value="presbyterian">Presbyterian</Checkbox>
                                    <Checkbox value="non-denominational">Non-denominational</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Service Time</FormLabel>
                            <Select name="serviceTime" value={preferences.serviceTime} onChange={(e) => handlePreferenceChange('serviceTime', e.target.value)}>
                                <option value="" disabled>Select service time</option>
                                <option value="morning">Morning</option>
                                <option value="afternoon">Afternoon</option>
                                <option value="evening">Evening</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>How many services do you attend per week?</FormLabel>
                            <NumberInput
                                min={1}
                                max={7}
                                value={preferences.serviceNumber}
                                onChange={(valueString) => handlePreferenceChange('serviceNumber', parseInt(valueString) || 1)}
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
                                onChange={(e) => handlePreferenceChange('volunteering', e.target.checked)}
                            >
                                Interested in volunteering opportunities
                            </Checkbox>
                        </FormControl>

                        <FormControl>
                            <Checkbox
                                name="participatory"
                                isChecked={preferences.participatory}
                                onChange={(e) => handlePreferenceChange('participatory', e.target.checked)}
                            >
                                Prefer participatory worship style
                            </Checkbox>
                        </FormControl>

                        <Box w="full" display="flex" justifyContent="space-between" pt={4}>
                            {!existingPrefs && (
                                <Button
                                    colorScheme="gray"
                                    onClick={handleSkip}
                                >
                                    Skip for Now
                                </Button>
                            )}
                            <Button
                                type="submit"
                                colorScheme="teal"
                                ml={existingPrefs ? "auto" : 0}
                            >
                                {existingPrefs ? 'Update Preferences' : 'Save Preferences'}
                            </Button>
                        </Box>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    )
}

export default AddUserPrefs
