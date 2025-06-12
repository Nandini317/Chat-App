import React from 'react'
import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore'
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';

import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
import { useRef } from 'react';

const ChatContainer = () => {
  const {authUser}  = useAuthStore() ; 
  const messageEndRef = useRef(null) ; 

  const {messages , selectedUser ,isMessagesLoading , getMessages ,subscribeToMessages , unsubscribeFromMssages} = useChatStore() ; 

  useEffect(()=>{
    
    getMessages(selectedUser._id); 
    subscribeToMessages() ; 

    return ()=> unsubscribeFromMssages() ; 

  } ,[selectedUser._id ,getMessages , subscribeToMessages, unsubscribeFromMssages]) ;

  useEffect(()=>{
    if(messageEndRef.current && messages ){
    messageEndRef.current.scrollIntoView({behavior: "smooth"}) ;

    }

  } , [messages])

  if(isMessagesLoading)return(
    <div className='flex-1 flex flex-col overflow-auto'>
      <MessageSkeleton />
      <MessageInput />


    </div>
  )

  return (
    
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message)=>(

          //console.log("message is : " , message.sender) ,//console.log("authuser is : " , authUser) ,//console.log("selectedUser is : " , selectedUser) , 
          <div
            key = {message._id}
            ref = {messageEndRef}
            // By attaching the ref to every message, you ensure it always points to the last one.
            className={`chat ${message.sender === authUser.data._id ? "chat-end" : "chat-start"}`}
          >
            {/* display image for along the message  */}
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img
                  src={
                    message.sender === authUser.data._id
                      ? authUser.data.avatar || "/avatar.png"
                      : selectedUser.avatar || "/avatar.png"
                  }
                  alt="profile pic"
                />

              </div>
            </div>

            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>{formatMessageTime(message.createdAt)}</time>
            </div>

            <div className='chat-bubble flex flex-col'>
                  {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>


          </div>
        ))}
      </div>
      <MessageInput />
       
    </div>
    
   
  )
}

export default ChatContainer
