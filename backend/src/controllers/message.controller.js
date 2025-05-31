import {ApiError} from '../utils/ApiError.js' ; 
import {ApiResponse} from "../utils/ApiResponse.js" ; 
import {asyncHandler} from'../utils/asyncHandler.js' ; 
import {User} from '../models/user.model.js' ;
import  { uploadOnCloudinary } from '../utils/cloudinary.js'; 
import { Message } from '../models/messages.model.js';

export const getUsersForSidebar = asyncHandler(async(req , res) =>{
    const loggedinUserId = req.user._id  ;
    if(!loggedinUserId){
        throw new ApiError(401 , "not logged in or authorized for this activity " ) ;
    }
    const filteredUsers = await User.find({_id : {$ne : loggedinUserId}}).select("-password") ; 
    if(!filteredUsers){
        throw new ApiError(404 , "no users found " ) ; 
    }
    return  res.status(200).json(new ApiResponse(200  ,filteredUsers,"users fetched successfully" )) ;
})

export const getMessages = asyncHandler(async(req , res)=>{
    const {id : userToChatId} = req.params 
    const myId = req.user._id  ; 
    if(!userToChatId || !myId){
        throw new ApiError(400 , "user you are looking for  not found " ) ; 
    }
    const messages = await Message.find(
        {
            $or: [
                {sender :myId , receiver : userToChatId} , 
                {sender : userToChatId , receiver : myId}
            ]
        }
    )
    if(!messages){
        throw new ApiError(404 , 'no messages found ') ; 
    }
    return res.status(200).json(new ApiResponse(200 , messages , "messages fetched Successfully ")) ; 

})

export const sendMessage = asyncHandler(async(req,  res)=>{
    const { text} = req.body ; 
    const {id : recieverId } = req.params ;
    const myId = req.user._id ; 
    if(!text || !recieverId || !myId){
        throw new ApiError(400 , "message not sent " ) ; 
    } 
    //TODO : add image upload functionality
    const message = await Message.create({
        sender : myId , 
        receiver : recieverId , 
        text : text , 
        image : ""
    })
    console.log("the reciever id is " , recieverId) ;

    console.log("the message is " , message) ;
    if(!message){
        throw new ApiError(500 , "message not sent " ) ; 
    }

    // TODO  : add socket io functionality to send message to the receiver

    return res.status(200).json(new ApiResponse(201 , message , "message sent successfully")) ; 

}) ; 