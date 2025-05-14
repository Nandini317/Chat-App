import {ApiError} from '../utils/ApiError.js' ; 
import {ApiResponse} from "../utils/ApiResponse.js" ; 
import {asyncHandler} from'../utils/asyncHandler.js' ; 
import {User} from '../models/user.model.js' ;
import  { uploadOnCloudinary } from '../utils/cloudinary.js'; 
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

    const {email , password } = req.body ; 
    if(!(email )){
        throw new ApiError(400 , "email is required")
    }
    if(!password){
        throw new ApiError(400 , "password is required ") ; 
    }
    const user = await User.findOne({email})
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
        maxAge: 0
    });

    res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
})

export const updateProfile = asyncHandler(async(req , res)=>{
    const avatarLocalPath = req.file?.path  ; 
    if(!avatarLocalPath){
        throw new ApiError(400 , "avatar is required ") ;
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath) ;
    if(!avatar.url){
        throw new ApiError(400 , 'error while uploading avatar ') ; 
    } 

    const updatedAvatarUser = await User.findByIdAndUpdate(req.user._id  , 
        {
            $set :{
                avatar : avatar.url 
            }

        } ,
        {new : true }).select("-password") ;

    return res.status(200)
    .json(new ApiResponse(200 ,updatedAvatarUser ,"avatar updated successfully " )) ; 
    
})

export const checkAuth  = asyncHandler(async(req , res)=>{
    const user = await User.findById(req.user._id).select("-password") ;
    res.status(200).json(new ApiResponse(201 ,user ,"user is authenticated and is logged already in ")) ; 
})

/*const {avatar} = req.file ;
    const userId  = req.user._id ;
    if(!avatar){
        throw new ApiError(400 , "avatar is required ") ;   
    }
    if(!userId){
        throw new ApiError(404 , "user not found ") ;
    }
    const user = await User.findById(userId) ; 
    if(!user){
        throw new ApiError(404 , "user not found ") ; 
    }
    const uploadResponse = await cloudinary.uploader.upload(avatar) ; 
    if(!uploadResponse){throw new ApiError(500 , "something went wrong while uploading the image ")}    
    const updatedUser = await User.findByIdAndUpdate(userId  , {avatar : uploadResponse.secure_url} , {new : true })
    if(!updatedUser){
        throw new ApiError(500 , "something went wrong while updating the user ") ; 
    }
    return res.status(200).json(new ApiResponse(201 ,"updated Avatar successfully " )) ; 
*/
    