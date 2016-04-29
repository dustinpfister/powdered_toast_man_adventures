/*    
 *    map.js
 *
 *    needs: nothing
 *
 *    
 *
 *
 *
 */

var map = {
	
	width: 3000,
	height: 1000,
	horizon: -50 // the map relative y value that represents the horizon

},

viewPort = {
	
	width: 640,
	height:480,
	x: -640,  // the map relative position of the view ports upper left corner.
	y: -480,
	
	// give a view port relative position, with the given map relative mapx, and and mapy arguments  
    getVPRelative:function(mapX, mapY){
	
	    return {
		
		    x : (this.x - mapX) * -1,
		    y : (this.y - mapY) * -1
		
	    };
	
    },
	
	// move the view port into a map position where mapX, and mapY represents a map position that should end up laying in the center of the view port.
	moveViewPort : function(mapX,mapY){
	    
        this.x = mapX - Math.floor(this.width / 2);
        this.y = mapY - Math.floor(this.height / 2);
		
	}
	
};