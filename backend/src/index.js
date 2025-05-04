import dotenv from 'dotenv' ;
import connectDB from "./db/index.js" ; 
import app from './app.js' ; 

dotenv.config() ;
 
const PORT = process.env.PORT || 5001 ;

connectDB()
.then(()=>{
    app.listen(PORT , ()=>{
        console.log('Server is running on port 5001') ;
         
    })
}).catch((err)=>{
    console.log("Error connecting to DB in index.js :" , err) ; 
})



