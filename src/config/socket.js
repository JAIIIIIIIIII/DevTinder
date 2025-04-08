
const socket = require("socket.io");
const Chat = require("../models/chat");

let onlineUsers = {};
const initialiseSocket = (httpServer) =>{

const io = socket(httpServer, { cors : {
    origin:"http://localhost:5173",
} });



io.on("connection", (socket) => {
  console.log("a user connected",socket.id);    

    const userId = socket.handshake.query.userId;
    onlineUsers[userId] = socket.id;
    console.log(onlineUsers);
        
    io.emit("online-users",Object.keys(onlineUsers));  
    socket.on("joinChat" , ({sender,receiver}) =>{
      
       // console.log(socket.id);
        
        const roomId = [sender,receiver].sort().join("-");
        //console.log(roomId);
        
        socket.join(roomId);
    });

   

    socket.on("sendMessage" ,async ({sender,receiver,message})=>{
        //console.log(sender);
        console.log("message sent" , socket.id);
        try{
            const roomId = [sender._id,receiver].sort().join("-");
             //console.log(roomId);
             //console.log(message);
            let chat = await Chat.findOne( { participants : {$all :[sender._id,receiver]}} );

            if(!chat){
                chat = new Chat({ participants : [sender._id,receiver] , messages:[]});
            }

            chat.messages.push({senderId : sender._id, message:message});

            await chat.save();
            io.to(roomId).emit("messageReceived",{sender,message});

        }catch(err){
            console.log(err);
            
        }

        
      

    });

    socket.on("disconnect", () => {
        
         delete onlineUsers[userId];
         io.emit("online-users",Object.keys(onlineUsers)); 
        console.log("user-disconnected");
        
    
      
      });



  });


}

module.exports = initialiseSocket;  