import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, Toast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/Chatlogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChat from './miscellaneous/UpdateGroupChat'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import Lottie from 'react-lottie'
import io from 'socket.io-client'
import animationData from '../animation/typing.json'

const ENDPOINT = "https://squad-talk.vercel.app/"
let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const [message, setMessage] = useState([])
    const [newMessage, setNewMessage] = useState()
    const [loading, setLoading] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
        }
    }
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidyMid slice"
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            try {
                setNewMessage("")
                const { data } = await axios.post('/api/messages', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                socket.emit('new message', data)
                setMessage([...message, data])

            } catch (error) {
                Toast({
                    title: "Error occured",
                    description: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom-left'
                })
            }
        }
    }

    const fetchMessages = async () => {
        if (!selectedChat) return

        try {
            setLoading(true)
            const { data } = await axios.get(`/api/messages/${selectedChat._id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            setMessage(data)
            setLoading(false)
            socket.emit('join chat', selectedChat._id)
        } catch (error) {
            Toast({
                title: "Error occured",
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        // Typing Indicator logic
        if (!socketConnected) return
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        let timerLength = 3000
        setTimeout(() => {
            let timeNow = new Date().getTime()
            let timeDifference = timeNow - lastTypingTime
            if (timeDifference >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }
    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket.on('message recieved', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // give notification
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)
                }

            } else {
                setMessage([...message, newMessageReceived])
            }
        })
    })
    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: '28px', md: '30px' }}
                            pb={3}
                            px={2}
                            w='100%'
                            fontFamily={'work sans'}
                            display={'flex'}
                            justifyContent={{ base: 'space-between' }}
                            alignItems={'center'}
                        >
                            <IconButton
                                display={{ base: 'flex', md: 'none' }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat('')}
                            />
                            {
                                !selectedChat.isGroupChat ? (
                                    <>
                                        {getSender(user, selectedChat.users)}
                                        <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChat
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                            fetchMessages={fetchMessages}
                                        />
                                    </>
                                )
                            }
                        </Text>
                        <Box
                            display='flex'
                            flexDir='column'
                            justifyContent='flex-end'
                            p={3}
                            bg='#E8E8E8'
                            w='100%'
                            h='100%'
                            borderRadius='lg'
                            overflowY='hidden'
                        >
                            {
                                loading ? (
                                    <Spinner
                                        size={'xl'}
                                        h={20}
                                        w={20}
                                        alignSelf={'center'}
                                        margin='auto'

                                    />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'scroll', scrollbarWidth: 'none' }}>

                                        <ScrollableChat message={message} />
                                    </div>
                                )
                            }
                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                {isTyping ? <div>
                                    <Lottie
                                        options={defaultOptions}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div> : <></>}

                                <Input variant={'filled'} placeholder="Enter a message " bg='#E0E0E0' onChange={typingHandler} value={newMessage} />


                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
                        <Text fontSize={'3xl'} fontFamily='work sans'>
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat
