import expressAsyncHandler from "express-async-handler"
import { Chat, User } from "../schema/Model.js";

export const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body
    let chatData
    if (!userId) {
        console.log("User Id params not send");
        return res.sendStatus(400)
    }
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password")
        .populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email pic"
    })
    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }
    }

    try {
        const createdChat = await Chat.create(chatData)
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")
        res.status(200).send(fullChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

export const fetchChat = expressAsyncHandler(async (req, res) => {
    try {
        let results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .exec();

        results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name email pic"
        });
        res.status(200).send(results)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)

    }
})

export const createGroupChat = expressAsyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" })
    }

    let users = JSON.parse(req.body.users)

    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat")
    }
    users.push(req.user)
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const createGroupChat = await Chat.find({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        res.status(200).json(createGroupChat)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

export const renameGroupChat = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!updatedChat) {
        res.status(400)
        throw new Error("Chat not found")
    } else {
        res.status(200).json(updatedChat)
    }
})

export const addToGroup = expressAsyncHandler(async (req, res) => {
    try {
        const { chatId, userId } = req.body
        const addNewUser = await Chat.findByIdAndUpdate(chatId, {
            $push: { users: userId }
        },
            { new: true }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        if (!addNewUser) {
            res.status(400)
            throw new Error("Chat not found")
        } else {
            res.status(200).send(addNewUser)
        }
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})
export const removeFromGroup = expressAsyncHandler(async (req, res) => {
    try {
        const { chatId, userId } = req.body
        const removeUser = await Chat.findByIdAndUpdate(chatId, {
            $pull: { users: userId }
        },
            { new: true }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        if (!removeUser) {
            res.status(400)
            throw new Error("Chat not found")
        } else {
            res.status(200).send(removeUser)
        }
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

