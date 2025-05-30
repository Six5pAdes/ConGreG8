import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Heading,
    HStack,
    IconButton,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    VStack,
    Textarea
} from "@chakra-ui/react";
import { useChurchStore } from "../store/church";
import { useUserStore } from "../store/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChurchCard = ({ church }) => {
    const textColor = useColorModeValue("light" ? "gray.800" : "whiteAlpha.900");
    const bg = useColorModeValue("white", "gray.800");
    const { currentUser } = useUserStore();
    const navigate = useNavigate();

    const [updatedChurch, setUpdatedChurch] = useState(church)

    const { deleteChurch, updateChurch } = useChurchStore()
    const toast = useToast()

    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    const handleCardClick = (e) => {
        // Prevent navigation if clicking on edit or delete buttons
        if (e.target.closest('button')) {
            return;
        }
        navigate(`/churches/${church._id}`);
    };

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
        }
    }

    return (
        <Box
            shadow={"lg"}
            rounded={"lg"}
            overflow={"hidden"}
            transition={"all 0.3s ease"}
            _hover={{
                transform: "scale(1.05)",
                boxShadow: "xl",
            }}
            bg={bg}
            onClick={handleCardClick}
            cursor="pointer"
        >
            <Image src={church.image} alt={church.name} h={48} w='full' objectFit="cover" />

            <Box p={4}>
                <Heading as="h3" size="md" mb={2} color={"teal.500"}>
                    {church.name}
                </Heading>

                <Text fontWeight='bold' fontSize={"lg"} color={textColor} mb={2}>
                    {church.address}, {church.city}, {church.state}
                </Text>

                {currentUser && currentUser.userType === "churchRep" && (
                    <HStack spacing={2}>
                        <IconButton icon={<EditIcon />} colorScheme="teal" size="sm" onClick={onUpdateOpen} />
                        <IconButton icon={<DeleteIcon />} colorScheme="red" size="sm" onClick={onDeleteOpen} />
                    </HStack>
                )}
            </Box>

            <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Edit Church Info</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} p={4} bg={bg} rounded={"lg"} shadow={"md"}>
                            <Input
                                placeholder='Church Name'
                                name='name'
                                value={updatedChurch.name}
                                onChange={(e) => setUpdatedChurch({ ...updatedChurch, name: e.target.value })}
                            />
                            <Input
                                placeholder='Church Address'
                                name='address'
                                value={updatedChurch.address}
                                onChange={(e) => setUpdatedChurch({ ...updatedChurch, address: e.target.value })}
                            />
                            <Input
                                placeholder='Church City'
                                name='city'
                                value={updatedChurch.city}
                                onChange={(e) => setUpdatedChurch({ ...updatedChurch, city: e.target.value })}
                            />
                            <Input
                                placeholder='Church State'
                                name='state'
                                value={updatedChurch.state}
                                onChange={(e) => setUpdatedChurch({ ...updatedChurch, state: e.target.value })}
                            />
                            <Textarea
                                placeholder='Church Description'
                                name='description'
                                value={updatedChurch.description}
                                onChange={(e) => setUpdatedChurch({ ...updatedChurch, description: e.target.value })}
                            />
                            <Input
                                placeholder='Church Phone'
                                name='phone'
                                value={updatedChurch.phone}
                                onChange={(e) => setUpdatedChurch({ ...updatedChurch, phone: e.target.value })}
                            />
                            <Input
                                placeholder='Church Email'
                                name='email'
                                value={updatedChurch.email}
                                onChange={(e) => setUpdatedChurch({ ...updatedChurch, email: e.target.value })}
                            />
                            <Input
                                placeholder='Church Website'
                                name='website'
                                value={updatedChurch.website}
                                onChange={(e) => setUpdatedChurch({ ...updatedChurch, website: e.target.value })}
                            />
                            <Input
                                placeholder='Church Image URL'
                                name='image'
                                value={updatedChurch.image}
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

            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
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
        </Box >

    );
}

export default ChurchCard
