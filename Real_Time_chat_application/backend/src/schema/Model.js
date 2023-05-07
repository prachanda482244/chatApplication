import { model } from "mongoose";
import { chatSchema } from "./chatSchema.js";
import { messageSchema } from "./messageSchema.js";
import { userSchema } from "./userSchema.js";

export const Chat = model("Chat", chatSchema)
export const Message = model("Message", messageSchema)
export const User = model("User", userSchema)