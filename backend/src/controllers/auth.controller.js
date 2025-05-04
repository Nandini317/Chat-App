import {ApiError} from '../utils/ApiError.js' ; 
import {ApiResponse} from "../utils/ApiResponse.js" ; 
import {asyncHandler} from'../utils/asyncHandler.js' ; 
import {User} from '../models/user.model.js' ; 
export const signup = asyncHandler(async(req , res)=>{
    const {fullName , email , password } = req.body ;
    if([fullName , email , password].some((field) =>field.trim() ==="")){
        throw new ApiError(400 , "all fields are required for registering a user ")
    }
    const existedUser = await User.findOne({email}) ; 
    if(existedUser){
        throw new ApiError(409 , "user already exists") ;
    }
    if(password.length<6){
        throw new ApiError(400 , 'Password must be at least 6 characters ') ; 
    }

    
    const user = await User.create({
        fullName , email , password  , 
        avatar : avatar?.url||"" 

    })
    const createdUser = await User.findById(user._id).select("-password") ; 
    if(!createdUser){
        throw new ApiError(500 , "something went wrong while creating a new User ")  
    }
    return res.status(200).json(new ApiResponse(200 , "user registered successfully ")) ; 
})

export const login = (req , res)=>{
    res.send("<h1>login page in controller</h1>") ;
}
export const logout = (req , res)=>{
    res.send("<h1>logout page in controller</h1>") ;
}