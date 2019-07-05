/** 游戏区域 */
var Game = function(){
   var gameDiv,nextDiv; //dom元素
   var timeDiv;   //时间
   var scoreDiv;  
   var score = 0; //游戏分数
   var resultDiv; //游戏结束
   //游戏矩阵10X20
   var gameData = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   ];
   
   var cur; //当前方块
   var next;   //下一个方块

   //存储方块的div
   var nextDivs = []; 
   var gameDivs = [];
   //初始化Div
   var initDiv = function (dom,data,divs) {
      for (let i = 0; i < data.length; i++) {
         let div = [];
         for (let j = 0; j < data[0].length; j++) {
            let newNode = document.createElement('div');
            newNode.className = 'none';
            newNode.style.top = (i * 20) + 'px';
            newNode.style.left = (j * 20) + 'px';
            dom.appendChild(newNode);
            div.push(newNode);
         }
         divs.push(div);
      }
   }
   //刷新div
   var refreshDiv = function (data, divs) {
      for (let i = 0; i < data.length; i++) {
         for (let j = 0; j < data[0].length; j++) {
            if (data[i][j] == 0) {
               divs[i][j].className = 'none'
            } else if (data[i][j] == 1) {
               divs[i][j].className = 'done'
            } else if (data[i][j] == 2) {
               divs[i][j].className = 'current'
            }
         }
      }
   }
   //检测数据是否合法
   var isValid = function(pos,data){
      for (let i = 0; i < data.length; i++) {
         for (let j = 0; j < data[0].length; j++) {
            if(data[i][j] !=0){
               if (!check(pos,i,j)) {
                  return false
               }
            }
         }
      }
      return true;
   }
   //检测点是否合法
   var check = function(pos,x,y){
      if (pos.x + x < 0) {
         return false;
      } else if(pos.x + x >=gameData.length){
         return false;
      } else if (pos.y + y <0) {
         return false;
      } else if (pos.y + y >= gameData[0].length) {
         return false;
      } else if (gameData[pos.x+x][pos.y+y]==1) {
         return false;
      } else {
         return true;
      }
   }

   //清除数据
   var clearData = function(){
      for (let i = 0; i < cur.data.length; i++) {
         for (let j = 0; j < cur.data[0].length; j++) {
            if (check(cur.origin, i, j)) {
               gameData[cur.origin.x + i][cur.origin.y + j] = 0
            }
         }
      }
   }

   //设置数据
   var setData = function(){
      for (let i = 0; i < cur.data.length; i++) {
         for (let j = 0; j < cur.data[0].length; j++) {
            if (check(cur.origin,i,j)) {
               gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j]
            }
         }
      }
   }
   var down = function(){  //下移
      if(cur.canDown(isValid)){
         clearData();
         cur.down();
         setData();
         refreshDiv(gameData, gameDivs);
         return true;
      } else {
         return false;
      }
   }
   var left = function () { //左移
      if (cur.canLeft(isValid)) {
         clearData();
         cur.left();
         setData();
         refreshDiv(gameData, gameDivs);
      }
   }
   var right = function () { //右移
      if (cur.canRight(isValid)) {
         clearData();
         cur.right();
         setData();
         refreshDiv(gameData, gameDivs);
      }
   }
   //旋转
   var rotate = function () { //右移
      if (cur.canRotate(isValid)) {
         clearData();
         cur.rotate();
         setData();
         refreshDiv(gameData, gameDivs);
      }
   }

   //方块移动到底部时固定
   var fixed = function(){
      for (let i = 0; i < cur.data.length; i++) {
         for (let j = 0; j < cur.data[0].length; j++) {
            if (check(cur.origin,i,j)) {
               if (gameData[cur.origin.x+i][cur.origin.y+j]==2) {
                  gameData[cur.origin.x + i][cur.origin.y + j] = 1
               }
            }
         }
      }
      refreshDiv(gameData,gameDivs)
   }

   //消行,底部累计完整的自动清除
   var checkClear =function(){
      var line = 0;  //游戏得分
      for (let i = gameData.length-1; i>=0; i--) { //从下往上
         let clear = true;
         for (let j = 0; j < gameData[0].length; j++) {
            if (gameData[i][j] !=1) {  //判断是否能消除
               clear = false;
               break;
            }
         }
         if(clear){  //能消除，上行下移
            line = line + 1;
            for (let m = i; m>0; m--) {
               for (let n = 0; n < gameData[0].length; n++) {
                  gameData[m][n] = gameData[m-1][n];
               }
            }
            for (let n = 0; n < gameData[0].length; n++) {
               gameData[0][n] = 0;  //清除整行
            }
            i++;
         }
      }
      return line;
   }

   //检查游戏结束
   var checkGameOver = function(){
      var gameOver = false;
      for (let i = 0; i < gameData[0].length; i++) {
         if (gameData[1][i]==1) {
            gameOver = true;
         }
      }
      return gameOver;
   }

   //使用下一个方块
   var perFormNext = function(type,dir){
      cur = next;
      setData();
      next = SquareFactory.prototype.make(type,dir);
      refreshDiv(gameData,gameDivs);
      refreshDiv(next.data,nextDivs)
   }

   //设置游戏时间
   var setTime = function(time){
      timeDiv.innerHTML = time;
   }

   //游戏加分
   var addScore = function(line){
      var s = 0;
      switch (line) {
         case 1:
            s = 10;
            break;
         case 2:
            s = 30;
         break;
         case 3:
            s = 60;
         break;
         case 4:
            s = 100;
         break;
         default:
            break;
      }
      score = score + s;
      scoreDiv.innerHTML = score;
   }

   //游戏结束
   var gameover = function(win){
      if (win) {
         resultDiv.innerHTML = '你赢了！'
      } else {
         resultDiv.innerHTML = '你输了！'
      }
   }

   //底部增加干扰行
   var addTailLines = function(lines){
      for (let i = 0; i < gameData.length-lines.length; i++) {
         gameData[i] = gameData[i+lines.length]
      }
      for (let i = 0; i < lines.length; i++) {
         gameData[gameData.length-lines.length+i] = lines[i]
      }
      cur.origin.x=cur.origin.x-lines.length;
      if (cur.origin.x<0) {
         cur.origin.x=0;
      }
      refreshDiv(gameData,gameDivs);
   }

   //初始化方法
   var init = function(doms,type,dir){
      gameDiv = doms.gameDiv;
      nextDiv = doms.nextDiv;
      timeDiv = doms.timeDiv;
      scoreDiv = doms.scoreDiv;
      resultDiv = doms.resultDiv;
      next = new SquareFactory.prototype.make(type, dir);
      initDiv(gameDiv,gameData,gameDivs);
      initDiv(nextDiv,next.data,nextDivs);
      refreshDiv(next.data,nextDivs);
   }
   //导出API
   this.init = init;
   this.down = down;
   this.left = left;
   this.right = right;
   this.rotate = rotate;
   this.fall = function(){while(down());}
   this.fixed = fixed;
   this.perFormNext = perFormNext;
   this.checkClear = checkClear;
   this.checkGameOver = checkGameOver;
   this.setTime = setTime;
   this.addScore = addScore;
   this.gameover = gameover;
   this.addTailLines = addTailLines;
}



