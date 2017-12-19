$(document).ready(function(){
    var cells=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
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
    var a1=randInt(1,16),a2=randInt(1,16);
    while(a1==a2){
      a2=randInt(1,16);
    }
    cells[a1-1]=new Cell(a1,2);
    cells[a2-1]=new Cell(a2,2);
    redraw();

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

    $(window).keydown(function(ev){
        act(ev.which);
    });
    function act(ev){
      redraw();
      if(shift(ev)){
      var zeros=[];
      var idx = cells.indexOf(0);        
      while(idx!=-1){
        zeros.push(idx);
        idx = cells.indexOf(0, idx + 1);        
      }
      idx=zeros[Math.floor(Math.random()*zeros.length)];
      cells[idx]=new Cell(idx+1,2);
    }
    redraw();
    }
    function redraw(){
      $(".board").html("");
      for(var i=0;i<cells.length;i++){
        if(cells[i]!=0){
        var index=i+1;
        var xloc=((index-1)%4)*110;
        var yloc=Math.floor((index-1)/4)*110;
        var cclass="two";
        setcolorclass(cells[i]);
        $(".board").append("<div class='cell "+index+" "+cclass+"'>"+cells[i].value+"</div>");
        $("."+index).css("transform","translate("+xloc+"px,"+yloc+"px)");
        $(".score").text(score);
        }
      }
      if(allFilled(1,16)&&noMatch()){
        alert("Game over");
      }
      if(won){
        alert("Congrats!!\n You Win!!\n Press ok to continue");
        won=false;
      }
      function setcolorclass(cell) {
        if (cell.value == 4) {
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
    function shift(ev){
      var moved=false;
      if(ev==40){//shifting down
        var empty=0;
        for(var i=13;i<=16;i++){
          var j=i;
          var combined=true;
          while(combined){
            combined=false;
          for(var l=i;l>=i-12;l-=4){
          for(j=l;j>=i-12&&isEmpty(j);j-=4){
            empty++;
          }
          if(j>=i-12){
            for(var k=0;k<empty;k++){
              console.log("In column:"+i+" j="+j+" cells="+cells);
              cells[j-1].move(ev);
              j=j+4;
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
      if(ev==38){//shifting up
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
              console.log("In column:"+i+" j="+j+" cells="+cells);
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
      if(ev==37){//shifting left
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
              console.log("In row:"+i+" j="+j+" cells="+cells);
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
      if(ev==39){//shifting right
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
              console.log("In row:"+i+" j="+j+" cells="+cells);
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
      return moved;
    }
    function combine(ev,start){
      if(ev==40){//combine down
        for(var i=start;i>start-12;i-=4){
          if(cells[i-1].hasOwnProperty("value")&&cells[i-1].value==cells[i-5].value){
            cells[i-5]=0;
            cells[i-1].value*=2;
            score+=cells[i-1].value;
            if(cells[i-1].value==2048){
              won=true;
            }
            return true;
          }
        }
      } else if(ev==38){//combine up
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
      } else if(ev==37){//combine left
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
      } else if(ev==39){//combine right
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
      return false;
    }
    function isEmpty(cellNo){
      return cells[cellNo-1]==0;
    }
    function allFilled(start,end){
      for(var i=start;i<=end;i++){
        if(cells[i]==0){
          return false;
        }
      }
      return true;
    }
    function noMatch(){
      for(var i=0;i<15;i++){
        if(cells[i].hasOwnProperty("value")&&(((i+1)%4!=0&&cells[i].value==cells[i+1].value)||(i<12&&cells[i].value==cells[i+4].value))){
          return false;
        }
      }
      return true;
    }
    function randInt(from,to){
      return Math.floor(Math.random()*(to-from))+from;
    }
});