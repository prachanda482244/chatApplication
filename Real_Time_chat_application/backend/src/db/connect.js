import { dbUrl } from "../config/config.js";
import { connect } from "mongoose";

const connectDb = async () => {
    try {
        const conn = await connect(dbUrl)
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch (err) {
        console.log(err.message)
        process.exit()
    }
}
export default connectDb