import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Signup = () => {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPasword] = useState()
    const [pic, setPic] = useState()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const HandleName = (e) => {
        setName(e.target.value)
        setPic(e.target.value)
    }

    const HandleEmail = (e) => {
        setEmail(e.target.value)
    }

    const HandlePassword = (e) => {
        setPassword(e.target.value)
    }
    const HandleConfirmPassword = (e) => {
        setConfirmPasword(e.target.value)
    }
    const HandleClick = () => setShow(!show)

    const postDetails = (pics) => {
        const url = "https://api.cloudinary.com/v1_1/dyfbppxdm/image/upload"
        setLoading(true)
        if (pics === undefined) {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        if (pics.type === "image/jpeg" || pics.type === "image/jpg" || pics.type === "image/png") {
            const formData = new FormData()
            formData.append("file", pics)
            formData.append("upload_preset", "squad-talk")
            formData.append("cloud_name", "dyfbppxdm")
            fetch(url, {
                method: "post",
                body: formData
            })
                .then((res) => res.json())
                .then(formData => {
                    setPic(formData.url.toString())
                    setLoading(false)
                }).catch((err) => {
                    console.log(err)
                    setLoading(false)
                })
        } else {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }

    }

    // const HandleUploadFile = (e) => {
    //     setPic(e.target.files[0])
    // }

    const SubmitHandler = async () => {
        setLoading(true)
        if (!name || !email || !password || !confirmPassword) {
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
        if (password !== confirmPassword) {
            toast({
                title: "Password does not match",
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
            const { data } = await axios.post("/api/users", { name, email, password, pic }, config)
            toast({
                title: "Registration Successful",
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
                description: error.response.formData.message,
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
            <FormControl id="first-name" isRequired>
                <FormLabel > Name</FormLabel >
                <Input
                    placeholder='Enter your name'
                    onChange={HandleName}
                />
            </FormControl >

            <FormControl id="email" isRequired>
                <FormLabel > Email</FormLabel >
                <Input
                    placeholder='Enter your email'
                    onChange={HandleEmail}
                />
            </FormControl >

            <FormControl id="password" isRequired>
                <FormLabel > Password</FormLabel >
                <InputGroup>
                    <Input
                        type={show ? "text" : 'password'}
                        placeholder='Enter your password'
                        onChange={HandlePassword}
                    />
                    <InputRightElement>
                        <Button h="1.75rem" size="sm" p="4px" onClick={HandleClick}>
                            {show ? "hide" : "show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl >

            <FormControl id="confirm-password" isRequired>
                <FormLabel >Confirm Password</FormLabel >
                <InputGroup>
                    <Input
                        type={show ? "text" : 'password'}
                        placeholder='Confirm your password'
                        onChange={HandleConfirmPassword}
                    />
                    <InputRightElement>
                        <Button h="1.75rem" size="sm" p="4px" onClick={HandleClick}>
                            {show ? "hide" : "show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl >

            {/* <FormControl>
                <FormLabel>Upload Your picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept='image/*'
                    onChange={HandleUploadFile}
                />
            </FormControl> */}

            <FormControl>
                <FormLabel>Upload Your picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme='blue'
                width="100%"
                style={{ marginTop: 15 }}
                isLoading={loading}
                onClick={SubmitHandler}
            >
                Sign up
            </Button>
        </VStack >
    )
}

export default Signup
