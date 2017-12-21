$(document).ready(function(){
  var cells=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//initilization with zero values for all cells
  var yloc=0,xloc=0;
  var score=0;
  var won=false;
  //creating emptycells
  for(var i=0;i<16;i++){      
    var xloc=((i)%4)*110;
    var yloc=Math.floor((i)/4)*110;
    $(".wrapper").append("<div class='emptycell emp"+i+"'></div>");
    $(".emp"+i).css("transform","translate("+xloc+"px,"+yloc+"px)");
  }
  //The class cell & methods
  var Cell=function(index,val){
        this.index=index;
        this.value=val;
  }
  Cell.prototype.move=function(ev){
    cells[this.index-1]=0;
    var cell=$("."+this.index);
    if(ev==40){//move down
      this.index=(this.index/4>3)?this.index:this.index+4;
    }else if(ev==38){//move up
      this.index=(this.index/4<=1)?this.index:this.index-4;
    }else if(ev==37){//move left
      this.index=(this.index%4==1)?this.index:this.index-1;
    }else if(ev==39){//move right
      this.index=(this.index%4==0)?this.index:this.index+1;
    }
    cells[this.index-1]=this;
  }
  //Initialization function with 2 random cells with 2
  function init(){
  var a1=randInt(1,16),a2=randInt(1,16);
  while(a1==a2){
    a2=randInt(1,16);
  }
  cells[a1-1]=new Cell(a1,2);
  cells[a2-1]=new Cell(a2,2);
  redraw();
  }

  init();//initialize

  //Function for swipe handler using touchSwipe jquery framework
  $(window).swipe( {
    //Generic swipe handler for all directions
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
      if(direction=="left"){
        act(37);
      } else if(direction=="up"){
        act(38);
      } else if(direction=="right"){
        act(39);
      } else if(direction=="down"){
        act(40);
      }
    }
  });

  //Key Events function
  $(window).keydown(function(ev){
      act(ev.which);
  });

  //Action function on keypress & swipe event
  function act(ev){
    if(shift(ev)){//check if any shift or movement happend in a direction or any cells merged
    //getting indices of zero values or empty cells of cells array into idx & selecting any random value
    var zeros=[];
    var idx = cells.indexOf(0);        
    while(idx!=-1){
      zeros.push(idx);
      idx = cells.indexOf(0, idx + 1);        
    }
    idx=zeros[Math.floor(Math.random()*zeros.length)];
    var chanceOf4=Math.random();//chance of appearing four
    if(chanceOf4<0.1){//10% times create 4
      cells[idx]=new Cell(idx+1,4);
    }
    else cells[idx]=new Cell(idx+1,2);//90% times create new cell with 2
  }
  redraw();//redrawing the modified cells
  }

  function redraw(){
    $(".board").html("");//emptying the board
    for(var i=0;i<cells.length;i++){
      if(cells[i]!=0){
      var index=i+1;
      var xloc=((index-1)%4)*110;//calculating x pos
      var yloc=Math.floor((index-1)/4)*110;//calculating y pos
      var cclass="large";//color class
      setcolorclass(cells[i]);//setting color
      $(".board").append("<div class='cell "+index+" "+cclass+"'>"+cells[i].value+"</div>");//creating div
      $("."+index).css("transform","translate("+xloc+"px,"+yloc+"px)");//positioning the div
      $(".score").text(score);//display score
      }
    }
    //check if won
    if(won){
      showalert("Congrats You win!!","Continue");
    }
    //check for game over
    if(allFilled(1,16)&&noMatch()){//conditions are all filled & nomatch for merging
      console.log(cells);
      showalert("Game Over!!","Play Again");
    }
    //function to set colors & font class
    function setcolorclass(cell) {
      if (cell.value == 2) {
        cclass = "two";
      }
      else if (cell.value == 4) {
        cclass = "four";
      }
      else if (cell.value == 8) {
        cclass = "eight";
      }
      else if (cell.value == 16) {
        cclass = "sixteen";
      }
      else if (cell.value == 32) {
        cclass = "thirtyTwo";
      }
      else if (cell.value == 64) {
        cclass = "sixtyFour";
      }
      else if (cell.value == 128) {
        cclass = "oneTwentyEight";
      }
      else if (cell.value == 256) {
        cclass = "twoFiveSix";
      }
      else if (cell.value == 512) {
        cclass = "fiveOneTwo";
      }
      else if (cell.value == 1024) {
        cclass = "one024";
      }
      else if (cell.value == 2048) {
        cclass = "two048";
      }
    }
  }
  //movement function
  function shift(ev){
    var moved=false;
    if(ev==40){//shifting down
      var empty=0;
      for(var i=13;i<=16;i++){//iterating over columns
        var j=i;
        var combined=true;
        while(combined){//checking whether any cell have been merged then continue movement on that col
          combined=false;
        for(var l=i;l>=i-12;l-=4){//iterating over cells in a column
        for(j=l;j>=i-12&&isEmpty(j);j-=4){//checking empty cells below each non empty cell
          empty++;//storing num of empty cells
        }
        if(j>=i-12){//if any empty cell
          for(var k=0;k<empty;k++){//move upto num of empty cell
            cells[j-1].move(ev);
            j=j+4;
            moved=true;////setting moved to true if movement happend
          }
        }
        empty=0;
      }
      combined=combine(ev,i);//checking for merge possibility & merfing
      if(combined) moved=true;//setting moved to true if combined
      }
        }
    }
    if(ev==38){//shifting up in similar fasion
      var empty=0;
      for(var i=1;i<=4;i++){
        var j;
        var combined=true;
        while(combined){
          combined=false;
        for(var l=i;l<=i+12;l+=4){
        for(j=l;j<=i+12&&isEmpty(j);j+=4){
          empty++;
        }
        if(j<=i+12){
          for(var k=0;k<empty;k++){
            cells[j-1].move(ev);
            j=j-4;
            moved=true;
          }
        }
        empty=0;
      }
      combined=combine(ev,i);
      if(combined) moved=true;
      }
      }
    }
    if(ev==37){//shifting left in similar fasion
      var empty=0;
      for(var i=1;i<=13;i+=4){
        var j;
        var combined=true;
        while(combined){
          combined=false;
        for(var l=i;l<=i+3;l++){
        for(j=l;j<=i+3&&isEmpty(j);j++){
          empty++;
        }
        if(j<=i+3){
          for(var k=0;k<empty;k++){
            cells[j-1].move(ev);
            j=j-1;
            moved=true;
          }
        }
        empty=0;
      }
      combined=combine(ev,i);
      if(combined) moved=true;
      }
      }
    }
    if(ev==39){//shifting right in similar fasion
      var empty=0;
      for(var i=4;i<=16;i+=4){
        var j;
        var combined=true;
        while(combined){
          combined=false;
        for(var l=i;l>=i-3;l--){
        for(j=l;j>=i-3&&isEmpty(j);j--){
          empty++;
        }
        if(j>=i-3){
          for(var k=0;k<empty;k++){
            cells[j-1].move(ev);
            j=j+1;
            moved=true;
          }
        }
        empty=0;
      }
      combined=combine(ev,i);
      if(combined) moved=true;
      }
      }
    }
    return moved;//returning whether movement or merging has happened
  }
  //merging function
  function combine(ev,start){
    if(ev==40){//combine down
      for(var i=start;i>start-12;i-=4){//from start upwards
        if(cells[i-1].hasOwnProperty("value")&&cells[i-1].value==cells[i-5].value){//if cell & upper cell are equal
          cells[i-5]=0;//emptying upper cell
          cells[i-1].value*=2;//doubling the original cell
          score+=cells[i-1].value;
          if(cells[i-1].value==2048){
            won=true;//set won to true if 2048 is formed
          }
          return true;//return true on any merge
        }
      }
    } else if(ev==38){//combine up in similar fasion
      for(var i=start;i<start+12;i+=4){
        if(cells[i-1].hasOwnProperty("value")&&cells[i-1].value==cells[i+3].value){
          cells[i+3]=0;
          cells[i-1].value*=2;
          score+=cells[i-1].value;
          if(cells[i-1].value==2048){
            won=true;
          }
          return true;
        }
      }
    } else if(ev==37){//combine left in similar fasion
      for(var i=start;i<start+3;i++){
        if(cells[i-1].hasOwnProperty("value")&&cells[i-1].value==cells[i].value){
          cells[i]=0;
          cells[i-1].value*=2;
          score+=cells[i-1].value;
          if(cells[i-1].value==2048){
            won=true;
          }
          return true;
        }
      }
    } else if(ev==39){//combine right in similar fasion
      for(var i=start;i>start-3;i--){
        if(cells[i-1].hasOwnProperty("value")&&cells[i-1].value==cells[i-2].value){
          cells[i-2]=0;
          cells[i-1].value*=2;
          score+=cells[i-1].value;
          if(cells[i-1].value==2048){
            won=true;
          }
          return true;
        }
      }
    }
    return false;//return false if not merged
  }
  //function to check if a cell is empty or not
  function isEmpty(cellNo){
    return cells[cellNo-1]==0;
  }
  //function to check if all cells are filled
  function allFilled(start,end){
    for(var i=start;i<=end;i++){
      if(cells[i-1]==0){
        return false;//return false if any cell is empty
      }
    }
    return true;
  }
  //function to check if there is no merge possible 
  function noMatch(){
    for(var i=0;i<15;i++){
      if(cells[i].hasOwnProperty("value")&&(((i+1)%4!=0&&cells[i].value==cells[i+1].value)||(i<12&&cells[i].value==cells[i+4].value))){
        return false;
      }
    }
    return true;
  }
  //function to show alert on win or game over
  function showalert(message,btntxt){
  $(".message").html(message);
  $(".continue").text(btntxt);
  $(".alertbox").addClass("show");
  }
  //function for coninue button onlick 
  $(".continue").click(function(){
    $(".alertbox").removeClass("show");//hiding the alert box
    if(won){
      won=false;//continue playing on win
      $(".continue").text("New Game");
    }
    else {
      cells=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//if try again on game over setting all cells empty
      yloc=0,xloc=0;
      score=0;
      init();//calling the initialize funtion 
    }
  });
  //function to generate random integer in a range
  function randInt(from,to){
    return Math.floor(Math.random()*(to-from))+from;
  }
});