import {v2 as cloudinary} from 'cloudinary' ;
import fs from 'fs' ; 
import {config} from 'dotenv' ; 
config() ;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const uploadOnCloudinary  = async(localfilepath)=>{
    try{
        if(!localfilepath)return null ; 
        const response = await cloudinary.uploader.upload(localfilepath , {resource_type : "image"}) ; 
        console.log("file uploaded successfully " , response.url) ;
        return response  ; 
    }
    catch(err){
        fs.unlinkSync(localfilepath) ; // delete the file from local storage

    }
}
export {uploadOnCloudinary} ;  // export the function to use in other files