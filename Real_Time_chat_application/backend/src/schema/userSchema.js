import { Schema } from "mongoose";

export const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"]
    },
    pic: {
        type: String,
        default: "https://png.pngtree.com/png-clipart/20200701/original/pngtree-black-default-avatar-png-image_5407174.jpg"
    },
}, {
    timestamps: true
})