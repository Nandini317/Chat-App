import {create} from 'zustand';
import toast from 'react-hot-toast' ; 
import {axiosInstance} from "../lib/axios.js"
import { useAuthStore } from './useAuthStore.js';


export const useChatStore = create((set,get)=>({ //get is used inside the store to access the current state or other functions in your store.
    //In Zustand, store values aren't directly available to other functions/values in the store — that’s why we use get().
    messages :[] ,
    users :[] , 
    selectedUser : null ,
    isUsersLoading : false  , 
    isMessagesLoading : false ,


    getUsers : async(search ='')=>{
        console.log("int the getUser function ")
        set({isUsersLoading :true}) ; 
        try{
            console.log("int the try block of getUser ") ;
            const res = await axiosInstance.get(`/users/search?search=${search}`);
            console.log(res) ;
            console.log("here's the res.data : " , res.data)
            set({users : res.data.data}) ;
        }
        catch(error){
            toast.error(error.response.data.message) ;
        }
        finally{
            set({isUsersLoading : false}) ;
        }
    },

    getMessages : async(userId)=>{
        set({isMessagesLoading :true}) ; 
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            console.log("here is the res.data for get messages " , res) ;
        
            set({messages : res.data.data}) ;
        }
        catch(error){
            toast.error(error.response.data.message) ;
        }
        finally{
            set({isMessagesLoading : false}) ;
        }
    },
    
    sendMessage: async (messageData) => {
        console.log("the message data is "  , messageData);
        const { selectedUser, messages } = get();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          console.log(res) ;
          console.log("is messages an array?", Array.isArray(messages));
          set({ messages: [...messages, res.data.data] });
          console.log("done")
        } catch (error) {
          toast.error(error?.response?.data?.message || "not send message ");
        }
      },

      //getmessags is simply used to get the messages of the selected user , but to simulate real time 
    subscribeToMessages : ()=>{
        //if there is no selected user , then return
        const {selectedUser} = get() ; 
        if(!selectedUser){
            return ; 
        }
        const socket = useAuthStore.getState().socket ; 

 
        socket.on("newMessage" , (newMessage)=>{
            //console.log("new message received : " , newMessage) ;
            if(newMessage.sender !== selectedUser._id )return ; //if the new message is not from the selected user , then return
            set({
                messages : [...get().messages , newMessage],
            });
        });
    }, 

    unsubscribeFromMssages : ()=>{
        const socket = useAuthStore.getState().socket ; 
        socket.off("newMessage") ; 
    } , 
    setSelectedUser :(selectedUser) =>set({selectedUser}) ,

}))