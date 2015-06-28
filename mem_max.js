/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomPos(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function new_level(level_no,columns,rows,no_of_tiles)
{
	this.level_no=level_no;
	this.rows=rows;
	this.columns=columns;
	this.no_of_tiles=no_of_tiles;
}
var levels=[];
levels.push(new new_level(0,0,0,5));//dummy
levels.push(new new_level(1,4,4,6));
levels.push(new new_level(2,4,5,7));
levels.push(new new_level(3,4,5,8));
levels.push(new new_level(4,4,5,9));
levels.push(new new_level(5,4,5,10));
levels.push(new new_level(6,4,5,11));
levels.push(new new_level(7,5,7,12));
levels.push(new new_level(8,5,7,13));
levels.push(new new_level(9,5,7,14));
levels.push(new new_level(10,6,7,15));
levels.push(new new_level(11,6,7,16));
levels.push(new new_level(12,6,7,17));
levels.push(new new_level(13,6,7,18));
levels.push(new new_level(14,6,7,19));
levels.push(new new_level(15,6,7,20));

var score=0;
var canvas = new fabric.Canvas('c');
//goto line 8424 for changing the style 
var ans_tiles;var turns;
var current_level;var random_colour;
var tile_colours=[];var done_tiles;
var fonts=[];
fonts.push('Comfortaa');
fonts.push('Orbitron');
fonts.push('Eater');
fonts.push('Quicksand');
var hints=4;
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
var reloadButton  = document.querySelector( '.reload' );
	var reloadSvg     = document.querySelector( 'svg' );
	var reloadEnabled = true;
	var rotation      = 0;
	// Events
	$("#reload_button").click(function(){
		reloadClick();		
	});
$("#hint_button").click(function()
{
	if(hints!=0)
	{
		//reducing points for reloading
	  	// if(current_level!=1)
				//  {
				//  	score=score-1250;
				//  }
		//end of points
		hint_turn(take_input);
	}
	else
	{
		//gameover
		end_game();
	}	
});
// Functions
function reloadClick() 
	{
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
				 {
				 	score=score-200-(current_level-1)*1000;
				 }
		//end of points
	  	setTimeout(function() {
	    level_show(levels[current_level]);
							}, 400);	
	  }
	  else
	  {
	  	score=0;hints=4;
	  	canvas.clear();
	  	$("#levelsh").hide();
		$("#reload_button").hide();
		$("#hint_button").hide();
		$('body').css('background-image','url("back_default.jpg")');
		$("#startbutton").fadeIn();
	  }
	  
	}
 
$.fn.multiline = function(text){
    this.text(text);
    this.html(text.replace(/\n/g,'<br/>'));
    return this;
}
function level_show(level)
{	
	//Background generation
	$("#reload_button").hide();
	$("#hint_button").hide();
	canvas.clear();
	canvas.calcOffset();
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
	current_level=level.level_no;
	score = score + (current_level-1)*1000;	
	if(score<0) score=0;
	//random font
	$("#levelsh").css({'font-family':fonts[getRandomPos(0,3)]});
	$("#levelsh").multiline("<small>"+"Level "+current_level+"\n"+level.no_of_tiles+" Tiles\n"+"Score "+score+"</small>");
	$("#levelsh").fadeIn("fast",function(){setTimeout(function(){ $("#levelsh").fadeOut("slow",function(){pre_show(level);});},2000);});	
	
}
function pre_show(level)
{
	canvas.clear();
	// canvas.backgroundColor = "rgba(256,256,256,0.8)";
	//calculate positions based on level 
	canvas.setWidth(55*level.columns+5);
	canvas.setHeight(55*level.rows+5);
	canvas.calcOffset();
	canvas.off('mouse:down');
	//show level
	ans_tiles=[];var rand;
	while(ans_tiles.length!=level.no_of_tiles)
	{
		rand=getRandomPos(1,level.rows*level.columns);
		if(ans_tiles.indexOf(rand)==-1)
			ans_tiles.push(rand);
	}
	console.log(ans_tiles);
	show(level);
}

function show(level)
{
	//actually show for some time x then wait for input;
	var l,t,tile;
	for (var i = 1; i <=level.rows*level.columns; i++) 
	{
		var tile = new fabric.Rect({width:50,height:50});
		tile.toObject = (function(toObject) {
		  return function() {
		    return fabric.util.object.extend(toObject.call(this), {
		      tile_number: this.tile_number
		    });
		  };
		})(tile.toObject);
		tile.tile_number=i;
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
	//make allcolour2
	canvas.renderAll();	
	setTimeout(function(){ take_input(level);},level.no_of_tiles*200+500);
	//take_input(level);
}
function take_input(level)
{
	//check if its ans tiles or not and increase counter for chances
	if(hints!=0) {$("#hint_button").text("Hints ("+(hints)+")");}
	else {$("#hint_button").text("Game Over");}
	if(level.no_of_tiles==ans_tiles.length)
		{
			turns=level.no_of_tiles;done_tiles=[];
		}	
	for (var i = 0; i < ans_tiles.length; i++) 
		{
			if(i==ans_tiles.length-1)
				{
					canvas.item(ans_tiles[i]-1).animate('opacity', 0, {onChange: canvas.renderAll.bind(canvas),duration:200,onComplete:function(){ 
						for (var i = 0; i < ans_tiles.length; i++) {
							canvas.item(ans_tiles[i]-1).set({opacity:1,fill:tile_colours[random_colour].colour1});
						};
					 canvas.renderAll();
					if(level.no_of_tiles==ans_tiles.length)
						{
							$("#reload_button").show();
							$("#hint_button").css({'left':'85%'});
							$("#hint_button").show();
						}

				     }});
				}
				else
				{canvas.item(ans_tiles[i]-1).animate('opacity', 0, {onChange: canvas.renderAll.bind(canvas),duration:200});}			
		};
	canvas.renderAll();
	console.log("reached");
	canvas.on('mouse:down', function(options) 
	{	  
		console.log("totally reached");
	  if (options.target) 
	  {
	  	if(turns==level.no_of_tiles)
	  		{$("#reload_button").hide();$("#hint_button").css({'left':'50%'});}//if one input received refresh option vanishes
	  	if(options.target.type=='rect')
	    {
	    	var pos=ans_tiles.indexOf(options.target.tile_number);
	    	if(pos==-1 && done_tiles.indexOf(options.target.tile_number)==-1)
	    	{
	    		//flash a cross
	    		$("#input_res").fadeIn(300,function(){$("#input_res").fadeOut("fast");});
	    		// Materialize.toast('Wrong Tile',500);
	    		turns--;
	    	}
	    	else
	    	{
	    		if(done_tiles.indexOf(options.target.tile_number)==-1)
	    		{
	    		turns--;
	    		options.target.animate('angle', 180, {
				  onChange: canvas.renderAll.bind(canvas),
				  duration: 200,
				  onComplete: function(){options.target.set('fill',tile_colours[random_colour].colour2);
				  canvas.renderAll();}
				});
				canvas.renderAll();
				done_tiles.push(ans_tiles[pos]);
				ans_tiles.splice(pos,1);
				}	    		
	    	}
	    	if(turns==0)
	    	{	
	    		//end    
	    		if(ans_tiles.length==0)
				{
					setTimeout(function(){ level_show(levels[level.level_no+1]);},2000);					
				}
				else
				{
				 //remaining ones have to be changed				
				 while(ans_tiles.length)
				 {
				 	//animate it
				 	canvas.item(ans_tiles[0]-1).set({opacity:1,fill:tile_colours[random_colour].colour2});
				 	ans_tiles.splice(0,1);				 	
				 }
				 canvas.renderAll();
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
	});	
}
$(function()
{
		// Vars
	$("#input_res").hide();
	$("#reload_button").hide();
	$("#hint_button").hide();
	$("#startbutton").click(function(){$("#startbutton").fadeOut("slow",function(){random_colour=getRandomPos(0,8);level_show(levels[1]);});});	
	
});
function hint_turn(take_input)
{
	canvas.off('mouse:down');
	for (var i = 0; i < ans_tiles.length; i++) 
		{
			if(i==ans_tiles.length-1)
				{
					canvas.item(ans_tiles[i]-1).animate('opacity', 0, {onChange: canvas.renderAll.bind(canvas),duration:200,onComplete:function(){ 
						for (var i = 0; i < ans_tiles.length; i++) {
							canvas.item(ans_tiles[i]-1).set({opacity:1,fill:tile_colours[random_colour].colour2});
						};
					 canvas.renderAll();
					 }});
				}
				else
				{canvas.item(ans_tiles[i]-1).animate('opacity', 0, {onChange: canvas.renderAll.bind(canvas),duration:200});}			
		};
	canvas.renderAll();hints--;
	setTimeout(function(){take_input(levels[current_level]);},levels[current_level].no_of_tiles*200+500);
}
function end_game()
{
	canvas.clear();
	canvas.off('mouse:down');$("#hint_button").hide();
	//show game over ,score and replay sign;
	$("#levelsh").css({'font-family':fonts[getRandomPos(0,3)]});
	$("#levelsh").css({'line-height':'90%'});
	$("#levelsh").multiline("Game Over\n"+"Score "+score);
	$("#levelsh").fadeIn("slow");$("#reload_button").fadeIn();$("#hint_button").css({'left':'85%'});
}