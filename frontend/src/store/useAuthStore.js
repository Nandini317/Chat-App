import {create} from "zustand" 
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import {io} from "socket.io-client" ; 

const BASE_URL = "http://localhost:5001" ;

export const useAuthStore = create((set , get)=>({
    authUser:null , 
    isSigningUp :false ,
    isLoggingIn : false ,
    isUpdatingProfile : false ,
    isCheckingAuth : true ,
    onlineUsers : [],
    socket: null  , 


    checkAuth : async()=>{
        try {
            // /api/auth/check
            const res = await axiosInstance.get("/auth/check") ;
            set({
                authUser : res.data
            })
            get().connectSocket() ; 

            
        } catch (error) {
            console.log("Error checking auth" , error) ;
            set({authUser :null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    }  , 

    signup :  async (data)=>{
       set({isSigningUp:true}) ; 
       try{
        const res = await axiosInstance.post("/auth/signup" , data) ; 
        set({authUser : res.data}) ; 
        toast.success("Account created successfully") ;
        get().connectSocket() ; 

       } catch (error) {
        toast.error(error?.response?.data?.message || "signup failed")  ; 
       }
       finally{
        set({isSigningUp : false})
       }
    }, 

    logout : async()=>{
        //cleared cookie in backend,so authUser set to false
        try{
            const res = await axiosInstance.post("/auth/logout") ; 
            set({authUser:null}) ; 
            toast.success("logged out successfully") ; 
            get().disconnectSocket() ; 
        }catch(error){
            toast.error(error?.response?.data?.message || "logout failed") ; 
        }
    },

    login : async(data)=>{
        set({isLoggingIn : true}) ; 
        try{
            const res = await axiosInstance.post("/auth/login" , data) ;
            console.log(res) ; 
            set({authUser : res.data}) ; 
            toast.success("logged in successfully") ; 

            get().connectSocket() ; 
            
        }catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "login failed")  ; 

        }
        finally{
            set({isLoggingIn :false}) ; 
        }
    },

    updateProfile : async(data)=>{
        set({isUpdatingProfile:true}) ; 
        try {
            //const res = await axiosInstance.patch("/auth/update-profile" , data , ) ; 
            const res = await axiosInstance.patch("/auth/update-profile", data, {
                headers: {
                  'Content-Type': 'multipart/form-data', // Ensure correct content type for FormData
                }
              });
            set({authUser : res.data}) ; 
            toast.success("Profile updated successfully") ;
        } catch (error) {
             console.log("error in update profile " , error) ;
            toast.error(error?.response?.data?.message || "Profile update failed") ;
            
        }
        finally{
            set({isUpdatingProfile :false})
        }
    },

    connectSocket : ()=>{
        const {authUser} = get()  ; 
        if(!authUser || get().socket?.connected )return ; //if user is not even authorized , then no need for the connection 
        const socket = io(BASE_URL ,{
            query : { //passed query parameters for backend 
                userId : authUser.data._id
            }
        })
        socket.connect() ; 
        set({socket : socket}) ; 
        socket.on("getOnlineUsers" , (userIds)=>{
            set({onlineUsers : userIds})
        });
    } , 
    disconnectSocket : () =>{
        if(get().socket?.connected){
            get().socket.disconnect() ; 
        }
    } 

}))