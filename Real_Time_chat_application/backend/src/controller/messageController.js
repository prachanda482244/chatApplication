import expressAsyncHandler from "express-async-handler";
import { Chat, Message, User } from "../schema/Model.js";

export const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body
    if (!content || !chatId) return res.status(400).json({ 'message': 'cannot provide credentials' })
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        let message = await Message.create(newMessage)
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        })
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        res.json(message)
    } catch (error) {
        res.status(400).send(error.message)

    }

})

export const allMessage = expressAsyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate
            ("sender", "name email pic").populate
            ("chat")
        res.status(200).json(messages)
    } catch (error) {
        res.send(400).json({ error: error.message })
    }

})