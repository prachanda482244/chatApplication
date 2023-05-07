import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../Users/UserListItem'
import UserBadgeItem from '../Users/UserBadgeItem'

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState('')
    const [selectedUsers, setselectedUsers] = useState([])
    const [search, setSearch] = useState()
    const [loading, setLoading] = useState(false)
    const [searchResult, setsearchResult] = useState([])
    const toast = useToast()
    const { user, chats, setChats } = ChatState()
    const log = console.log


    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) return

        try {
            setLoading(true)

            const { data } = await axios.get(`/api/users?search=${search}`, config)
            setLoading(false)
            setsearchResult(data)
        } catch (error) {
            toast({
                title: "Error occured",
                description: 'failed to load the search result',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            })

        }

    }
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
            return
        }
        try {
            const { data } = await axios.post('/api/chats/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((user) => user._id))
            }, config)
            setChats([data, ...chats])
            onClose()
            toast({
                title: "New Group Chat Created",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
        } catch (error) {
            toast({
                title: "Failed to create the group chat",
                description: error.response.data,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        }


    }
    const HandleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User Already Added",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
            return
        }
        setselectedUsers([...selectedUsers, userToAdd])

    }
    const handleDelete = (deleteuser) => {
        setselectedUsers(selectedUsers.filter((selectUser) => selectUser._id !== deleteuser._id))
    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily={'work sans'}
                        display={'flex'}
                        justifyContent='center'
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems={'center'}

                    >
                        <FormControl>
                            <Input placeholder="Chat name" mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add Users eg: prachanda , sushmita , prakash" mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {/* Selected  user */}
                        <Box w="100%" display='flex' flexWrap={'wrap'}>
                            {selectedUsers.map((user) => (
                                <UserBadgeItem key={user._id}
                                    user={user}
                                    HandleFunction={() => handleDelete(user)}
                                />
                            ))}
                        </Box>

                        {loading ? <Spinner /> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user} HandleShowUser={() => HandleGroup(user)} />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
