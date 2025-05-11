import express from "express" ; 
import authRoutes from "./routes/auth.route.js" ; 
import messageRoutes from "./routes/message.route.js" ; 
import cookieParser from 'cookie-parser'


const app = express() ; 
app.use(cookieParser())

app.use(express.json()) ; 
app.use(express.urlencoded({extended:true})) ; 
app.use("/api/auth" , authRoutes) ; 
app.use('/api/messages' , messageRoutes) ; 

export default app   ; 