const app = require('http').createServer();
const io = require('socket.io')(app);

let clientCount = 0;    //客户端计数
let socketMap = {};     //用来存储客户端socket

let bindListener = (socket,event)=>{ //接收客户端信息
   socket.on(event, (data) => {
      if (socket.clientNum % 2 == 0) {
         if (socketMap[socket.clientNum - 1]) {
            socketMap[socket.clientNum - 1].emit(event, data)
         }
      } else {
         if (socketMap[socket.clientNum + 1]) {
            socketMap[socket.clientNum + 1].emit(event, data)
         }
      }
   });
}

io.on('connection',(socket)=>{
   clientCount +=1;
   socket.clientNum = clientCount;
   socketMap[clientCount] = socket;

   if (clientCount % 2 == 1) {
      socket.emit('waiting','请等待其它用户……')
   } else {
      //第二个用户进入，并向第一个用户发送start
      if (socketMap[socket.clientNum - 1]) {
         socket.emit('start');
         socketMap[(clientCount-1)].emit('start')
      } else {
         socket.emit('leave');
      }
   };

   bindListener(socket, "init");
   bindListener(socket, "next");
   bindListener(socket, "rotate");
   bindListener(socket, "right");
   bindListener(socket, "down");
   bindListener(socket, "left");
   bindListener(socket, "fall");
   bindListener(socket, "fixed");
   bindListener(socket, "line");
   bindListener(socket, "time");
   bindListener(socket, "lose");
   bindListener(socket, "bottomLines");
   bindListener(socket, "addTailLines");
   

   socket.on('disconnect',()=>{
      if (socket.clientNum % 2 == 0) {
         if (socketMap[socket.clientNum - 1]) {
            socketMap[socket.clientNum - 1].emit('leave')
         }
      } else {
         if (socketMap[socket.clientNum + 1]) {
            socketMap[socket.clientNum + 1].emit('leave')
         }
      }
      delete(socketMap[socket.clientNum]);
   })

})


app.listen(3000,()=>{
   console.log ('websocket listening on port 3000')
})
