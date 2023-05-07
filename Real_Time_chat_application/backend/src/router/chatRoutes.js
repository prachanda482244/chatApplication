import { Router } from "express"
import { auth } from "../middleware/auth.js"
import { accessChat, addToGroup, createGroupChat, fetchChat, removeFromGroup, renameGroupChat } from "../controller/chatController.js"
const chatRoutes = Router()
chatRoutes.route('/').post(auth, accessChat)
chatRoutes.route('/').get(auth, fetchChat)

chatRoutes.route('/group').post(auth, createGroupChat)
chatRoutes.route('/rename').put(auth, renameGroupChat)
chatRoutes.route('/add').put(auth, addToGroup)
chatRoutes.route('/remove').put(auth, removeFromGroup)

export default chatRoutes