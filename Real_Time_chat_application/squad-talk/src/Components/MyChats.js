import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import { getSender } from '../config/Chatlogics'
import GroupChatModal from './miscellaneous/GroupChatModal'

const MyChats = ({ fetchAgain, setFetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState()
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()
    const toast = useToast()

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
    const fetchChats = async () => {
        try {

            // const { data } = await axios.get('http://localhost:3000/api/chats', config)
            const { data } = await axios.get('/api/chats', config)
            setChats(data)
        } catch (error) {
            toast({
                title: "Error occured",
                description: 'failed to load the chats',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            })
            console.log(error.message)
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("users")))
        fetchChats()
    }, [fetchAgain])


    return (
        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: "flex" }}
            flexDir={'column'}
            alignItems='center'
            p={3}
            bg="white"
            w={{ base: '100%', md: '35%' }}
            borderRadius={'lg'}
            borderWidth={'1px'}

        >

            <Box
                pb={3}
                px={3}
                fontSize={{ base: '28px', md: '30px' }}
                fontFamily={'work sans'}
                display="flex"
                w="100%"
                justifyContent={'space-between'}
                alignItems={'center '}
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display='flex'
                        fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                        rightIcon={<AddIcon />}
                        p={3}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display='flex'
                flexDir='column'
                p={3}
                bg='#F8F8F8'
                w='100%'
                h='100%'
                borderRadius={'lg'}
                overflowY={'hidden'}

            >
                {
                    chats ? (
                        <Stack overflowY={'scroll'}>

                            {
                                chats.map((chat) => (
                                    <Box onClick={() => setSelectedChat(chat)}
                                        cursor='pointer'
                                        bg={selectedChat === chat ? '#38B2AC' : '#e8e8e8'}
                                        color={selectedChat === chat ? 'white' : 'black'}
                                        px={3}
                                        py={2}
                                        borderRadius={'lg'}
                                        key={chat._id}
                                    >

                                        <Text>
                                            {!chat.isGroupChat ? getSender(loggedUser, chat.users) : (chat.chatName)
                                            }
                                        </Text>
                                    </Box>
                                ))
                            }
                        </Stack>
                    ) : (
                        <ChatLoading />
                    )
                }
            </Box>
        </Box>
    )
}

export default MyChats
