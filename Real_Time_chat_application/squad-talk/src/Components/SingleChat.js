import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, Toast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/Chatlogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChat from './miscellaneous/UpdateGroupChat'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
const ENDPOINT = "http://localhost:5000"
let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [message, setMessage] = useState([])
    const [newMessage, setNewMessage] = useState()
    const [loading, setLoading] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connection', () => setSocketConnected(true))
    }, [])

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
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
    }
    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket.on('message recieved', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // give notification
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
