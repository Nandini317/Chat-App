import mongoose , {Schema} from 'mongoose' ;
import bcrypt from 'bcryptjs' ;

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
    if(!this.isModified("password")) return next() ; // agr password mein koi changes hi nahi hai to kyu hi update krna baar baar 
    // like if someone changes avatar , then why to again hash the password ?

    this.password = await bcrypt.hash(this.password ,10 ) // hash(kisko krna hai , kitne rounds of salting )
    next()
} )

export const User = mongoose.model('User' , userSchema) ; 