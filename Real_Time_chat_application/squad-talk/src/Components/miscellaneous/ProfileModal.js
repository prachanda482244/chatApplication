import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {children ? <span onClick={onOpen}>{children}</span> : (<IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />)}
            <Modal isOpen={isOpen} onClose={onClose} size={'lg'} >
                <ModalOverlay />
                <ModalContent h="450px">
                    <ModalHeader fontSize={'40px'} display={'flex'} justifyContent={'center'} fontFamily={'work sans'} >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        flexDir={'column'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        gap={'1rem'}
                    >
                        <Image
                            borderRadius='full'
                            boxSize={'150px'}
                            src={user.pic}
                            alt={user.name}
                        />
                        <Button variant='outline'>Update Details</Button>
                        <Text fontSize={{ base: '28px', md: '30px' }}
                            fontFamily={'work sans'}>{user.email}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>

            </Modal>
        </>
    )
}

export default ProfileModal
