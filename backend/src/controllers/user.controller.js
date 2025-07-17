import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js" ; 
import {asyncHandler} from "../utils/asyncHandler.js"  ; 
import {User} from '../models/user.model.js' ;

export const searchUser = asyncHandler(async(req , res)=>{
    const search = req.query?.search ||'';
    const currentUserId = req.user._id  ;
    if(!currentUserId){
            throw new ApiError(401 , "not logged in or authorized for this activity " ) ;
    }
    const filteredUsers = await User.find({
        $and :[
            {fullName : {$regex :'.*'+search +'.*' , $options: 'i'}},
            {_id : {$ne:currentUserId}}
        ]
    }).select("-password");
    if(!filteredUsers){
        throw new ApiError(404 , "no users found " ) ; 
    } 
    return res.status(200).json(new ApiResponse(201 , filteredUsers , "users fetched successfully"));

}) ; 