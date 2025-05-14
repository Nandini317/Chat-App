import express from "express" ; 
import authRoutes from "./routes/auth.route.js" ; 
import messageRoutes from "./routes/message.route.js" ; 
import cookieParser from 'cookie-parser'
import cors from 'cors' ; 
import dotenv from 'dotenv';
dotenv.config();



const app = express() ; 
app.use(cookieParser())
app.use(cors(
    {
        origin:"http://localhost:5173", // frontend URL
        credentials: true
    }
)) ; 
app.use(express.json({ limit: '20mb' })) ; 
app.use(express.urlencoded({extended:true ,  limit: '20mb' })) ; 
app.use("/api/auth" , authRoutes) ; 
app.use('/api/messages' , messageRoutes) ; 

export default app   ; 