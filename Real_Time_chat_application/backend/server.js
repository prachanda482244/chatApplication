import express, { urlencoded } from "express";
import { PORT } from "./src/config/config.js";
import connectDb from "./src/db/connect.js";
import userRoutes from "./src/router/userRoutes.js";
import fileRouter from "./src/router/fileRouter.js";
import cors from 'cors'
import { errorHandler, notFound } from "./src/helper/errorHandler.js";
import chatRoutes from "./src/router/chatRoutes.js";
import messageRoutes from "./src/router/messageRoutes.js";
import { Server } from 'socket.io'
const app = express()

connectDb()
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.use("/api/users", userRoutes)
app.use('/uploads', fileRouter)
app.use('/api/chats', chatRoutes)
app.use('/api/messages', messageRoutes)
app.use(notFound)
app.use(errorHandler)
// app.use(cors({
//     origin: '*',
//     credentials: true
// }))
const server = app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    }
})
io.on('connection', (socket) => {
    console.log('Connected to socket')
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit('connected')
    })
    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('user jooin room' + room)
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat

        if (!chat.users) return console.log('chat.users not defined')

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return
            socket.in(user._id).emit("message recieved", newMessageReceived)
        })
    })
    socket.off("setup", () => {
        console.log('User Disconnected')
        socket.leave(userData._id)
    })
})