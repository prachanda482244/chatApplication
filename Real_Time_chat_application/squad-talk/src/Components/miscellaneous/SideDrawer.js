import { Avatar, Box, Button, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
} from '@chakra-ui/react'
import ChatLoading from '../ChatLoading'
import UserListItem from '../Users/UserListItem'

const SideDrawer = () => {
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()
    const toast = useToast()

    const logoutHandler = () => {
        localStorage.removeItem("users")
        navigate('/')
    }
    const HandleSearch = async () => {
        if (!search) {
            setLoading(false)
            toast({
                title: "Please enter something in the search",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            })
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/users?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "Error occured..!!",
                description: 'Failed to load the search results',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    const accessChat = async (userId) => {
        try {

            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post('/api/chats', { userId }, config)

            if (!chats.find((chat) => chat._id === data._id)) setChats([data], ...chats)
            setLoadingChat(false)
            setSelectedChat(data)
            onClose()
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    return (
        <>
            <Box
                display="flex"
                justifyContent='space-between'
                alignItems='center'
                w="100%"
                bg='white'
                p="5px 10px 5px 10px"
                borderWidth='5px'
            >
                <Tooltip label="Search User to chat" hasArrow placement='bottom-end'>
                    <Button variant='ghost' onClick={onOpen}><i class="fas fa-search" style={{ hover: 'white' }}></i>
                        <Text display={{ base: "none", md: "flex" }} px={4}>Search user</Text>
                    </Button>
                </Tooltip>
                <Text fontSize='2xl' fontFamily='work sans'>Squad Talk</Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize='2xl' m={1} />

                        </MenuButton>
                        <MenuList pl={4}>
                            {
                                !notification.length && "No new notification"
                            }
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={'1px'} >SearchUsers</DrawerHeader>
                    <DrawerBody>
                        <Box display={'flex'} pb={2}>
                            <Input
                                placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => { setSearch(e.target.value) }}
                            />
                            <Button onClick={HandleSearch}>Go</Button>

                        </Box>

                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    HandleShowUser={() => accessChat(user._id)}
                                />
                            ))
                        )
                        }

                        {loadingChat && <Spinner ml='auto' display="flex" />}
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>
    )
}

export default SideDrawer
