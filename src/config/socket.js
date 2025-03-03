
const socket = require("socket.io");
const Chat = require("../models/chat");

const initialiseSocket = (httpServer) =>{

const io = socket(httpServer, { cors : {
    origin:"http://localhost:5173",
} });

io.on("connection", (socket) => {
  
    socket.on("joinChat" , ({sender,receiver}) =>{
        //console.log(userId,id);
        
        const roomId = [sender,receiver].sort().join("-");
        //console.log(roomId);
        
        socket.join(roomId);
    });

    socket.on("sendMessage" ,async ({sender,receiver,message})=>{
        //console.log(sender);
       
       
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

    socket.on("disconnect" , ()=>{

    })



  });


}

module.exports = initialiseSocket;