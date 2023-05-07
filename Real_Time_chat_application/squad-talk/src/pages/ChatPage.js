// import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
// import axios from 'axios'
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../Components/miscellaneous/SideDrawer'
import MyChats from '../Components/MyChats'
import ChatBox from '../Components/ChatBox'
const ChatPage = () => {
    const { user } = ChatState()
    return (
        <div style={{ width: '100%' }}>
            {user && <SideDrawer />}

            <Box display='flex'
                justifyContent='space-between'
                w='100%'
                h='90vh'
                p="20px"
            >
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>

        </div>
    )
}

export default ChatPage
