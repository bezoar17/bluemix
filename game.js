/****************************************
		Game file for Tessellate
		         By
		       bezoar17
		https://github.com/bezoar17/                
****************************************/
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomPos(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
* Helper Jquery function for replacing \n to <br> tag
*
*/
$.fn.multiline = function(text)
{
    this.text(text);
    this.html(text.replace(/\n/g,'<br/>'));
    return this;
}
/**
* Initialization of the levels
*
*/
var levels=[];
function new_level(level_no,columns,rows,no_of_tiles)
{
	this.level_no=level_no;
	this.rows=rows;
	this.columns=columns;
	this.no_of_tiles=no_of_tiles;
}

levels.push(new new_level(0,0,0,5));//dummy
levels.push(new new_level(1,4,4,6));
levels.push(new new_level(2,4,5,7));
levels.push(new new_level(3,4,5,8));
levels.push(new new_level(4,4,5,9));
levels.push(new new_level(5,4,5,10));
levels.push(new new_level(6,4,5,11));
levels.push(new new_level(7,5,6,12));
levels.push(new new_level(8,5,6,13));
levels.push(new new_level(9,5,6,14));
levels.push(new new_level(10,6,6,15));
levels.push(new new_level(11,6,6,16));
levels.push(new new_level(12,6,6,17));
levels.push(new new_level(13,6,6,18));
levels.push(new new_level(14,6,6,19));
levels.push(new new_level(15,6,6,20));

//Game variables to be monitored 
var score=0;
var audio_playing;
var game_over=false;
var ans_tiles;
var turns;
var current_level;
var random_colour;
var done_tiles;
var hints=4;

//selecting the drawing canvas
var canvas = new fabric.Canvas('c');

/**
* Intitializing the 4 four fonts to be randomized
*
*/
var fonts=[];
fonts.push('Comfortaa','Orbitron','Eater','Quicksand');
/**
* Intitializing the tile colour combinations to be randomized
*
*/
var tile_colours=[];
function new_colour(colour1,colour2)
{
	this.colour1=colour1;
	this.colour2=colour2;
}
tile_colours.push(new new_colour('#FF5714','#6EEB83'));
tile_colours.push(new new_colour('#50514F','#70C1B3'));
tile_colours.push(new new_colour('#FFBF00','#FFFFFF'));
tile_colours.push(new new_colour('#FF686B','#FFFFFF'));
tile_colours.push(new new_colour('#0B132B','#6FFFE9'));
tile_colours.push(new new_colour('#083D77','#F95738'));
tile_colours.push(new new_colour('#0B132B','#6FFFE9'));
tile_colours.push(new new_colour('#513B56','#BCE784'));
tile_colours.push(new new_colour('#42D9C8','#931621'));

/**
* The reload button animation code
*
*/
var reloadButton  = document.querySelector( '.reload' );
var reloadSvg     = document.querySelector( 'svg' );
var reloadEnabled = true;
var rotation      = 0;

/**
* Event handler for reload button's click
*
*/
$("#reload_button").click(function()
	{
		reloadClick();		
	});
/**
* Event handler for hint button's click
*
*/
$("#hint_button").click(function()
{
	if(hints!=0)
		hint_turn(take_input); //call the hint handler i hints are remaining
	else
		end_game(); //end the game if no hints left
});
/**
* Function for handling the click event on reload button
*
*/
function reloadClick()
	{
		  //animation of the reload button
		  reloadEnabled = false;
		  rotation -= 180;  
		  // Eh, this works.
		  reloadSvg.style.webkitTransform = 'translateZ(0px) rotateZ( ' + rotation + 'deg )';
		  reloadSvg.style.MozTransform  = 'translateZ(0px) rotateZ( ' + rotation + 'deg )';
		  reloadSvg.style.transform  = 'translateZ(0px) rotateZ( ' + rotation + 'deg )';
		  if(hints!=0)
		  {
			  	//reducing points for reloading
			  	if(current_level!=1)
						 	score=score-200-(current_level-1)*1000;
				//end of points
			  	setTimeout(function() 
			  	{
			    	level_show(levels[current_level]);
				}, 400);	
		  }
		  else
		  {
		  		//hints are over and then reload is clicked
			  	if(game_over==false)
			  		end_game();		//If game has not ended end game. 
			  	else
			  		new_game();		//If game has ended , start a new game
		  }	  
	}
/**
*
*
*/
function end_game()
	{
		//Ending a game
		canvas.clear();
		canvas.off('mouse:down');$("#hint_button").hide();
		//show game over ,score and replay sign;
		$("#levelsh").css({'font-family':fonts[getRandomPos(0,3)]});
		$("#levelsh").css({'line-height':'90%'});
		$("#levelsh").multiline("Game Over\n"+"Score"+score+"\n<small>"+"Click to start a new game."+"</small>");
		$("#levelsh").fadeIn("slow");$("#reload_button").fadeIn();$("#hint_button").css({'left':'85%'});
		//set game_over to true
		game_over=true;
	}

/**
*
*
*/
function new_game()
	{
		//New game started , initialize the game variables and goto Start page
		score=0;hints=4;game_over=false;
	  	canvas.clear();
	  	$("#levelsh").hide();
		$("#reload_button").hide();
		$("#hint_button").hide();
		$('body').css('background-image','url("back_default.jpg")');
		$("#startbutton").fadeIn();	//Show the start button , this actually starts a new game
	}
/**
*
*
*/
function level_show(level)
	{	
		//Hide the reload and the hint buttons before showing the level
		$("#reload_button").hide();
		$("#hint_button").hide();
		//If hints are over , new level is not loaded.
		if(hints==0) end_game();
		else
		{	
			//Hints not over
			canvas.clear();
			canvas.calcOffset();

			//Background generation
			var random_check=Math.floor(Math.random()*100);
			if(random_check%2==0)
			{
				var pattern = Trianglify({
			        width:window.innerWidth, 
			        height: window.innerHeight        
			    });
				$('body').css('background-image','url("'+pattern.png()+'")');
			}
			else
			{
				var gen=Math.random().toString(36).substring(7);
		 	   	var pattern = GeoPattern.generate(gen);
			    $('body').css('background-image',pattern.toDataUrl());
			}

			//Setting the current_level variable
			current_level=level.level_no;
			//Calculating score based on level
			score = score + (current_level-1)*1000;
			//Ensuring score does not drop below 0 (if player fails at level 1 many times)
			if(score<0) score=0;
			//random font
			$("#levelsh").css({'font-family':fonts[getRandomPos(0,3)]});
			//Show the level and the score
			$("#levelsh").multiline("<small>"+"Level "+current_level+"\n"+level.no_of_tiles+" Tiles\n"+"Score "+score+"</small>");
			//Animating the level and score with callbacks
			$("#levelsh").fadeIn("fast",function()
				{
					setTimeout(function()
						{ 
							$("#levelsh").fadeOut("slow",function()
								{
									pre_show(level);// Tiles for the level are calculated
								});
					    },2000);
				});	
		}		
	}
/**
*
*
*/
function pre_show(level)
	{
		canvas.clear();
		//Set canvas width acc. to level(no. of tiles)  
		canvas.setWidth(55*level.columns+5);
		canvas.setHeight(55*level.rows+5);
		canvas.calcOffset();
		//Disabling mouse event on canvas to prevent unneccessary inputs
		canvas.off('mouse:down');		
		//calculate position of tiles
		ans_tiles=[];var rand;
		while(ans_tiles.length!=level.no_of_tiles)
		{
			rand=getRandomPos(1,level.rows*level.columns);
			if(ans_tiles.indexOf(rand)==-1)
				ans_tiles.push(rand);
		}
		show(level);// Show the tiles
	}
/**
*
*
*/
function show(level)
	{
		//actually show for some time x then wait for input;
		var l,t,tile;
		for (var i = 1; i <=level.rows*level.columns; i++) 
			{
				//adding a nw property to the rectangle object of fabric js, a tile no. based on row and column position
				var tile = new fabric.Rect({width:50,height:50});
				tile.toObject = (function(toObject) {
				  return function() {
				    return fabric.util.object.extend(toObject.call(this), {
				      tile_number: this.tile_number
				    });
				  };
				})(tile.toObject);
				//Setting the new tile_number property's value
				tile.tile_number=i;
				//Setting the position of the tile based on the tile no. (i.e setting the row and the column for the tile)
				if(i%level.columns==0)
					{l=(level.columns-1)*55;t=(Math.floor(i/level.columns)-1)*55;}
				else
					{l=(i%level.columns-1)*55;t=Math.floor(i/level.columns)*55;}
				if(ans_tiles.indexOf(i)==-1)
						tile.set('fill',tile_colours[random_colour].colour1);
				else
						tile.set('fill',tile_colours[random_colour].colour2);
				tile.set({left:l+25+5,top:t+25+5,originX:'center',originY:'center'});
				tile.selectable=false;
				canvas.add(tile);
			};
		//showing the tiles
		canvas.renderAll();	
		setTimeout(function()
			{ 
				take_input(level);					// Now the inputs can be taken after a timeout specified below
			},level.no_of_tiles*200+500);			// The timeouts are acc. to the level being loaded
	}
/**
*
*
*/
function take_input(level)
	{
		//Showing the remaining no. of hints
		if(hints!=0) 
			{
				if(hints!=1)
					$("#hint_button").text("Hints ("+(hints)+")");
				else
					$("#hint_button").text("Last Hint");
			}
		else 
			{$("#hint_button").text("Game Over");}			// If hints are over end the game
		if(level.no_of_tiles==ans_tiles.length)				//Level just initialized, i.e function called from show() not from hint_turn()
			{
				//first time intialization
				turns=level.no_of_tiles;
				done_tiles=[];
			}
		
		$(".canvas-container").css('pointer-events','none');	//critical section below, pointer events disabled
		/******      CRITICAL SECTION  ends at line 348   *****/
		for (var i = 0; i < ans_tiles.length; i++) 
			{
				//turning the pattern tiles
				if(i==ans_tiles.length-1)
					{
						//for the last tile animation for colour changing using (opacity-->0 , colour change , opacity -->1) added as callback
						canvas.item(ans_tiles[i]-1).animate('opacity', 1, {onChange: canvas.renderAll.bind(canvas),duration:100,onComplete:function()
							{ 
								for (var i = 0; i < ans_tiles.length; i++) 
								{
									canvas.item(ans_tiles[i]-1).set({opacity:1,fill:tile_colours[random_colour].colour1});							
								};
						 		canvas.renderAll();
								if(level.no_of_tiles==ans_tiles.length)
									{
										$("#reload_button").show();
										$("#hint_button").css({'left':'85%'});
										$("#hint_button").show();
									}
								//critical ends, pointer events enabled
								$(".canvas-container").css('pointer-events','auto');
					        }});
					}
					else
					{canvas.item(ans_tiles[i]-1).animate('opacity', 0, {onChange: canvas.renderAll.bind(canvas),duration:100});}			
			};		
		canvas.renderAll();
		canvas.on('mouse:down', function(options) 
		{	  
		  
		  $(".canvas-container").css('pointer-events','none');    //critical section below, pointer events disabled  
		  /******      CRITICAL SECTION  ends at line 473   *****/
		  if (options.target) 
		  {
		  	if(turns==level.no_of_tiles)
		  		{
		  			$("#reload_button").hide();
		  			$("#hint_button").css({'left':'50%'});//if one input received reload option vanishes
		  		}
		  	if(options.target.type=='rect')
		    {
		    	var pos=ans_tiles.indexOf(options.target.tile_number);
		    	if(pos==-1 && done_tiles.indexOf(options.target.tile_number)==-1)
			    	{
			    		//flash a cross as the input is a wrong answer
			    		// $("#input_res").fadeIn(300,function(){$("#input_res").fadeOut("fast");});
			    		//change colour of the tile for wrong input,thats it.
			    		options.target.set('fill','#FF4F00');
								  		fabric.Image.fromURL('cross.png', function(oImg) 
								  		{
								  		  oImg.left=options.target.left;
								  		  oImg.top=options.target.top;
								  		  oImg.originY='center';
								  		  oImg.originX='center';
								  		  oImg.scale(1.2);
								  		  oImg.selectable=false;
										  canvas.add(oImg);//image is not considered an object
										});
						canvas.renderAll();	
				  		// Materialize.toast('Wrong Tile',500);
			    		turns--;			//reduce the no. of turns left
			    	}
		    	else
			    	{
			    		//Correct answer
			    		var random_rotation;
			    		random_rotation=Math.floor(Math.random()*100);
			    		if(random_rotation%2==0)
			    			random_rotation=-1;
			    		else
			    			random_rotation=+1;
			    		//correct answer and not previously pressed
			    		if(done_tiles.indexOf(options.target.tile_number)==-1 && done_tiles.length!=level.no_of_tiles-1)
			    		{
				    		turns--;		//reduce the no. of turns left
				    		options.target.animate('angle', random_rotation*180, 
					    		{
								  onChange: canvas.renderAll.bind(canvas),
								  duration: 200,
								  onComplete: function(){options.target.set('fill',tile_colours[random_colour].colour2);
								  canvas.renderAll();}
								});
							canvas.renderAll();
							done_tiles.push(ans_tiles[pos]);
							ans_tiles.splice(pos,1);
						}
						//last correct tile, turns green
						if(done_tiles.indexOf(options.target.tile_number)==-1 && done_tiles.length==level.no_of_tiles-1)
			    		{
				    		turns--;		//reduce the no. of turns left
				    		options.target.animate('angle', random_rotation*180, 
					    		{
								  onChange: canvas.renderAll.bind(canvas),
								  duration: 200,
								  onComplete: function()
								  	{
								  		options.target.set('fill','#32CD32');
								  		fabric.Image.fromURL('check.png', function(oImg) 
								  		{
								  		  oImg.left=options.target.left;
								  		  oImg.top=options.target.top;
								  		  oImg.originY='center';
								  		  oImg.originX='center';
								  		  oImg.scale(1.2);
								  		  oImg.selectable=false;
										  canvas.add(oImg);
										});
										//image is not considered an object
								  		canvas.renderAll();
								  	}
								});
							canvas.renderAll();
							done_tiles.push(ans_tiles[pos]);
							ans_tiles.splice(pos,1);
						}	    		
			    	}
		    	if(turns==0)
		    	{	
		    		//Turns over
		    		if(ans_tiles.length==0)		//Correct answer , goto next level
						setTimeout(function(){ level_show(levels[level.level_no+1]);},2000);
					else
					{
					 //Wrong answer show the remaining tiles			
					 while(ans_tiles.length)
					 {
					 	//change the colour
					 	canvas.item(ans_tiles[0]-1).set({opacity:1,fill:tile_colours[random_colour].colour2});
					 	ans_tiles.splice(0,1);				 	
					 }
					 canvas.renderAll();
					 //Penalty on the score and goto previous level if possible(user fails at level 1 , remains at level 1)
					 if(level.level_no!=1)
					 {
					 	if(level.level_no==2) score=score-500;
					 	else score=score-500-1000*(current_level-2);
					 	setTimeout(function(){ level_show(levels[level.level_no-1]);},2000);
					 }
					 else
					 setTimeout(function(){ level_show(levels[1]);},2000);
					}
		    	}
		    }
		  }
		  //critical ends, pointer events enabled
		  if(turns!=0)$(".canvas-container").css('pointer-events','auto');    
		});	
	}

function hint_turn(take_input)
	{
		canvas.off('mouse:down');		//Disable the pointer events on canvas , so that user does not click while correct tiles are showing.
		for (var i = 0; i < ans_tiles.length; i++) 		//Animate the remaining tiles to pattern colour
			{
				if(i==ans_tiles.length-1)
					{
						canvas.item(ans_tiles[i]-1).animate('opacity', 0, {onChange: canvas.renderAll.bind(canvas),duration:200,onComplete:function()
							{ 
								for (var i = 0; i < ans_tiles.length; i++) 
								 {
									canvas.item(ans_tiles[i]-1).set({opacity:1,fill:tile_colours[random_colour].colour2});
								 };
						 		 canvas.renderAll();
						    }});
					}
				else
					{canvas.item(ans_tiles[i]-1).animate('opacity', 0, {onChange: canvas.renderAll.bind(canvas),duration:200});}			
			};
		canvas.renderAll();
		hints--;				//Reduce no. of remaining hints
		setTimeout(function()
			{
				take_input(levels[current_level]);		//Start the inputs events by calling take_input() , take_input will flip the pattern tiles.
			},levels[current_level].no_of_tiles*200+500);	//Timeout or duration for hint is acc. to level and same as the beginning of the level
	}

$(function()
	{
			// Vars
		document.getElementById('player').volume=.2;
		$('#player_button').click(function() 		// Toggle play and pause
		  {
		  	  $(this).toggleClass("waves-green");	// Change the ripple colour for play and pause
		  	  $(this).toggleClass("waves-red");		
		      if (audio_playing == false) 
		      {
		        document.getElementById('player').play();
		        audio_playing = true;
		      } 
		      else 
		      {
		        document.getElementById('player').pause();
		        audio_playing = false;
		      }
		  });
		document.getElementById('player').play();	//Start the music automatically on load of page
		audio_playing=true;

		$("#input_res").hide();			//The flash in the middle , currently remains hidden forever.
		$("#reload_button").hide();		//Initially hide the buttons
		$("#hint_button").hide();		
		$("#startbutton").click(function()	//The start button's event handler
			{
				$("#startbutton").fadeOut("slow",function()
					{
						random_colour=getRandomPos(0,8); //Get's a random colour for the new game
						level_show(levels[1]);			 //Starts a new game on level 1
					});
			});	
	});
