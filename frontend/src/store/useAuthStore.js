import {create} from "zustand" 
import { axiosInstance } from "../lib/axios"

export const useAuthStore = create((set)=>({
    authUser:null , 
    isSigningUp :false ,
    isLoggingIn : false ,
    isUpdatingProfile : false ,

    isCheckingAuth : true ,

    checkAuth : async()=>{
        try {
            // /api/auth/check
            const res = await axiosInstance.get("/auth/check") ;
            set({
                authUser : res.data
            })
            
        } catch (error) {
            console.log("Error checking auth" , error) ;
            set({authUser :null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    }  , 

    signup :  async (data)=>{

    }
}))