import { Router } from "express"
import { allUsers, authUser, registerUser } from "../controller/userController.js"
import { auth } from "../middleware/auth.js"
const userRoutes = Router()

userRoutes.route('/').post(registerUser).get(auth, allUsers)
userRoutes.post('/login', authUser)
export default userRoutes