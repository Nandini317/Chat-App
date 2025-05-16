import React from 'react'
import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore'
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton';

const ChatContainer = () => {

  const {messages , selectedUser ,isMessagesLoading , getMessages } = useChatStore() ; 

  useEffect(()=>{
    getMessages(selectedUser._id); 

  } ,[selectedUser._id ,getMessages ])

  if(isMessagesLoading)return(
    <div className='flex-1 flex flex-col overflow-auto'>
      <MessageSkeleton />
      <MessageInput />


    </div>
  )

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

      <p>message...</p>

      <MessageInput />
       
    </div>
  )
}

export default ChatContainer
