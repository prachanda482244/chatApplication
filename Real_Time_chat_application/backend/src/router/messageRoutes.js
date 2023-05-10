import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { allMessage, sendMessage } from '../controller/messageController.js'

const messageRoutes = Router()

messageRoutes.route('/').post(auth, sendMessage)
messageRoutes.route('/:chatId').get(auth, allMessage)

export default messageRoutes