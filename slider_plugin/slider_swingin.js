/*
    slider_swingin.js

	This is a slider plug-in that adds the swingIn button update method.
	
*/

// slider_staticdelta plug-in
Slider.addPlugin({
		
	// Button Class properties and default values.
	buttonDefaults : {

	    // add's dx, and dy which stands for deltaX and deltaY
		props : 'cx,cy,clockwise,xRadius,yRadius,startRadian,radianMove'.split(','),
		values : [0,0,true,100,100,0,Math.PI/2]

	},

	// add the staticDelta update method
	buttonUpdateMethods : {
				
		swingIn : function(scene){
				
			var clockwise =  -1 +  2 * Number(this.clockwise);
			
			this.x = Math.cos(this.startRadian + this.radianMove / scene.maxFrames * scene.frame * clockwise ) *  this.xRadius + this.cx - this.w / 2,
			this.y = Math.sin(this.startRadian + this.radianMove / scene.maxFrames * scene.frame * clockwise ) *  this.yRadius + this.cy - this.h / 2
		    
		}
								
	}

});