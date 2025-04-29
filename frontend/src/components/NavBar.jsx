import { Button, Container, Flex, HStack, Text, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom"
import { LuCross, LuSun, LuMoon } from "react-icons/lu";
import { useChurchStore } from "../store/church";

const NavBar = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const { churches } = useChurchStore()

    return <Container maxW={"1140px"} px={4}>
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
                bgGradient={"linear(to-r, cyan.400, blue.500"}
                bgClip={"text"}
            >
                <Link to={"/"}>Church Home ✟</Link>
            </Text>

            <HStack spacing={2} alignItems={"center"}>
                <Link to={"/new"}>
                    <Button>
                        <LuCross fontSize={20} />
                    </Button>
                </Link>
                <Button onClick={toggleColorMode}>
                    {colorMode === "light" ? <LuMoon /> : <LuSun size="20" />}
                </Button>
            </HStack>
        </Flex>
    </Container>
}

export default NavBar
