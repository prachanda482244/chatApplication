import expressAsyncHandler from "express-async-handler"
import { User } from "../schema/Model.js"
import { generateToken } from "../utils/token.js"
import { generateHashCode, compareHashCode } from "../utils/hashing.js"

export const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please Enter All The Fields")
    }

    // Checking the user is Already Exist or not
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("User Already Exists")
    }

    // making the hash of the user Password
    const hash = await generateHashCode(password)
    // If user doesnt exist then create new user
    const user = await User.create({
        name,
        email,
        password: hash,
        pic
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Failed to Create the user")
    }
})

export const authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check for the register email
    const user = await User.findOne({ email })

    // Checking the user password and email is mat  ched or not
    if (user && await compareHashCode(password, user.password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid Credential")
    }
})

export const allUsers = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {}
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
})
