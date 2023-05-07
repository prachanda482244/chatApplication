import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()



    const HandleEmail = (e) => {
        setEmail(e.target.value)
    }

    const HandlePassword = (e) => {
        setPassword(e.target.value)
    }

    const HandleClick = () => setShow(!show)

    const GuestLogin = () => {
        setEmail("guest@example.com")
        setPassword("12345678")
    }

    const SubmitHandler = async () => {
        setLoading(true)
        if (!email || !password) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
            return
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const { data } = await axios.post("/api/users/login", { email, password }, config)
            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            localStorage.setItem("users", JSON.stringify(data))
            setLoading(false)
            navigate('/chats')

        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)

        }
    }
    return (
        <VStack spacing="5px" color="black">

            <FormControl id="email" isRequired>
                <FormLabel > Email</FormLabel >
                <Input
                    placeholder='Enter your email'
                    onChange={HandleEmail}
                    value={email}
                />
            </FormControl >

            <FormControl id="password" isRequired>
                <FormLabel > Password</FormLabel >
                <InputGroup>
                    <Input
                        type={show ? "text" : 'password'}
                        placeholder='Enter your password'
                        onChange={HandlePassword}
                        value={password}
                    />
                    <InputRightElement>
                        <Button h="1.75rem" size="sm" p="4px" onClick={HandleClick}>
                            {show ? "hide" : "show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl >


            <Button
                colorScheme='blue'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={SubmitHandler}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                variant={"solid"}
                colorScheme='red'
                width="100%"
                onClick={GuestLogin}
            >
                Get Guest User Credential
            </Button>
        </VStack >
    )

}

export default Login
