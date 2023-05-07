import jwt from "jsonwebtoken"
import { secretKey } from "../config/config.js"
export const generateToken = (id) => {
    return jwt.sign({ id }, secretKey, {
        expiresIn: "30d"
    })
}
export const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey)
}
