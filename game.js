$(document).ready(function () {
    //initilization with zero values for all cells
    var cells = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var yloc = 0,
        xloc = 0;
    var score = (localStorage.getItem("score") == undefined) ? 0 : Math.round(localStorage.getItem("score"));
    var topscore = (localStorage.getItem("topscore") == undefined) ? 0 : Math.round(localStorage.getItem("topscore"));
    var rapidmode = true;
    var won = false;
    //creating emptycells
    for (var i = 0; i < 16; i++) {
        var xloc = ((i) % 4) * 110;
        var yloc = Math.floor((i) / 4) * 110;
        $(".wrapper").append("<div class='emptycell emp" + i + "'></div>");
        $(".emp" + i).css("transform", "translate(" + xloc + "px," + yloc + "px)");
    }
    //Initialization function with 2 random cells with 2
    function init() {
        if (localStorage.getItem('cells') == undefined) {
            var a1 = randInt(1, 16),
                a2 = randInt(1, 16);
            while (a1 == a2) {
                a2 = randInt(1, 16);
            }
            cells[a1 - 1] = 2;
            cells[a2 - 1] = 2;
        } else {
            cells = JSON.parse(localStorage.getItem('cells'));
        }
        drawAll();
    }

    init(); //initialize

    //Function for swipe handler using touchSwipe jquery framework
    $(window).swipe({
        //Generic swipe handler for all directions
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (direction == "left") {
                act(37);
            } else if (direction == "up") {
                act(38);
            } else if (direction == "right") {
                act(39);
            } else if (direction == "down") {
                act(40);
            }
        }
    });

    //Key Events function
    $(window).on("keydown", function (ev) {
        act(ev.which);
    });

    //Action function on keypress & swipe event
    function act(ev) {
        if (shift(ev)) { //check if any shift or movement happend in a direction or any cells merged
            //getting indices of zero values or empty cells of cells array into idx & selecting any random value
            var zeros = [];
            var idx = cells.indexOf(0);
            while (idx != -1) {
                zeros.push(idx);
                idx = cells.indexOf(0, idx + 1);
            }
            idx = zeros[Math.floor(Math.random() * zeros.length)];
            var chanceOf4 = Math.random(); //chance of appearing four
            if (chanceOf4 < 0.1) { //10% times create 4
                cells[idx] = 4;
            } else cells[idx] = 2; //90% times create new cell with 2
        }
        setTimeout(function () {
            redraw();
        }, 150); //redrawing the modified cells
    }
    function drawAll(){
        $(".board").html(""); //emptying the board
        for (var i = 0; i < cells.length; i++) {
            if (cells[i] != 0) {
                var index = i + 1;
                var xloc = ((index - 1) % 4) * 110; //calculating x pos
                var yloc = Math.floor((index - 1) / 4) * 110; //calculating y pos
                $(".board").append("<div class='cell " + index + " " + getcolorclass(cells[i]) + "'>" + cells[i] + "</div>"); //creating div
                $("." + index).css("transform", "translate(" + xloc + "px," + yloc + "px)"); //positioning the div
            }
        }
    }
    function redraw() {
        drawAll();
        $(".score").text(score);
        $(".topscore").text(topscore); //display score
        localStorage.setItem("score", score);
        localStorage.setItem("topscore", topscore);
        localStorage.setItem('cells', JSON.stringify(cells));
        //check if won
        if (won) {
            showalert("Congrats You win!!", "Continue");
        }
        //check for game over
        if (allFilled(1, 16) && noMatch()) { //conditions are all filled & nomatch for merging
            showalert("Game Over!!", "Play Again");
        }
    }
    //movement function
    function shift(ev) {
        var moved = false;
        if (ev == 40) { //shifting down
            var empty = 0;
            for (var i = 13; i <= 16; i++) { //iterating over columns
                var j = i;
                var combined = false;

                function godown() {
                    for (var l = i; l >= i - 12; l -= 4) { //iterating over cells in a column
                        for (j = l; j >= i - 12 && isEmpty(j); j -= 4) { //checking empty cells below each non empty cell
                            empty++; //storing num of empty cells
                        }
                        if (j >= i - 12 && empty > 0 && empty < 4) { //if any empty cell
                            //move upto num of empty cell
                            cells[j - 1 + 4 * empty] = cells[j - 1];
                            TweenMax.to(".cell." + j, 0.1, {
                                css: {
                                    marginTop: 110 * empty + "px"
                                },
                                ease: Power1.easeIn
                            });
                            $(".cell."+j).addClass(j+4*empty).removeClass(j);
                            cells[j - 1] = 0;
                            moved = true; ////setting moved to true if movement happend
                        }
                        empty = 0;
                    }
                }
                do { //checking whether any cell have been merged then continue movement on that col
                    godown();
                    combined = combine(ev, i); //checking for merge possibility & merfing
                    if (combined) moved = true; //setting moved to true if combined
                } while (combined & rapidmode);
                godown();
            }
        }
        if (ev == 38) { //shifting up in similar fasion
            var empty = 0;
            for (var i = 1; i <= 4; i++) {
                var j;
                var combined = false;

                function goup() {
                    for (var l = i; l <= i + 12; l += 4) {
                        for (j = l; j <= i + 12 && isEmpty(j); j += 4) {
                            empty++;
                        }
                        if (j <= i + 12 && empty > 0 && empty < 4) {
                            cells[j - 1 - 4 * empty] = cells[j - 1];
                            TweenMax.to(".cell." + j, 0.1, {
                                css: {
                                    marginTop: -110 * empty + "px"
                                },
                                ease: Power1.easeIn
                            });
                            $(".cell."+j).addClass(j-4*empty).removeClass(j);
                            cells[j - 1] = 0;
                            moved = true;
                        }
                        empty = 0;
                    }
                }
                do {
                    goup();
                    combined = combine(ev, i);
                    if (combined) moved = true;
                } while (combined & rapidmode);
                goup();
            }
        }
        if (ev == 37) { //shifting left in similar fasion
            var empty = 0;
            for (var i = 1; i <= 13; i += 4) {
                var j;
                var combined = false;

                function goleft() {
                    for (var l = i; l <= i + 3; l++) {
                        for (j = l; j <= i + 3 && isEmpty(j); j++) {
                            empty++;
                        }
                        if (j <= i + 3 && empty > 0 && empty < 4) {
                            cells[j - 1 - empty] = cells[j - 1];
                            TweenMax.to(".cell." + j, 0.1, {
                                css: {
                                    marginLeft: -110 * empty + "px"
                                },
                                ease: Power1.easeIn
                            });
                            $(".cell."+j).addClass(j-empty).removeClass(j);
                            cells[j - 1] = 0;
                            moved = true;
                        }
                        empty = 0;
                    }
                }
                do {
                    goleft();
                    combined = combine(ev, i);
                    if (combined) moved = true;
                } while (combined & rapidmode);
                goleft();
            }
        }
        if (ev == 39) { //shifting right in similar fasion
            var empty = 0;
            for (var i = 4; i <= 16; i += 4) {
                var j;
                var combined = false;

                function goright() {
                    for (var l = i; l >= i - 3; l--) {
                        for (j = l; j >= i - 3 && isEmpty(j); j--) {
                            empty++;
                        }
                        if (j >= i - 3 && empty > 0 && empty < 4) {
                            cells[j - 1 + empty] = cells[j - 1];
                            TweenMax.to(".cell." + j, 0.1, {
                                css: {
                                    marginLeft: 110 * empty + "px"
                                },
                                ease: Power1.easeIn
                            });
                            $(".cell."+j).addClass(j+empty).removeClass(j);
                            cells[j - 1] = 0;
                            moved = true;
                        }
                        empty = 0;
                    }
                }
                do {
                    goright();
                    combined = combine(ev, i);
                    if (combined) moved = true;
                } while (combined & rapidmode);
                goright();
            }
        }
        return moved; //returning whether movement or merging has happened
    }
    //merging function
    function combine(ev, start) {
        if (ev == 40) { //combine down
            for (var i = start; i > start - 12; i -= 4) { //from start upwards
                if (cells[i - 1] != 0 && cells[i - 1] == cells[i - 5]) { //if cell & upper cell are equal
                    cells[i - 5] = 0; //emptying upper cell
                    TweenMax.to(".cell."+(i-4),0.1,{css:{marginTop:110+"px",opacity:0.2},ease:Power1.easeIn});
                    $(".cell."+i).removeClass(getcolorclass(cells[i-1]));
                    cells[i - 1] *= 2; //doubling the original cell
                    $(".cell."+i).addClass(getcolorclass(cells[i-1]));
                    setTimeout(function(){$(".cell."+(i-4)).remove();},100);
                    score += cells[i - 1];
                    topscore = (score > topscore) ? score : topscore;
                    if (cells[i - 1] == 2048) {
                        won = true; //set won to true if 2048 is formed
                    }
                    return true; //return true on any merge
                }
            }
        } else if (ev == 38) { //combine up in similar fasion
            for (var i = start; i < start + 12; i += 4) {
                if (cells[i - 1] != 0 && cells[i - 1] == cells[i + 3]) {
                    cells[i + 3] = 0;
                    TweenMax.to(".cell."+(i+4),0.1,{css:{marginTop:-110+"px",opacity:0.2},ease:Power1.easeIn});
                    $(".cell."+i).removeClass(getcolorclass(cells[i-1]));
                    cells[i - 1] *= 2; //doubling the original cell
                    $(".cell."+i).addClass(getcolorclass(cells[i-1]));
                    setTimeout(function(){$(".cell."+(i+4)).remove();},100);
                    score += cells[i - 1];
                    topscore = (score > topscore) ? score : topscore;
                    if (cells[i - 1] == 2048) {
                        won = true;
                    }
                    return true;
                }
            }
        } else if (ev == 37) { //combine left in similar fasion
            for (var i = start; i < start + 3; i++) {
                if (cells[i - 1] != 0 && cells[i - 1] == cells[i]) {
                    cells[i] = 0;
                    TweenMax.to(".cell."+i+1,0.1,{css:{marginLeft:-110+"px",opacity:0.2},ease:Power1.easeIn});
                    $(".cell."+i).removeClass(getcolorclass(cells[i-1]));
                    cells[i - 1] *= 2; //doubling the original cell
                    $(".cell."+i).addClass(getcolorclass(cells[i-1]));
                    setTimeout(function(){$(".cell."+(i+1)).remove();},100);
                    score += cells[i - 1];
                    topscore = (score > topscore) ? score : topscore;
                    if (cells[i - 1] == 2048) {
                        won = true;
                    }
                    return true;
                }
            }
        } else if (ev == 39) { //combine right in similar fasion
            for (var i = start; i > start - 3; i--) {
                if (cells[i - 1] != 0 && cells[i - 1] == cells[i - 2]) {
                    cells[i - 2] = 0;
                    TweenMax.to(".cell."+(i-1),0.1,{css:{marginLeft:110+"px",opacity:0.2},ease:Power1.easeIn});
                    $(".cell."+i).removeClass(getcolorclass(cells[i-1]));
                    cells[i - 1] *= 2; //doubling the original cell
                    $(".cell."+i).addClass(getcolorclass(cells[i-1]));
                    setTimeout(function(){$(".cell."+(i-1)).remove();},100);
                    score += cells[i - 1];
                    topscore = (score > topscore) ? score : topscore;
                    if (cells[i - 1] == 2048) {
                        won = true;
                    }
                    return true;
                }
            }
        }
        return false; //return false if not merged
    }
    //function to check if a cell is empty or not
    function isEmpty(cellNo) {
        return cells[cellNo - 1] == 0;
    }
    //function to check if all cells are filled
    function allFilled(start, end) {
        for (var i = start; i <= end; i++) {
            if (cells[i - 1] == 0) {
                return false; //return false if any cell is empty
            }
        }
        return true;
    }
    //function to check if there is no merge possible
    function noMatch() {
        for (var i = 0; i < 15; i++) {
            if (cells[i] != 0 && (((i + 1) % 4 != 0 && cells[i] == cells[i + 1]) || (i < 12 && cells[i] == cells[i + 4]))) {
                return false;
            }
        }
        return true;
    }

    //function to show alert on win or game over
    function showalert(message, btntxt) {
        $(".message").html(message);
        $("#continue").text(btntxt);
        $(".alertbox").addClass("show");
        $("#continue").addClass("show");
        $(".message").addClass("show");
    }
    //function for coninue button onlick
    $("#continue").click(function () {
        $(".alertbox").removeClass("show"); //hiding the alert box
        $("#continue").removeClass("show");
        $(".message").removeClass("show");
        if (won) {
            won = false; //continue playing on win
            $("#continue").text("New Game");
        } else {
            restart();
        }
    });
    $(".mode-toggle").click(function () {
        $(this).addClass("btn-selected");
        if ($(this).attr("id") == "normal-mode") {
            rapidmode = false;
            $("#rapid-mode").removeClass("btn-selected");
        } else if ($(this).attr("id") == "rapid-mode") {
            rapidmode = true;
            $("#normal-mode").removeClass("btn-selected");
        }
    });
    $("#newgame").click(function () {
        restart();
    });
    //function to get colors & font class
    function getcolorclass(cell) {
        var cclass="large";
        if (cell == 2) {
            cclass = "two";
        } else if (cell == 4) {
            cclass = "four";
        } else if (cell == 8) {
            cclass = "eight";
        } else if (cell == 16) {
            cclass = "sixteen";
        } else if (cell == 32) {
            cclass = "thirtyTwo";
        } else if (cell == 64) {
            cclass = "sixtyFour";
        } else if (cell == 128) {
            cclass = "oneTwentyEight";
        } else if (cell == 256) {
            cclass = "twoFiveSix";
        } else if (cell == 512) {
            cclass = "fiveOneTwo";
        } else if (cell == 1024) {
            cclass = "one024";
        } else if (cell == 2048) {
            cclass = "two048";
        } else if (cell == 4096) {
            cclass = "four096";
        } else if (cell == 8192) {
            cclass = "eight192";
        }
        return cclass;
    }
    function restart() {
        cells = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //if try again on game over setting all cells empty
        yloc = 0, xloc = 0;
        score = 0;
        localStorage.removeItem("cells");
        localStorage.removeItem("score");
        init(); //calling the initialize funtion
    }
    //function to generate random integer in a range
    function randInt(from, to) {
        return Math.floor(Math.random() * (to - from)) + from;
    }
});