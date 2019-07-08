/** 我的游戏区域逻辑 */
var Local = function (socket) {
   var game;   //游戏对象
   var INTERVAL = 500; //时间间隔
   var timer = null; //定时器
   var timeCount = 0;   //时间计数器
   var time = 0;     //游戏时间

   //绑定键盘事件
   var bindKeyEvent = function(){
      document.onkeydown = function(e){
         if (e.keyCode==38) { //up，旋转
            game.rotate();
            socket.emit('rotate');
         } else if(e.keyCode ==39) {   //right
            game.right();
            socket.emit('right');
         } else if (e.keyCode == 40) { //down
            game.down();
            socket.emit('down');
         } else if (e.keyCode == 37) { //left
            game.left();
            socket.emit('left');
         } else if (e.keyCode == 32) { //空格键，下降
            game.fall();
            socket.emit('fall');
         }
      }
   }
   //移动
   var move = function(){
      timeFunc();    //游戏时间
      if (!game.down()) { //判断是否能下降
         game.fixed();  //向下移动方块
         socket.emit('fixed');
         var line = game.checkClear(); //自动消行
         if (line) {    //游戏得分
            game.addScore(line);
            socket.emit('line', line);
            if (line>1) {  //每消两行给对方添加干扰
               var bottomLines = generataBottomLine(line);
               socket.emit('bottomLines', bottomLines)
            }
         };
         var gameOver = game.checkGameOver();   //游戏结束
         if (gameOver) {
            game.gameover(false);   //输了
            document.getElementById('remote_gameOver').innerHTML = "你赢了！"
            socket.emit('lose');
            stop();
         } else {
            var t = generateType();
            var d = generateDir();
            game.perFormNext(t, d);
            socket.emit('next',{type:t, dir:d});
         }
      } else {
         socket.emit('down');
      }
   }

   //随机生成干扰行
   var generataBottomLine = function(lineNum){
      var lines = [];
      for (let i = 0; i < lineNum; i++) {
         var line = [];
         for (let j = 0; j < 10; j++) {
            line.push(Math.ceil(Math.random()*2)-1)
         }
         lines.push(line)
      }
      return lines;
   }

   //计时函数
   var timeFunc = function(){
      timeCount = timeCount+1;
      if (timeCount == 5) {
         timeCount = 0;
         time = time + 1;
         game.setTime(time);
         socket.emit('time', time);
      }
   }

   //随机生成一个方块种类
   var generateType = function(){
      return Math.ceil(Math.random() * 7) - 1;   //生成0-6随机数
   }
   //随机生成一个旋转次数
   var generateDir = function(){
      return Math.ceil(Math.random() * 4) - 1; //生成0-3随机数
   }
   //开始
   var start = function(){
      var doms = {
         gameDiv: document.getElementById('local_game'),
         nextDiv: document.getElementById('local_next'),
         timeDiv: document.getElementById('local_time'),
         scoreDiv: document.getElementById('local_score'),
         resultDiv: document.getElementById('local_gameOver')
      };
      game = new Game();
      var type = generateType();
      var dir = generateDir()
      game.init(doms,type,dir);
      socket.emit('init',{type:type,dir:dir});
      bindKeyEvent();
      var t = generateType();
      var d = generateDir();
      game.perFormNext(t, d);
      socket.emit('next', {type:t, dir:d});
      timer = setInterval(move,INTERVAL);
   }

   //游戏结束
   var stop = function(){
      if (timer) {   //清除下落定时器
         clearInterval(timer);
         timer = null;
      }
      document.onkeydown = null; //清除键盘事件
   }

   socket.on('start',function(){
      document.getElementById('waiting').innerHTML = '';
      start();
   });

   socket.on('lose', function () {  //游戏结束
      game.gameover(true);
      stop();
   });

   socket.on('leave', function () {
      document.getElementById('local_gameOver').innerHTML = '对方掉线了';
      document.getElementById('remote_gameOver').innerHTML = '已掉线了';
      stop();
   });

   socket.on('bottomLines', function (data) { //同步干扰
      game.addTailLines(data);
      socket.emit('addTailLines', data);
   });
}