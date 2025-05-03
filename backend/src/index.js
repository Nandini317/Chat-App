import express from 'express' ;
import dotenv from 'dotenv' ;
dotenv.config() ;
const app = express() ; 

import authRoutes from "./routes/auth.route.js" ; 
const PORT = process.env.PORT || 5001 ;

app.use("/api/auth" ,authRoutes) 

// app.get('/' , (req , res)=>{
//     res.send("<h1>Hello world </h1>")
// })
app.listen(PORT , ()=>{
    console.log('Server is running on port 5001') ;
    
})


