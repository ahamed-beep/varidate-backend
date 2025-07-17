import mongoose from "mongoose"

export const dbconnection = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connection successfull')
    } catch (error) {
        console.log(error , 'connection failed')
    }
}