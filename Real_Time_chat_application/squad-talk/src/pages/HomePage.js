import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../Components/Authentication/Login'
import Signup from '../Components/Authentication/Signup'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("users"))
        if (user) navigate("/chats")
    }, [navigate])
    return (
        <Container
            maxW="xl"
            centerContent
        >
            <Box
                d="flex"
                justifyContent="center"
                p={{ base: 2, md: 3 }}
                bg="white"
                w="100%"
                m={{ base: "20px 0", md: "40px 50px 0 0" }}
                borderRadius="lg"
                borderWidth={{ base: 1, md: 2 }}
            >
                <Text
                    fontSize={{ base: "2xl", md: "4xl" }}
                    fontFamily="Work sans"
                    color={"black"}
                    textAlign="center"
                >
                    Squad - talk
                </Text>
            </Box>
            <Box
                bg={"white"}
                w="100%"
                p={{ base: 2, md: 4 }}
                borderRadius={"lg"}
                borderWidth={{ base: 1, md: 2 }}
                mr={{ base: 0, md: "50px" }}
                mt={{ base: "10px", md: "20px" }}
                color={"black"}
            >
                <Tabs variant='soft-rounded'>
                    <TabList mb={{ base: 0, md: "1em" }}>
                        <Tab width={{ base: "100%", md: "50%" }}>Login</Tab>
                        <Tab width={{ base: "100%", md: "50%" }}>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage
