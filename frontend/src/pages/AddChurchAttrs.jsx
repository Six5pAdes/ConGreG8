import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
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
    Stack
} from '@chakra-ui/react'
import { useChurchAttrStore } from '../store/churchAttr'

const AddChurchAttrs = () => {
    const navigate = useNavigate()
    const { churchId } = useParams()
    const location = useLocation()
    const toast = useToast()
    const { createChurchAttr, updateChurchAttr } = useChurchAttrStore()
    const existingAttrs = location.state?.existingAttrs

    const [attributes, setAttributes] = useState({
        churchId,
        size: '',
        ageGroups: [],
        ethnicities: [],
        languages: [],
        denominations: [],
        volunteering: false,
        serviceNumber: 1,
        serviceTime: '',
        participatory: false
    })

    useEffect(() => {
        if (existingAttrs) {
            setAttributes({
                size: existingAttrs.size?.[0] || '',
                ageGroups: existingAttrs.ageGroup || [],
                ethnicities: existingAttrs.ethnicity || [],
                languages: existingAttrs.language || [],
                denominations: existingAttrs.denomination || [],
                volunteering: existingAttrs.volunteering || false,
                serviceNumber: existingAttrs.serviceNumber || 1,
                serviceTime: existingAttrs.serviceTime?.[0] || '',
                participatory: existingAttrs.participatory || false
            })
        }
    }, [existingAttrs])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setAttributes(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleMultiSelectChange = (name, values) => {
        setAttributes(prev => ({
            ...prev,
            [name]: values
        }))
    }

    const handleNumberChange = (value, name) => {
        setAttributes(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formattedAttrs = {
            ...attributes,
            size: attributes.size ? [attributes.size] : [],
            ageGroup: attributes.ageGroups,
            ethnicity: attributes.ethnicities,
            language: attributes.languages,
            denomination: attributes.denominations,
            serviceTime: attributes.serviceTime ? [attributes.serviceTime] : [],
        }

        if (existingAttrs) {
            const { success, message } = await updateChurchAttr(existingAttrs._id, formattedAttrs)
            if (success) {
                toast({
                    title: "Success",
                    description: "Attributes updated successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })
                navigate('/churches/' + existingAttrs.churchId)
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
            const { success, message } = await createChurchAttr(formattedAttrs)
            if (success) {
                toast({
                    title: "Success",
                    description: "Attributes saved successfully.",
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
    }

    const handleSkip = () => {
        navigate('/')
    }

    return (
        <Container maxW="container.md" py={10}>
            <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                    <Heading as="h1" size="xl" mb={4}>
                        {existingAttrs ? "Edit Your Church's Attributes" : 'Tell Us About What Your Church Has To Offer'}
                    </Heading>
                    <Text color="gray.600">
                        {existingAttrs
                            ? 'Update your attributes to so others can better find your church.'
                            : 'Tell us about what defines you as a church. You can also skip this step for now and tell us later.'}
                    </Text>
                </Box>

                <Box as="form" onSubmit={handleSubmit}>
                    <VStack spacing={6}>
                        <FormControl>
                            <FormLabel>Church Size</FormLabel>
                            <Select name="size" value={attributes.size} onChange={handleChange}>
                                <option value="" disabled>Select size</option>
                                <option value="small">Small (25-200 members)</option>
                                <option value="midsize">Midsize (200-400 members)</option>
                                <option value="big">Big (400-2000 members)</option>
                                <option value="megachurch">Megachurch (2000+ members)</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Age Groups</FormLabel>
                            <CheckboxGroup value={attributes.ageGroups} onChange={(values) => handleMultiSelectChange('ageGroups', values)}>
                                <Stack spacing={2}>
                                    <Checkbox value="family">Family-oriented</Checkbox>
                                    <Checkbox value="youngAdult">Young Adult</Checkbox>
                                    <Checkbox value="adult">Adult</Checkbox>
                                    <Checkbox value="senior">Senior</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </FormControl>

                        <FormControl>
                            <FormLabel> Ethnicities</FormLabel>
                            <CheckboxGroup value={attributes.ethnicities} onChange={(values) => handleMultiSelectChange('ethnicities', values)}>
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
                            <FormLabel> Languages</FormLabel>
                            <CheckboxGroup value={attributes.languages} onChange={(values) => handleMultiSelectChange('languages', values)}>
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
                            <FormLabel> Denomination</FormLabel>
                            <CheckboxGroup value={attributes.denominations} onChange={(values) => handleMultiSelectChange('denominations', values)}>
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
                            <FormLabel>Primary Service Time</FormLabel>
                            <Select name="serviceTime" value={attributes.serviceTime} onChange={handleChange}>
                                <option value="" disabled>Select service time</option>
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
                                value={attributes.serviceNumber}
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
                                isChecked={attributes.volunteering}
                                onChange={handleChange}
                            >
                                Offers volunteering opportunities
                            </Checkbox>
                        </FormControl>

                        <FormControl>
                            <Checkbox
                                name="participatory"
                                isChecked={attributes.participatory}
                                onChange={handleChange}
                            >
                                Has participatory worship style
                            </Checkbox>
                        </FormControl>

                        <Box w="full" display="flex" justifyContent="space-between" pt={4}>
                            {!existingAttrs && (
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
                                ml={existingAttrs ? "auto" : 0}
                            >
                                {existingAttrs ? 'Update Attributes' : 'Save Attributes'}
                            </Button>
                        </Box>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    )
}

export default AddChurchAttrs
