import {Server} from "socket.io" ; 
import http from "http" ; 
import express from "express" ; 

const app = express() ; 
const server = http.createServer(app) ; 

const io = new Server(server , {
    cors : {
        origin : ["http://localhost:5173"]
    }
})

export function getRecieverSocketId(userId){
    return userSocketMap[userId] ; 
}

//used to store online users 
const userSocketMap = {} ;  //{userId : socketId}
io.on("connection" , (socket)=>{
    console.log("a user connected" , socket.id) ; 
    const userId = socket.handshake.query.userId ; //is used in Socket.IO (Node.js) to retrieve a query parameter from the client's socket connection — specifically, the userId.
    if(userId){
        userSocketMap[userId] = socket.id ; //store the userId and socketId in the map
    }
    io.emit("getOnlineUsers" , Object.keys(userSocketMap)) ; 
    socket.on("disconnect" , ()=>{
        console.log("a user disconnected" , socket.id) ; 
        delete userSocketMap[userId] ; 
    io.emit("getOnlineUsers" , Object.keys(userSocketMap)) ; 

    })
})

export {io  , app , server} ; 