window.onload = function(){
		canv = document.getElementById("game");
		ctx = canv.getContext("2d");
		document.addEventListener("keydown", keyPush);
		setInterval(game, 1000/15);
		highscore = 0;
		setup();
	}
	function setup(){
		stupidMode = false;
		score = 0;
		headCol = document.getElementById("snakeColor").value;
		tailCol = "purple";
		appleCol = document.getElementById("appleColor").value;
		xvel = yvel = 0;
		px = py = 20;
		tileCount = 40;
		ax = Math.floor(Math.random() * tileCount);
		ay = Math.floor(Math.random() * tileCount);
		play = true;
		canPush = true;
		tileSize = Math.floor(canv.width / tileCount);
		tail = [];
		tailLen = 3;
		started = false;
		grad = ctx.createRadialGradient(canv.width/2, canv.height/2, 40, canv.width/2, canv.height/2, 250);
		bgcol1 = document.getElementById("bgCol1").value;
		bgcol2 = document.getElementById("bgCol2").value;
		grad.addColorStop(0, bgcol1);
		grad.addColorStop(1, bgcol2);
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, canv.width, canv.height);
		writeSquare(appleCol, ax, ay);
		writeSquare(headCol, px, py);
		ctx.fillStyle = "black";
		ctx.font = "18px Sans-Serif";
		ctx.fillText("Score: " + score, canv.width - 100, 36);
	}

	function refresh(){
		grad = ctx.createRadialGradient(canv.width/2, canv.height/2, 40, canv.width/2, canv.height/2, 250);
		bgcol1 = document.getElementById("bgCol1").value;
		bgcol2 = document.getElementById("bgCol2").value;
		grad.addColorStop(0, bgcol1);
		grad.addColorStop(1, bgcol2);
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, canv.width, canv.height);
		headCol = document.getElementById("snakeColor").value;
		appleCol = document.getElementById("appleColor").value;
		ctx.fillStyle = "black";
		ctx.font = "18px Sans-Serif";
		ctx.fillText("Score: " + score, canv.width - 100, 36);
		writeSquare(appleCol, ax, ay);
		for(var i = 0; i < tail.length; i++){
			writeSquare(headCol, tail[i].x, tail[i].y);
		}
		if(!started){
			writeSquare(headCol, px, py);
		}
	}
	
	function game() {
		canPush = true;
		if(play && started){
			grad = ctx.createRadialGradient(canv.width/2, canv.height/2, 40, canv.width/2, canv.height/2, 250);
			grad.addColorStop(0, document.getElementById("bgCol1").value);
			grad.addColorStop(1, document.getElementById("bgCol2").value);
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = "black";
			ctx.font = "18px Sans-Serif";
			ctx.fillText("Score: " + score, canv.width - 100, 36);
			headCol = document.getElementById("snakeColor").value;
			appleCol = document.getElementById("appleColor").value;
			writeSquare(appleCol, ax, ay);
			writeSquare(headCol, px, py);
			//writeSquare(appleCol, ax, ay);
			px += xvel;
			py += yvel;
			if(px < 0 || px > tileCount || py < 0 || py > tileCount){
				lose();
			}
			if(px == ax && py == ay){
				ax = Math.floor(Math.random() * tileCount);
				ay = Math.floor(Math.random() * tileCount);
				score += 10;
				tailLen += 1;
			}
			while(tail.length > tailLen){
				tail.shift();
			}
			index = 0
			/*tail.forEach(function tF(element){
				writeSquare("blue", element.x, element.y);
				if(px == element.x && py == element.y){
					lose();
				}
			});*/
			for(var i = 0; i < tail.length; i++){
				writeSquare(headCol, tail[i].x, tail[i].y);
				if(px == tail[i].x && py == tail[i].y && (xvel != 0 || yvel != 0)){
					lose();
				}
			}
			tail.push({x:px, y:py});
		}
	}
	function lose(){
		started = false;
		ctx.fillStyle = "red";
		ctx.font = "28px Sans-Serif";
		if(score > highscore){
			ctx.fillText("New high score! ", 10, 116);
			ctx.fillText("" + score + " points!", 10, 156);
			ctx.fillText("Good job!", 10, 196);
			highscore = score
		}else{
			ctx.fillText("Your high score is:", 10, 116);
			ctx.fillText("" + highscore + " points", 10, 156);
		}
		ctx.fillText("Press r to restart.", 10, 236);
	}
	function writeSquare(col, x, y){
		ctx.fillStyle = col;
		ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
	}
	function keyPush(e){
		if(canPush){
			if(!stupidMode){
				switch(e.keyCode){
					case 37:
						if(xvel == 0){
							xvel = -1;
							yvel = 0;
							if(!started && play){
								started = true;
							}
						}
						break;
					case 38:
						if(yvel==0){
							xvel = 0;
							yvel = -1;
							if(!started && play){
								started = true;
							}
						}
						break;
					case 39:
						if(xvel == 0){
							xvel = 1;
							yvel = 0;
							if(!started && play){
								started = true;
							}
						}
						break;
					case 40:
						if(yvel==0){
							xvel = 0;
							yvel = 1;
							if(!started && play){
								started = true;
							}
						}
						break;
					case 82:
						setup();
						break;
					case 32:
						pause();
						break;
					case 88:
						stupidMode = true;
						break;
				}
			}else{
				switch(e.keyCode){
					case 37:
						xvel -= 1;
						break;
					case 38:
						yvel -= 1;
						break;
					case 39:
						xvel += 1;
						break;
					case 40:
						yvel += 1;
						break;
					case 32:
						pause();
						break;
					case 82:
						setup();
						break;
					case 88:
						stupidMode = false;
						break;
				}
			}
			canPush = false;
		}
	}
	function pause(){
		if(started){
			if(play){
				play = false;
				document.getElementById("but").innerHTML = "Play";
			}else{
				play = true;
				document.getElementById("but").innerHTML = "Pause";
			}
		}
	}