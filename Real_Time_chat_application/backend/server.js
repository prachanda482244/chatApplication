import express, { urlencoded } from "express";
import { PORT } from "./src/config/config.js";
import connectDb from "./src/db/connect.js";
import userRoutes from "./src/router/userRoutes.js";
import fileRouter from "./src/router/fileRouter.js";
// import cors from 'cors'
import { errorHandler, notFound } from "./src/helper/errorHandler.js";
import chatRoutes from "./src/router/chatRoutes.js";
import messageRoutes from "./src/router/messageRoutes.js";
import { Server } from 'socket.io'
import path from 'path'
const app = express()

connectDb()
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.use("/api/users", userRoutes)
app.use('/uploads', fileRouter)
app.use('/api/chats', chatRoutes)
app.use('/api/messages', messageRoutes)



// Deployment
const __dirname1 = path.resolve()
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "squad-talk/build")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "squad-talk", "build", "index.html"))
    })
} else {
    app.get('/', (req, res) => {
        res.send("Api running")
    })
}
app.use(notFound)
app.use(errorHandler)

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
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        socket.emit('connected')
    })
    socket.on('join chat', (room) => {
        socket.join(room)
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat

        if (!chat.users) return

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return
            socket.in(user._id).emit("message recieved", newMessageReceived)
        })
    })
    socket.off("setup", () => {
        socket.leave(userData._id)
    })
})