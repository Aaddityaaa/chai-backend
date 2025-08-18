import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})
// console.log(process.env.MONGODB_URI)
connectDB()








// ( async ()=> {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     }catch(error){
//         console.error("Error :" + error);
//         throw error
//     }
// })()