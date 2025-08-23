import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError}  from "../utils/ApiError.js" ; 
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

export const verifyJWT = asyncHandler(async(req, res , next)=>{
    try {
        const token = req.cookies?.token ||req.header("Authorization")?.replace("Bearer " , "" ) // ho skta hai user request from se nehi header se aai ho 
        
    
        if(!token){
            throw new ApiError(401 , "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token , process.env.TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password")
    
        if(!user){
             
            throw new ApiError(401 , "Invalid Access Token")
        }
    
        req.user = user ;
        next() 
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid Access Token" )
    }

})
