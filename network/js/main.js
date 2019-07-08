//游戏调用
const socket = io('ws://localhost:3000');
var local = new Local(socket);
var remote = new Remote(socket);

socket.on('waiting',(str)=>{
   document.getElementById('waiting').innerHTML = str;
})