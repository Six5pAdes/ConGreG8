import { Button, Container, Flex, HStack, Text, useColorMode, Menu, MenuButton, MenuList, MenuItem, IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom"
import { LuCross, LuSun, LuMoon, LuUser, LuLogIn, LuLogOut } from "react-icons/lu";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const { currentUser, logout } = useUserStore()

    const showAddChurchButton = currentUser && currentUser.isChurchgoer === true

    const handleLogout = () => {
        logout()
        useNavigate('/')
    }

    return (
        <Container maxW={"1140px"} px={4}>
            <Flex
                h={16}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={{ base: "column", sm: "row" }}
            >
                <Text
                    fontSize={{ base: "22", sm: "28" }}
                    fontWeight={"bold"}
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    bgGradient={"linear(to-r, cyan.400, blue.500)"}
                    bgClip={"text"}
                >
                    <Link to={"/"}>ConGreG8 ✟</Link>
                </Text>

                <HStack spacing={2} alignItems={"center"}>
                    {showAddChurchButton && (
                        <Link to={"/new"}>
                            <Button>
                                <LuCross fontSize={20} />
                            </Button>
                        </Link>
                    )}
                    <Button onClick={toggleColorMode}>
                        {colorMode === "light" ? <LuMoon /> : <LuSun size="20" />}
                    </Button>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            icon={<LuUser fontSize={20} />}
                            variant="ghost"
                        />
                        <MenuList>
                            {currentUser ? (
                                <>
                                    <MenuItem as={Link} to="/account">
                                        My Account
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <LuLogOut style={{ marginRight: "8px" }} />
                                        Logout
                                    </MenuItem>
                                </>
                            ) : (
                                <MenuItem as={Link} to="/login">
                                    <LuLogIn style={{ marginRight: "8px" }} />
                                    Login
                                </MenuItem>
                            )}
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>
        </Container >
    )
}

export default NavBar
