import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../Users/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../Users/UserListItem'

const UpdateGroupChat = ({ fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState()
    const [searchResult, setsearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const { selectedChat, setSelectedChat, user } = ChatState()
    const toast = useToast()

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const HandleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: 'Only admin can remove someone',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        try {
            setRenameLoading(true)
            const { data } = await axios.put('/api/chats/remove', {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)

            user1.id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {

            toast({
                title: 'Error occured',
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            console.log(error.message)

            setRenameLoading(false)
        }
        setGroupChatName('')

    }

    const HandleRename = async () => {
        if (!groupChatName) return
        try {
            setRenameLoading(true)
            const { data } = await axios.put('/api/chats/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: 'Error occured',
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            console.log(error.message)

            setRenameLoading(false)
        }
        setGroupChatName('')
    }
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) return
        try {
            setLoading(true)
            const { data } = await axios.get(`api/users?search=${search}`, config)
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
            console.log(error.message)

        }
    }

    const HandleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        const isAdmin = selectedChat.groupAdmin._id === user._id;
        if (!isAdmin) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            let object = {
                chatId: selectedChat._id,
                userId: user1._id,
            }
            console.log(object)
            const { data } = await axios.put(`/api/chats/add`, object, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            console.log(data)
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }

        setGroupChatName("");
    };

    return (
        <>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={'35px'}
                        fontFamily={'work sans'}
                        display='flex'
                        justifyContent={'center'}
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
                            {selectedChat.users.map((user) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    HandleFunction={() => HandleRemove(user)}
                                />
                            ))}
                        </Box>
                        <FormControl>
                            <Input placeholder='Chat name' mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button variant='solid' colorScheme='teal' ml={1} isLoading={renameLoading} onClick={HandleRename} >Update</Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add Users eg: prachanda , sushmita , prakash" mb={1} mt={2} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {
                            loading ? (<Spinner size={'lg'} />) : (
                                searchResult?.map((user) => (
                                    <UserListItem key={user._id}
                                        user={user}
                                        HandleFunction={() => HandleAddUser(user)}
                                    />

                                ))
                            )
                        }

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => HandleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    )
}

export default UpdateGroupChat
