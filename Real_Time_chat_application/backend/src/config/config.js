import { config } from "dotenv"
config()
export const PORT = process.env.PORT || 5000
export const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/chat-app"
export const secretKey = process.env.SECRET_KEY
export const baseUrl = process.env.BASE_URL