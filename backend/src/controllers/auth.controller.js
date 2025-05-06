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
    const avatar = req.file?.path || "" ; 
    
    const user = await User.create({
        fullName , email , password  , 
        avatar : avatar?.url||"" 

    })
    const createdUser = await User.findById(user._id).select("-password") ; 
    if(!createdUser){
        throw new ApiError(500 , "something went wrong while creating a new User ")  
    }
    const token = await user.generateToken() ; 
    if (!token) {
        throw new ApiError(500, "Something went wrong while generating token");
    }

    // ✅ Set token in cookie
    const options = {
        httpOnly: true,
        sameSite: "strict",
        secure: true, // set to false in dev if needed
        maxAge: 7 * 24 * 60 * 60 * 1000
    };

    return res.status(201).cookie("token", token, options).json(
        new ApiResponse(201, { user: createdUser, token }, "User registered and logged in successfully")
    ); 
})

export const login = asyncHandler(async(req , res) =>{

    const {email , password ,fullName} = req.body ; 
    if(!(fullName || email )){
        throw new ApiError(400 , "email or fullName is required")
    }
    if(!password){
        throw new ApiError(400 , "password is required ") ; 
    }
    const user = await User.findOne({
        $or:[{email} , {fullName}]
    })
    if(!user){
        throw new ApiError(404,"user not found " ) ; 
    }
    const isPasswordValid= await user.isPasswordCorrect(password) ;
    if(!isPasswordValid){
        throw new ApiError(401 , "invalid credentials") ; 
    }
    const token = await user.generateToken() ; 
    if (!token) {
        throw new ApiError(500, "Something went wrong while generating token");
    }
    const options = {
        httpOnly:true , 
        sameSite :"strict" , 
        secure :true ,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
    res.status(200).cookie("token" , token , options).json(new ApiResponse(200 ,{user:user , token },"user logged in successfully "))
})
export const logout = asyncHandler(async(req , res)=>{
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: true, // set to false in dev
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
})

export const getUserbyId = asyncHandler(async(req , res)=>{
    const {userId} = req.body ; 
    if(!userId){
        throw new ApiError(400 , "userId is required ") ; 
    }
    const user = await User.findById(userId)?.select("-password") ;
    if(!user){
        throw new ApiError(404 , "user not found ") ; 
    }

    res.status(200).json(new ApiResponse(201 , {user : user } , "user found successfully")) ; 
})