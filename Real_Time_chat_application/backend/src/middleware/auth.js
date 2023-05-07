import { User } from '../schema/Model.js'
import expressAsyncHandler from 'express-async-handler'
import { verifyToken } from '../utils/token.js'
import { secretKey } from '../config/config.js'

export const auth = expressAsyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = verifyToken(token, secretKey)

            req.user = await User.findById(decoded.id).select("-password")
            next()
        } catch (err) {
            res.status(401)
            throw new Error("Unauthorized user -  token failed")
        }
    }
    if (!token) {
        res.status(401)
        throw new Error("Unauthorized user - no token")
    }
})