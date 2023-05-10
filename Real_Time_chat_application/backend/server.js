import express, { urlencoded } from "express";
import { PORT } from "./src/config/config.js";
import connectDb from "./src/db/connect.js";
import userRoutes from "./src/router/userRoutes.js";
import fileRouter from "./src/router/fileRouter.js";
import cors from 'cors'
import { errorHandler, notFound } from "./src/helper/errorHandler.js";
import chatRoutes from "./src/router/chatRoutes.js";
import messageRoutes from "./src/router/messageRoutes.js";
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
app.use(cors({
    origin: '*'
}));
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})