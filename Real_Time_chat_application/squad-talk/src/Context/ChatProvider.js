import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("users"))
        setUser(user)
        if (!user) {
            navigate('/')
        }
    }, [navigate])
    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
            {children}
        </ChatContext.Provider>
    )
}
export default ChatProvider

export const ChatState = () => {
    return useContext(ChatContext)
}