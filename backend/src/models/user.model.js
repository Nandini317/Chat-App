import mongoose , {Schema} from 'mongoose' ;
import bcrypt from 'bcryptjs' ;
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    email:{
        type:String ,
        required:true , 
        unique:true ,
        trim:true 
    } , 
    fullName :{
        type:String , 
        required:true , 
        trim:true ,
        index :true 
    } , 
    password : {
        type:String , 
        required:[true ,'Password is required '  ], 
        minlength : [6 , "password must be at least 6 characters long " ] ,
    }  , 
    avatar:{
        type:String , 
        default :""  , 

    }
} , {timestamps:true}) ; 

userSchema.pre("save" ,async function (next){ //fnctn should not be an arrow function , as we need the context of "this"
    if(!this.isModified("password")) return next() ; 

    this.password = await bcrypt.hash(this.password ,10 ) 
    next()
} )

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
 }

userSchema.methods.generateToken = function(){
    return jwt.sign({
        _id : this._id  , 
        email :this.email , 
        fullName : this.fullName  ,  
    } 
    , process.env.TOKEN_SECRET , 
    {
        expiresIn: process.env.TOKEN_EXPIRY
    }) ; // jwt.sign({payload} , {secret} , {options})
}

export const User = mongoose.model('User' , userSchema) ; 
