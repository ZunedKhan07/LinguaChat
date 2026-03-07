import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connect_DB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(` ✅ MongoDB connected !! DB HOST ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("❌ MongoDB connection Faied:", error);
        process.exit(1);
    }  
}   

export default connect_DB