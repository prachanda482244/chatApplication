import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/Chatlogics'
import { ChatState } from '../Context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({ message }) => {
    const { user } = ChatState()
    return (
        <ScrollableFeed>
            {message && message.map((msg, i) => (
                <div style={{ display: 'flex' }} key={msg._id} >
                    {
                        (isSameSender(message, msg, i, user._id) || isLastMessage(message, i, user._id)
                            && (
                                <Tooltip label={msg.sender.name} placement='bottom-start' hasArrow>
                                    <Avatar
                                        mt='7px'
                                        mr={1}
                                        size="sm"
                                        cursor={'pointer'}
                                        name={msg.sender.name}
                                        src={msg.sender.pic}
                                    />
                                </Tooltip>
                            )
                        )}
                    <span
                        style={
                            {
                                backgroundColor: `${msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                                borderRadius: '20px',
                                padding: '5px 15px',
                                maxWidth: '75%',
                                marginLeft: isSameSenderMargin(message, msg, i, user._id),
                                marginTop: isSameUser(message, msg, i) ? 3 : 10
                            }
                        }
                    >
                        {msg.content}
                    </span>
                </div>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat
