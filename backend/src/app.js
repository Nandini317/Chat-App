import express from "express" ; 
import authRoutes from "./routes/auth.route.js" ; 
import messageRoutes from "./routes/message.route.js" ; 
import cookieParser from 'cookie-parser'
import cors from 'cors' ; 
import dotenv from 'dotenv';
import {app} from './lib/socket.js'
dotenv.config();



//const app = express() ;  // used this earlier , when we didn't used socket io , as now we are using socket io and created an app using that , we will use that app in the socket io file
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