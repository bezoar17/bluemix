/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomPos(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function new_level(level_no,rows,columns,no_of_tiles)
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
levels.push(new new_level(4,5,7,9));
levels.push(new new_level(5,5,7,10));
levels.push(new new_level(6,5,7,11));
levels.push(new new_level(7,5,7,12));
levels.push(new new_level(8,6,8,13));
levels.push(new new_level(9,6,8,14));
levels.push(new new_level(10,6,8,15));
levels.push(new new_level(11,6,8,16));
levels.push(new new_level(12,7,9,17));
levels.push(new new_level(13,7,9,18));
levels.push(new new_level(14,7,9,19));
levels.push(new new_level(15,7,9,20));

var show_time=1;
var canvas = new fabric.Canvas('c');
//goto line 8424 for changing the style 
var ans_tiles;var turns;
var current_level;

function level_show(level)
{	
	current_level=level.level_no;
	canvas.clear();
	canvas.calcOffset();
	var show_level = new fabric.Text("Level\n"+current_level, {
		  fontSize: 40,
		  fontFamily: 'Comic Sans',
		  fontWeight:'bold',
		  textAlign:'center',
		  lineHeight:2
		});
	show_level.selectable=false;
	canvas.add(show_level);canvas.renderAll();
	setTimeout(function(){ pre_show(level);},4000);
}
function pre_show(level)
{
	canvas.clear();
	canvas.backgroundColor = "rgba(31,31,33,0)";
	//calculate positions based on level 
	canvas.setWidth(55*level.columns-5);
	canvas.setHeight(55*level.rows-5);
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
				tile.set('fill','red');
		else
				tile.set('fill','blue');
		tile.set({left:l,top:t});
		tile.selectable=false;
		canvas.add(tile);
	};
	//make all blue;
	setTimeout(function(){ take_input(level);},4000);
	//take_input(level);
}

function take_input(level)
{
	//check if its ans tiles or not and increase counter for chances
	turns=level.no_of_tiles;
	for (var i = 0; i < level.rows*level.columns; i++) 
		{
			//animate this
			canvas.item(i).set('fill','red');
		};
	canvas.renderAll();
	canvas.on('mouse:down', function(options) 
	{	  
	  if (options.target) 
	  {
	  	console.log(turns);
	  	if(options.target.type=='rect')
	    {
	    	var pos=ans_tiles.indexOf(options.target.tile_number);
	    	if(pos==-1)
	    	{
	    		//flash a cross
	    		alert("wrong");
	    	}
	    	else
	    	{
	    		//turn the rect blue
	    		options.target.animate('angle', 720, {
				  onChange: canvas.renderAll.bind(canvas),
				  duration: 1000,
				  easing: fabric.util.ease.easeOutBounce
				});
				options.target.set('fill','blue');
				canvas.renderAll();
				ans_tiles.splice(pos,1);
	    	}
	    	turns--;
	    	if(turns==0)
	    	{	
	    		//end    
	    		console.log('cuurent level' + level.level_no)		
				if(ans_tiles.length==0)
				{
					setTimeout(function(){ tlevel_show(levels[level.level_no+1]);},1500);					
				}
				else
				{
				 //remaining ones have to be changed
				 while(ans_tiles.length)
				 {
				 	//animate it 
				 	canvas.item(ans_tiles[0]).set('fill','blue');
				 	ans_tiles.splice(0,1);
				 	canvas.renderAll();
				 }
				 setTimeout(function(){ tlevel_show(levels[level.level_no]);},1500);
				}
	    	}
	    }
	  }
	});	
}

level_show(levels[1]);
